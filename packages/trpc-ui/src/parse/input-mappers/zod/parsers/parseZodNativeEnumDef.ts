import { nodePropertiesFromRef } from "@src/parse/utils";
import type { EnumNode, ParseFunction } from "../../../parseNodeTypes";
import type { ZodNativeEnumDef } from "../zod-compat";

export const parseZodNativeEnumDef: ParseFunction<
  ZodNativeEnumDef,
  EnumNode
> = (def, refs) => {
  // In Zod v3, native enums use 'values' object
  // In Zod v4, native enums use 'entries' object
  const defTyped = def as {
    values?: Record<string, unknown>;
    entries?: Record<string, unknown>;
  };
  const valuesObject = defTyped.values || defTyped.entries || {};
  const values = Object.values(valuesObject) as string[];
  refs.addDataFunctions.addDescriptionIfExists(def, refs);
  return { type: "enum", enumValues: values, ...nodePropertiesFromRef(refs) };
};
