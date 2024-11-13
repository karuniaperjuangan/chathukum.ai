import { StringOutputParser } from "@langchain/core/output_parsers";
import { chatModel } from "./chatModel";
import { generateChatHistoryTitlePrompt } from "./prompt";

export async function generateChatHistoryTitle(messages: string[][]) {
    // Message is an array of two strings, the first being the role of sender and the second being the message
    const contentString = messages.map(message => `${message[0]}: ${message[1]}`).join('\n');
    const pipe = generateChatHistoryTitlePrompt.pipe(chatModel).pipe(new StringOutputParser());
    const title = await pipe.invoke({"query":contentString});
    return title;
}