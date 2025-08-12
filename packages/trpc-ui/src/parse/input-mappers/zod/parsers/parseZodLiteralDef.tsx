import { nodePropertiesFromRef } from "@src/parse/utils";
import type { LiteralNode, ParseFunction } from "../../../parseNodeTypes";
import type { ZodLiteralDef } from "../zod-compat";

export const parseZodLiteralDef: ParseFunction<ZodLiteralDef, LiteralNode> = (
  def,
  refs,
) => {
  refs.addDataFunctions.addDescriptionIfExists(def, refs);
  // In Zod v3, literals use 'value'
  // In Zod v4, literals use 'values' array
  const defTyped = def as { value?: unknown; values?: unknown[] };
  const value =
    defTyped.value !== undefined ? defTyped.value : defTyped.values?.[0];
  return {
    type: "literal",
    value,
    ...nodePropertiesFromRef(refs),
  };
};
