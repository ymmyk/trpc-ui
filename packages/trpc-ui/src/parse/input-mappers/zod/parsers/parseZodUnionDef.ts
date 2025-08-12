import { nodePropertiesFromRef } from "@src/parse/utils";
import type {
  LiteralNode,
  ParseFunction,
  UnionNode,
} from "../../../parseNodeTypes";
import { zodSelectorFunction } from "../selector";
import type { ZodUnionDef } from "../zod-compat";

export const parseZodUnionDef: ParseFunction<ZodUnionDef, UnionNode> = (
  def,
  refs,
) => {
  refs.addDataFunctions.addDescriptionIfExists(def, refs);
  return {
    type: "union",
    values: def.options.map(
      (o: unknown) =>
        zodSelectorFunction((o as { _def: unknown })._def, {
          ...refs,
          path: [],
        }) as LiteralNode,
    ),
    ...nodePropertiesFromRef(refs),
  };
};
