import { Chroma } from "@langchain/community/vectorstores/chroma";
import { OpenAIEmbeddings } from "@langchain/openai";
import 'dotenv/config';
import { embeddingsModel } from "../ai/embeddingModel.js";
import {
    PGVectorStore,
    type DistanceStrategy,
  } from "@langchain/community/vectorstores/pgvector";
import type { PoolConfig } from "pg";


/*
export const chromaVectorStore = new Chroma(embeddingsModel, {
    collectionName: "law-collection",
    url: process.env.CHROMA_URL,
    collectionMetadata: {
        "hnsw:space": "cosine",
    }
})
*/


console.log(process.env.DATABASE_URL)
// Sample config
const config = {
    postgresConnectionOptions: {
      connectionString: process.env.DATABASE_URL
    } as PoolConfig,
    tableName: "law_embedding",
    columns: {
      idColumnName: "id",
      vectorColumnName: "vector",
      contentColumnName: "content",
      metadataColumnName: "metadata",
    },
    // supported distance strategies: cosine (default), innerProduct, or euclidean
    distanceStrategy: "cosine" as DistanceStrategy,
  };
  
export const postgresVectorStore = await PGVectorStore.initialize(embeddingsModel, config); 
console.log('success')
