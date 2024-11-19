import { postgresVectorStore } from "../vectorDB/vectorStore.js"
import { RunnablePassthrough, RunnableSequence } from "@langchain/core/runnables";
import { chatModel } from "./chatModel.js";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ragPrompt } from "./prompt.js";

interface ChatbotInput {
    question: string;
    chatHistory: [],
    lawIds: number[]
}

export async function getAnswerFromRAG(input: ChatbotInput) {
    try {
        if (input.question.length === 0) throw Error("Question cannot be empty");
        if (input.lawIds.length === 0) throw Error("Law IDs cannot be empty");

        // Initialize a retriever wrapper around the vector store
        const result = ((await postgresVectorStore.similaritySearchWithScore(input.question, 10, {
            "lawId": {"in":input.lawIds.concat([input.lawIds[0]])} 
        })).map(item => `Judul:${item[0].metadata['title']}\nIsi:\n${item[0].pageContent}`)).join('\n\n') || 'Tidak ada hasil yang relevan.';
        const chain = RunnableSequence.from([
            RunnablePassthrough.assign({
                context: () => result
            }),
            ragPrompt,
            chatModel,
            new StringOutputParser(),
        ]);

        const answer = await chain.invoke(
            {
                question: input.question,
                chat_history: input.chatHistory,
            }
        );
        return answer;
    } catch (error) {
        console.error(error);
        throw error;
    }

}
