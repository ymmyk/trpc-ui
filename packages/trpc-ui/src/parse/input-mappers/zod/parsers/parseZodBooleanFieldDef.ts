import { nodePropertiesFromRef } from "@src/parse/utils";
import type { BooleanNode, ParseFunction } from "../../../parseNodeTypes";
import type { ZodBooleanDef } from "../zod-compat";

export const parseZodBooleanFieldDef: ParseFunction<
  ZodBooleanDef,
  BooleanNode
> = (def, refs) => {
  refs.addDataFunctions.addDescriptionIfExists(def, refs);
  return { type: "boolean", ...nodePropertiesFromRef(refs) };
};
