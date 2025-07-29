import { defaultReferences } from "@src/parse/input-mappers/defaultReferences";
import { parseZodPromiseDef } from "@src/parse/input-mappers/zod/parsers/parseZodPromiseDef";
import type { NumberNode } from "@src/parse/parseNodeTypes";
import { z } from "zod";

describe("Parse ZodPromise", () => {
  it("should parse a zod promise as it's underlying node type", () => {
    const expected: NumberNode = {
      type: "number",
      path: [],
    };
    const schema = z.promise(z.number());
    expect(parseZodPromiseDef(schema._def, defaultReferences())).toStrictEqual(
      expected,
    );
  });
});
