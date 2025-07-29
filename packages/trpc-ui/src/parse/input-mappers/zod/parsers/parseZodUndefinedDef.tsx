import type {
  ParseReferences,
  ParsedInputNode,
} from "@src/parse/parseNodeTypes";
import { nodePropertiesFromRef } from "@src/parse/utils";
import type { ZodUndefinedDef } from "../zod-compat";

export function parseZodUndefinedDef(
  def: ZodUndefinedDef,
  refs: ParseReferences,
): ParsedInputNode {
  refs.addDataFunctions.addDescriptionIfExists(def, refs);
  return {
    type: "literal",
    value: undefined,
    ...nodePropertiesFromRef(refs),
  };
}
