import { chromaVectorStore } from "../vectorDB/chroma"
import { RunnablePassthrough, RunnableSequence } from "@langchain/core/runnables";
import { formatDocumentsAsString } from "langchain/util/document";
import { chatModel } from "./chatModel";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ragPrompt } from "./prompt";

interface ChatbotInput {
    question: string;
    chatHistory: [],
    lawIds: number[]
}

export async function getAnswerFromRAG(input: ChatbotInput) {
    try{
    if (input.question.length=== 0) throw Error("Question cannot be empty");
    if (input.lawIds.length === 0) throw Error("Law IDs cannot be empty");
    
    // Initialize a retriever wrapper around the vector store
    const result = ((await chromaVectorStore.similaritySearchWithScore(input.question, 10, {
        "$or": (input.lawIds.map(id => ({ lawId: id }))
            .concat([{ lawId: input.lawIds[0] }])) // to make sure that at least two laws are returned
    })).map(item => `Judul:${item[0].metadata['title']}\nIsi:\n${item[0].pageContent}`)).join('\n\n') || 'Tidak ada hasil yang relevan.' ;
    console.log(result);
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
