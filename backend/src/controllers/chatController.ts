import type { Request, Response } from 'express';
import { db } from '../db.ts';
import { lawData, lawStatus, lawUrl, lawVectordbStatus } from '../db/schema.ts';
import { chromaVectorStore } from '../vectordb/chroma.ts';
import { Document } from 'langchain/document';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import pdfParse from 'pdf-parse';
import {and, eq} from 'drizzle-orm'

async function extractTextFromPDFUrl(url:string) {
    try {
        const response = await fetch(url);
        let text = "";
        const data = await pdfParse(Buffer.from(await response.arrayBuffer()),{
            version:'v2.0.550'
        });
        return data.text;
    } catch (error) {
        console.error(`Error extracting text from ${url}:`, error);
        return null;
    }
}

async function getLawPDFContentbyID(id:string){
    const law = await db.select({url:lawUrl.downloadUrl}).from(lawData).leftJoin(lawUrl,(eq(lawData.id,lawUrl.lawId))).where(eq(lawData.id as any,parseInt(id)))
    // Check if the law exists in the database. If not, return an error response.
    if(!law){
        throw new Error(`Law with ID ${id} not found.`);
    }
    // Download the law file from the URL and send it as a response
    let lawContent = '';
    for(const law_file of law){
        if(!law_file.url) continue;
        const content = await extractTextFromPDFUrl('https://peraturan.bpk.go.id/'+law_file.url) || '';
        if(content) {
            lawContent += content;
        }
    }
    lawContent = lawContent.replace(RegExp(/\n+/g),'\n');
    lawContent = lawContent.replace(RegExp(/(?<=[a-z],)\n/g)," "); 
    lawContent = lawContent.trim();
    return lawContent;
}

async function uploadLawtoVectorDB(lawContent:string,lawId:number){
    // If already exist in lawVectorDBStatus, skip the upload process.
    const lawVectorDBStatus = await db.select().from(lawVectordbStatus).where(and(eq(lawVectordbStatus.lawId,lawId),eq(lawVectordbStatus.hasVectordbRecord,true)))
    if(lawVectorDBStatus && lawVectorDBStatus.length > 0){
        console.log(`Law with ID ${lawId} already exists in the vector database. Skipping upload.`);
        await db.update(lawVectordbStatus).set({
            hasVectordbRecord:true,
            lastUpdated: new Date().toISOString(),
        }).where(eq(lawVectordbStatus.lawId,lawId));
        return [];
    }
    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 2500,
        chunkOverlap: 100
    });
    const chunks = await textSplitter.splitText(lawContent);
    const documents = chunks.map(chunk=>{
        return new Document({
            metadata:{
                lawId:lawId,
            },
            pageContent:chunk,
        });
    })
    // add document to vector store
    const ids = await chromaVectorStore.addDocuments(documents);
    await db.insert(lawVectordbStatus).values({
        lawId:lawId,
        hasVectordbRecord:true,
        lastUpdated: new Date().toISOString(),
    }).onConflictDoUpdate({
        target:lawVectordbStatus.lawId,
        set:{
            hasVectordbRecord:true,
            lastUpdated: new Date().toISOString(),
        }
    })
    return ids;
}

async function uploadMultipleLaws(lawIds: number[]) {
    let ids: string[] = [];
    try{
        for(const id of lawIds) {
        const lawContent = await getLawPDFContentbyID(id.toString());
         ids.concat(await uploadLawtoVectorDB(lawContent,id)) 
        }
        return ids;
    } catch(error:any){
        console.error(error);
        throw error;
    }
}

export async function processLawPDF(req:Request,res:Response) {
    const lawIds: string[] = req.body.law_ids;
    try{
        const ids = await uploadMultipleLaws(lawIds.map(id=>parseInt(id)));
        res.status(200).json({ids:ids});
        return;
    } catch(error:any){
        console.error(error);
        res.status(500).json({error:error.message});
        return;
    }
};

export async function retrieveLawContent(req:Request,res:Response) {
    const lawIds:number[] = req.body.law_ids;
    const query:string = req.body.query;
    try{
        const ids =await uploadMultipleLaws(lawIds);
        console.log(ids);
        const result = await chromaVectorStore.similaritySearchWithScore(query,10,{
            "$or": (lawIds.map(id=>({id:id})).concat([{id:lawIds[0]}]))
        })
        res.status(200).json(result);
        return;
    } catch(error:any){
        console.error(error);
        res.status(500).json({error:error.message});
        return;
    }
}