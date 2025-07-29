import { parseZodBigIntDef } from "@src/parse/input-mappers/zod/parsers/parseZodBigIntDef";
import { parseZodBrandedDef } from "@src/parse/input-mappers/zod/parsers/parseZodBrandedDef";
import { parseZodDefaultDef } from "@src/parse/input-mappers/zod/parsers/parseZodDefaultDef";
import { parseZodEffectsDef } from "@src/parse/input-mappers/zod/parsers/parseZodEffectsDef";
import { parseZodNullDef } from "@src/parse/input-mappers/zod/parsers/parseZodNullDef";
import { parseZodNullableDef } from "@src/parse/input-mappers/zod/parsers/parseZodNullableDef";
import { parseZodOptionalDef } from "@src/parse/input-mappers/zod/parsers/parseZodOptionalDef";
import { parseZodPromiseDef } from "@src/parse/input-mappers/zod/parsers/parseZodPromiseDef";
import { parseZodUndefinedDef } from "@src/parse/input-mappers/zod/parsers/parseZodUndefinedDef";
import { parseZodUnionDef } from "@src/parse/input-mappers/zod/parsers/parseZodUnionDef";
import type { ParserSelectorFunction } from "../../parseNodeTypes";
import { parseZodArrayDef } from "./parsers/parseZodArrayDef";
import { parseZodBooleanFieldDef } from "./parsers/parseZodBooleanFieldDef";
import {
  type ZodDiscriminatedUnionDefUnversioned,
  parseZodDiscriminatedUnionDef,
} from "./parsers/parseZodDiscriminatedUnionDef";
import { parseZodEnumDef } from "./parsers/parseZodEnumDef";
import { parseZodLiteralDef } from "./parsers/parseZodLiteralDef";
import { parseZodNativeEnumDef } from "./parsers/parseZodNativeEnumDef";
import { parseZodNumberDef } from "./parsers/parseZodNumberDef";
import { parseZodObjectDef } from "./parsers/parseZodObjectDef";
import { parseZodStringDef } from "./parsers/parseZodStringDef";
import { parseZodVoidDef } from "./parsers/parseZodVoidDef";
import {
  type ZodArrayDef,
  type ZodBigIntDef,
  type ZodBooleanDef,
  type ZodBrandedDef,
  type ZodDefaultDef,
  type ZodEffectsDef,
  type ZodEnumDef,
  ZodFirstPartyTypeKind,
  type ZodLiteralDef,
  type ZodNativeEnumDef,
  type ZodNullDef,
  type ZodNullableDef,
  type ZodNumberDef,
  type ZodObjectDef,
  type ZodOptionalDef,
  type ZodPromiseDef,
  type ZodStringDef,
  type ZodUndefinedDef,
  type ZodUnionDef,
  type ZodVoidDef,
  hasZodV4,
} from "./zod-compat";
import type { ZodDefWithType } from "./zod-types";

