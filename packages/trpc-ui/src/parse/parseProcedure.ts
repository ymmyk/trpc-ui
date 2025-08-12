import type {
  JSON7SchemaType,
  ProcedureType,
  TrpcPanelExtraOptions,
} from "./parseRouter";
import {
  type Procedure,
  isMutationDef,
  isQueryDef,
  isSubscriptionDef,
} from "./routerType";

import type {
  AddDataFunctions,
  ParseReferences,
  ParsedInputNode,
} from "@src/parse/parseNodeTypes";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { zodSelectorFunction } from "./input-mappers/zod/selector";
import { type AnyZodObject } from "./input-mappers/zod/zod-compat";

export type ProcedureExtraData = {
  parameterDescriptions: { [path: string]: string };
  description?: string;
};

export type ParsedProcedure = {
  inputSchema: JSON7SchemaType;
  node: ParsedInputNode;
  nodeType: "procedure";
  procedureType: ProcedureType;
  pathFromRootRouter: string[];
  extraData: ProcedureExtraData;
};

type SupportedInputType = "zod";

const inputParserMap = {
  zod: (zodObject: AnyZodObject, refs: ParseReferences) => {
    return zodSelectorFunction(zodObject._def, refs);
  },
};

function inputType(_: unknown): SupportedInputType | "unsupported" {
  return "zod";
}

type NodeAndInputSchemaFromInputs =
  | {
      node: ParsedInputNode;
      schema: ReturnType<typeof zodToJsonSchema>;
      parseInputResult: "success";
    }
  | {
      parseInputResult: "failure";
    };

const emptyZodObject = z.object({});
function nodeAndInputSchemaFromInputs(
  inputs: unknown[],
  _routerPath: string[],
  options: TrpcPanelExtraOptions,
  addDataFunctions: AddDataFunctions,
): NodeAndInputSchemaFromInputs {
  if (!inputs.length) {
    return {
      parseInputResult: "success",
      schema: zodToJsonSchema(emptyZodObject, {
        errorMessages: true,
        $refStrategy: "none",
      }),
      node: inputParserMap.zod(emptyZodObject, {
        path: [],
        options,
        addDataFunctions,
      }),
    };
  }

  let input = inputs[0];
  if (inputs.length < 1) {
    return { parseInputResult: "failure" };
  }

  if (inputs.length > 1) {
    const allInputsAreZodObjects = inputs.every(
      (input) => input instanceof z.ZodObject,
    );
    if (!allInputsAreZodObjects) {
      return { parseInputResult: "failure" };
    }

    input = inputs.reduce(
      (acc, input: AnyZodObject) => (acc as AnyZodObject).merge(input),
      emptyZodObject,
    );
  }

  const iType = inputType(input);
  if (iType === "unsupported") {
    return { parseInputResult: "failure" };
  }

  return {
    parseInputResult: "success",
    schema: zodToJsonSchema(input as z.ZodType, {
      errorMessages: true,
      $refStrategy: "none",
    }), //
    node: zodSelectorFunction((input as { _def: unknown })._def, {
      path: [],
      options,
      addDataFunctions,
    }),
  };
}

export function parseProcedure(
  procedure: Procedure,
  path: string[],
  options: TrpcPanelExtraOptions,
): ParsedProcedure | null {
  const { _def } = procedure;
  const { inputs } = _def;
  const parseExtraData: ProcedureExtraData = {
    parameterDescriptions: {},
  };
  const nodeAndInput = nodeAndInputSchemaFromInputs(inputs, path, options, {
    addDescriptionIfExists: (def, refs) => {
      if (def.description) {
        parseExtraData.parameterDescriptions[refs.path.join(".")] =
          def.description;
      }
    },
  });
  if (nodeAndInput.parseInputResult === "failure") {
    return null;
  }

  const t = (() => {
    if (isQueryDef(_def)) return "query";
    if (isMutationDef(_def)) return "mutation";
    if (isSubscriptionDef(_def)) return "subscription";
    return null;
  })();

  if (!t) {
    return null;
  }

  return {
    inputSchema: nodeAndInput.schema,
    node: nodeAndInput.node,
    nodeType: "procedure",
    procedureType: t,
    pathFromRootRouter: path,
    extraData: {
      ...parseExtraData,
      ...(procedure._def.meta?.description && {
        description: procedure._def.meta.description,
      }),
    },
  };
}
