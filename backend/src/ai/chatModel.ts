import { ChatOpenAI } from "@langchain/openai";

export const chatModel = new ChatOpenAI({
    model:"gpt-4o-mini"
})