export const zodSelectorFunction: ParserSelectorFunction<ZodDefWithType> = (
  def,
  references,
) => {
  // Check if this is Zod v4 (uses 'type' field) or v3 (uses 'typeName' field)
  const typeIdentifier = hasZodV4 ? def.type : def.typeName;

  // Map v4 type names to v3 style if needed
  const normalizeTypeName = (type: string) => {
    if (!hasZodV4) return type;

    // v4 uses lowercase names, v3 uses ZodFirstPartyTypeKind enum values
    const v4ToV3Map: Record<string, string> = {
      array: "ZodArray",
      bigint: "ZodBigInt",
      boolean: "ZodBoolean",
      branded: "ZodBranded",
      default: "ZodDefault",
      discriminated_union: "ZodDiscriminatedUnion",
      effects: "ZodEffects",
      enum: "ZodEnum",
      literal: "ZodLiteral",
      nativeEnum: "ZodNativeEnum",
      null: "ZodNull",
      nullable: "ZodNullable",
      number: "ZodNumber",
      object: "ZodObject",
      optional: "ZodOptional",
      promise: "ZodPromise",
      string: "ZodString",
      undefined: "ZodUndefined",
      union: "ZodUnion",
      void: "ZodVoid",
    };

    return v4ToV3Map[type] || type;
  };

  const normalizedType = normalizeTypeName(typeIdentifier);

  // Please keep these in alphabetical order
  switch (normalizedType) {
    case "ZodArray":
    case ZodFirstPartyTypeKind?.ZodArray:
      return parseZodArrayDef(def as ZodArrayDef, references);
    case "ZodBoolean":
    case ZodFirstPartyTypeKind?.ZodBoolean:
      return parseZodBooleanFieldDef(def as ZodBooleanDef, references);
    case "ZodDiscriminatedUnion":
    case ZodFirstPartyTypeKind?.ZodDiscriminatedUnion:
      return parseZodDiscriminatedUnionDef(
        // Zod had some type changes between 3.19 -> 3.20 and we want to support both, not sure there's a way
        // to avoid this.
        def as unknown as ZodDiscriminatedUnionDefUnversioned,
        references,
      );
    case "ZodEnum":
    case ZodFirstPartyTypeKind?.ZodEnum:
      return parseZodEnumDef(def as ZodEnumDef, references);
    case "ZodNativeEnum":
    case ZodFirstPartyTypeKind?.ZodNativeEnum:
      return parseZodNativeEnumDef(def as ZodNativeEnumDef, references);
    case "ZodLiteral":
    case ZodFirstPartyTypeKind?.ZodLiteral:
      return parseZodLiteralDef(def as ZodLiteralDef, references);
    case "ZodNumber":
    case ZodFirstPartyTypeKind?.ZodNumber:
      return parseZodNumberDef(def as ZodNumberDef, references);
    case "ZodObject":
    case ZodFirstPartyTypeKind?.ZodObject:
      return parseZodObjectDef(def as ZodObjectDef, references);
    case "ZodOptional":
    case ZodFirstPartyTypeKind?.ZodOptional:
      return parseZodOptionalDef(def as ZodOptionalDef, references);
    case "ZodString":
    case ZodFirstPartyTypeKind?.ZodString:
      return parseZodStringDef(def as ZodStringDef, references);
    case "ZodNullable":
    case ZodFirstPartyTypeKind?.ZodNullable:
      return parseZodNullableDef(def as ZodNullableDef, references);
    case "ZodBigInt":
    case ZodFirstPartyTypeKind?.ZodBigInt:
      return parseZodBigIntDef(def as ZodBigIntDef, references);
    case "ZodBranded":
    case ZodFirstPartyTypeKind?.ZodBranded:
      return parseZodBrandedDef(def as ZodBrandedDef, references);
    case "ZodDefault":
    case ZodFirstPartyTypeKind?.ZodDefault:
      return parseZodDefaultDef(def as ZodDefaultDef, references);
    case "ZodEffects":
    case ZodFirstPartyTypeKind?.ZodEffects:
      return parseZodEffectsDef(def as ZodEffectsDef, references);
    case "ZodNull":
    case ZodFirstPartyTypeKind?.ZodNull:
      return parseZodNullDef(def as ZodNullDef, references);
    case "ZodPromise":
    case ZodFirstPartyTypeKind?.ZodPromise:
      return parseZodPromiseDef(def as ZodPromiseDef, references);
    case "ZodUndefined":
    case ZodFirstPartyTypeKind?.ZodUndefined:
      return parseZodUndefinedDef(def as ZodUndefinedDef, references);
    case "ZodUnion":
    case ZodFirstPartyTypeKind?.ZodUnion:
      return parseZodUnionDef(def as ZodUnionDef, references);
    case "ZodVoid":
    case ZodFirstPartyTypeKind?.ZodVoid:
      return parseZodVoidDef(def as ZodVoidDef, references);
  }
  return { type: "unsupported", path: references.path };
};
