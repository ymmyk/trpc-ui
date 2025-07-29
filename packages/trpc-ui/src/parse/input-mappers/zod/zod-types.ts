import * as z from "zod";

// For Zod v3, we use typeName with ZodFirstPartyTypeKind
// For Zod v4, we use type with string literals
export type ZodDefWithType = {
  typeName?: unknown; // v3 uses this
  type?: string; // v4 uses this
  [key: string]: unknown; // allow other properties
};
