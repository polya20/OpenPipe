import type { ChatCompletion, ChatCompletionChunk } from "openai/resources/chat";

const omit = <T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  ...keys: K[]
): Omit<T, K> => {
  const ret = { ...obj };
  for (const key of keys) {
    delete ret[key];
  }
  return ret;
};

export default function mergeChunks(
  base: ChatCompletion | null,
  chunk: ChatCompletionChunk,
): ChatCompletion {
  if (base === null) {
    return mergeChunks({ ...chunk, object: "chat.completion", choices: [] }, chunk);
  }

  const choices = [...base.choices];
  for (const choice of chunk.choices) {
    const baseChoice = choices.find((c) => c.index === choice.index);
    if (baseChoice) {
      baseChoice.finish_reason = choice.finish_reason ?? baseChoice.finish_reason;
      baseChoice.message = baseChoice.message ?? { role: "assistant" };

      if (choice.delta?.content)
        baseChoice.message.content =
          (baseChoice.message.content ?? "") + (choice.delta.content ?? "");
      if (choice.delta?.function_call) {
        const fnCall = baseChoice.message.function_call ?? {
          name: "",
          arguments: "",
        };
        fnCall.name = fnCall.name + (choice.delta.function_call.name ?? "");
        fnCall.arguments = fnCall.arguments + (choice.delta.function_call.arguments ?? "");
      }
    } else {
      // @ts-expect-error the types are correctly telling us that finish_reason
      // could be null, but don't want to fix it right now.
      choices.push({ ...omit(choice, "delta"), message: { role: "assistant", ...choice.delta } });
    }
  }

  const merged: ChatCompletion = {
    ...base,
    choices,
  };

  return merged;
}
