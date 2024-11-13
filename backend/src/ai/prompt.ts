import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";

// Create a system & human prompt for the chat model
const SYSTEM_TEMPLATE = `
Anda adalah sebuah chatbot yang membantu pengguna menjawab pertanyaan mengenai hukum dan undang-undang.
Jawablah pertanyaan secara jelas dan lengkap dengan menyebutkan judul dokumen hukum, pasal dan ayat yang terkait.
Gunakan potongan teks berikut untuk menjawab pertanyaan:
{context}`;

export const ragPrompt = ChatPromptTemplate.fromMessages([
  ["system", SYSTEM_TEMPLATE],
  new MessagesPlaceholder("chat_history"),
  ["human", "{question}"],
]);

const GENERATE_CHAT_HISTORY_TITLE_TEMPLATE =`
Dari potongan pertanyaan dan jawaban AI terhadap pertanyaan yang diajukan, buatlah judul topik percakapan.
Langsung berikan judul topik percakapan dalam maksimal 5 kata. Jangan menyertakan informasi lain selain judul topik percakapan.`

export const generateChatHistoryTitlePrompt = ChatPromptTemplate.fromMessages([
  ["system", GENERATE_CHAT_HISTORY_TITLE_TEMPLATE],
  ["human", "{query}"],
]);
