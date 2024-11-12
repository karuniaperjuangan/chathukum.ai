import { Chroma } from "@langchain/community/vectorstores/chroma";
import { OpenAIEmbeddings } from "@langchain/openai";
import 'dotenv/config';
import { embeddingsModel } from "../ai/embeddingModel";



export const chromaVectorStore = new Chroma(embeddingsModel,{
    collectionName:"law-collection",
    url:process.env.CHROMA_URL,
    collectionMetadata:{
        "hnsw:space":"cosine",
    }
})