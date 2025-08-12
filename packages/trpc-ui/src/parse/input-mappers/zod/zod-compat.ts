import * as z from "zod";

// Check if we have Zod v4 (has core export)
export const hasZodV4 = "core" in z;

// Get the appropriate type definitions based on Zod version
export function getZodTypeDef(name: string): unknown {
  if (hasZodV4 && z.core) {
    // In v4, type definitions are in core with $ prefix
    return (z.core as Record<string, unknown>)[`$${name}`];
  }
  // In v3, type definitions are exported directly
  return (z as Record<string, unknown>)[name];
}

// Type aliases that work for both v3 and v4
// Using unknown is safer than any and satisfies the linter
export type ZodArrayDef = unknown;
export type ZodBigIntDef = unknown;
export type ZodBooleanDef = unknown;
export type ZodBrandedDef = unknown;
export type ZodDefaultDef = unknown;
export type ZodEffectsDef = unknown;
export type ZodEnumDef = unknown;
export type ZodLiteralDef = unknown;
export type ZodNativeEnumDef = unknown;
export type ZodNullDef = unknown;
export type ZodNullableDef = unknown;
export type ZodNumberDef = unknown;
export type ZodObjectDef = unknown;
export type ZodOptionalDef = unknown;
export type ZodPromiseDef = unknown;
export type ZodStringDef = unknown;
export type ZodUndefinedDef = unknown;
export type ZodUnionDef = unknown;
export type ZodVoidDef = unknown;
export type ZodDiscriminatedUnionDef = unknown;

// For AnyZodObject replacement
export type AnyZodObject = unknown;

// Get ZodFirstPartyTypeKind for v3
export const ZodFirstPartyTypeKind = hasZodV4
  ? {}
  : (z as Record<string, unknown>).ZodFirstPartyTypeKind || {};
