import { nodePropertiesFromRef } from "@src/parse/utils";
import type { ParseFunction, StringNode } from "../../../parseNodeTypes";
import type { ZodStringDef } from "../zod-compat";

export const parseZodStringDef: ParseFunction<ZodStringDef, StringNode> = (
  def,
  refs,
) => {
  refs.addDataFunctions.addDescriptionIfExists(def, refs);
  return {
    type: "string",
    ...nodePropertiesFromRef(refs),
  };
};
