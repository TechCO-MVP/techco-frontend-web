import { getDictionary } from "@/get-dictionary";

export type ValidationErrorMessages = Awaited<
  ReturnType<typeof getDictionary>
>["validationErrors"];

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>;
