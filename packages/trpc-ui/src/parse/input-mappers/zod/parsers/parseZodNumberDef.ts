import { nodePropertiesFromRef } from "@src/parse/utils";
import type { NumberNode, ParseFunction } from "../../../parseNodeTypes";
import type { ZodNumberDef } from "../zod-compat";

export const parseZodNumberDef: ParseFunction<ZodNumberDef, NumberNode> = (
  def,
  refs,
) => {
  refs.addDataFunctions.addDescriptionIfExists(def, refs);
  return {
    type: "number",
    ...nodePropertiesFromRef(refs),
  };
};
