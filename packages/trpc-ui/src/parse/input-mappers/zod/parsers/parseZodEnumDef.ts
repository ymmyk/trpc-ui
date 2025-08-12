import { nodePropertiesFromRef } from "@src/parse/utils";
import type { EnumNode, ParseFunction } from "../../../parseNodeTypes";
import type { ZodEnumDef } from "../zod-compat";

export const parseZodEnumDef: ParseFunction<ZodEnumDef, EnumNode> = (
  def,
  refs,
) => {
  // In Zod v3, enums use 'values' array
  // In Zod v4, enums use 'entries' object
  const defTyped = def as {
    values?: string[];
    entries?: Record<string, string>;
  };
  const values = defTyped.values || Object.values(defTyped.entries || {});
  refs.addDataFunctions.addDescriptionIfExists(def, refs);
  return {
    type: "enum",
    enumValues: values as string[],
    ...nodePropertiesFromRef(refs),
  };
};
