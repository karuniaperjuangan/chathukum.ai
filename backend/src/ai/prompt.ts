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