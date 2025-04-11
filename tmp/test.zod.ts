import { z } from "zod";

export type TestObject = z.infer<typeof TestObject>;
export const TestObject = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  multilineDesc: z.string().optional(),
});

export type TestObjectWithNewline = z.infer<typeof TestObjectWithNewline>;
export const TestObjectWithNewline = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
});
