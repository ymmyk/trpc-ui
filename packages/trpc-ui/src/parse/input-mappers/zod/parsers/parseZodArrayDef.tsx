import { nodePropertiesFromRef } from "@src/parse/utils";
import type { ArrayNode, ParseFunction } from "../../../parseNodeTypes";
import { zodSelectorFunction } from "../selector";
import type { ZodArrayDef } from "../zod-compat";

export const parseZodArrayDef: ParseFunction<ZodArrayDef, ArrayNode> = (
  def,
  refs,
) => {
  const { type } = def as { type: { _def: unknown } };
  const childType = zodSelectorFunction(type._def, { ...refs, path: [] });
  refs.addDataFunctions.addDescriptionIfExists(def, refs);
  return {
    type: "array",
    childType,
    ...nodePropertiesFromRef(refs),
  };
};
