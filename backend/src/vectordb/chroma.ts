import { Chroma } from "@langchain/community/vectorstores/chroma";
import { OpenAIEmbeddings } from "@langchain/openai";
import 'dotenv/config';

const embeddings = new OpenAIEmbeddings({
    model: "text-embedding-3-small",
})

export const chromaVectorStore = new Chroma(embeddings,{
    collectionName:"law-collection",
    url:process.env.CHROMA_URL,
    collectionMetadata:{
        "hnsw:space":"cosine",
    }
})