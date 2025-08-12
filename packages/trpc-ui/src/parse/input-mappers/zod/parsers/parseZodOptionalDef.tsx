import type { ParseFunction, ParsedInputNode } from "../../../parseNodeTypes";
import { zodSelectorFunction } from "../selector";
import type { ZodOptionalDef } from "../zod-compat";

export const parseZodOptionalDef: ParseFunction<
  ZodOptionalDef,
  ParsedInputNode
> = (def, refs) => {
  const parsedInner = zodSelectorFunction(def.innerType._def, refs);
  refs.addDataFunctions.addDescriptionIfExists(def, refs);
  return {
    ...parsedInner,
    optional: true,
  };
};
