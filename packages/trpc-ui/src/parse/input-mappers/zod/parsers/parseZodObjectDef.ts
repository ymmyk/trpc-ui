import { nodePropertiesFromRef } from "@src/parse/utils";
import type {
  ObjectNode,
  ParseFunction,
  ParsedInputNode,
  UnsupportedNode,
} from "../../../parseNodeTypes";
import { zodSelectorFunction } from "../selector";
import type { ZodObjectDef } from "../zod-compat";

export const parseZodObjectDef: ParseFunction<
  ZodObjectDef,
  ObjectNode | UnsupportedNode
> = (def, refs) => {
  // In Zod v3, shape is a function: def.shape()
  // In Zod v4, shape is a property: def.shape
  const defTyped = def as { shape?: unknown | (() => unknown) };
  const shape = typeof defTyped.shape === 'function' ? defTyped.shape() : defTyped.shape;
  
  if (!shape || typeof shape !== 'object') {
    return { type: "unsupported", path: refs.path };
  }
  
  const children: { [propertyName: string]: ParsedInputNode } = {};
  for (const propertyName of Object.keys(shape as Record<string, unknown>)) {
    const shapeObj = shape as Record<string, { _def: unknown }>;
    const node = zodSelectorFunction(shapeObj[propertyName]?._def, {
      ...refs,
      path: refs.path.concat([propertyName]),
    });
    children[propertyName] = node;
  }
  refs.addDataFunctions.addDescriptionIfExists(def, refs);
  return {
    type: "object",
    children,
    ...nodePropertiesFromRef(refs),
  };
};
