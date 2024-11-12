import { OpenAIEmbeddings } from "@langchain/openai";

export const embeddingsModel = new OpenAIEmbeddings({
    model: "text-embedding-3-small",
})