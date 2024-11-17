import { eq, and } from "drizzle-orm";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { db } from "../db";
import { lawUrlTable, lawDataTable, lawVectordbStatusTable } from "../db/schema";
import { chromaVectorStore } from "./chroma";
import { Document } from "langchain/document";
const pdfjsLib = require("pdfjs-dist");
import type { TextItem } from "pdfjs-dist/types/src/display/api";
//pdfjsLib.GlobalWorkerOptions.workerSrc = require('pdfjs-dist/build/pdf.worker.entry');

async function extractTextFromPDFUrl(url: string) {
    try {
        const response = await fetch(url);
        const buffer = await response.arrayBuffer()

        let text = '';

        // Loop through all pages
        const pdfDoc = await pdfjsLib.getDocument(buffer).promise;

        // Loop through all pages
        for (let i = 1; i <= pdfDoc.numPages; i++) {
            const page = await pdfDoc.getPage(i);
            const pageText = await page.getTextContent();

            // Extract text content from each item
            const pageTextString = pageText.items.map((item: TextItem) => {
                return (item).str
            }).join(' ');
            text += pageTextString + '\n'; // add a newline after each page's text
        }

        return text;
    } catch (error) {
        console.error(`Error extracting text from ${url}:`, error);
        return null;
    }
}

async function getLawPDFContentbyID(id: string) {
    try {

        const law = await db.select({ title: lawDataTable.title, url: lawUrlTable.downloadUrl }).from(lawDataTable).leftJoin(lawUrlTable, (eq(lawDataTable.id, lawUrlTable.lawId))).where(eq(lawDataTable.id as any, parseInt(id)))
        // Check if the law exists in the database. If not, return an error response.
        if (!law) {
            throw new Error(`Law with ID ${id} not found.`);
        }
        // Download the law file from the URL and send it as a response
        let lawContent = '';
        for (const law_file of law) {
            if (!law_file.url) continue;
            const content = await extractTextFromPDFUrl('https://peraturan.bpk.go.id' + law_file.url) || '';
            if (content) {
                lawContent += content;
            }
        }
        lawContent = lawContent.replace(RegExp(/\n+/g), ' ');
        lawContent = lawContent.replace(RegExp(/(?<=[a-z],)\n/g), " ");
        lawContent = lawContent.trim();
        return { lawTitle: law[0].title || "", lawContent };
    } catch (error) {
        console.error(`Error retrieving law with ID ${id}:`, error);
        throw (error);
        return {
            lawTitle: "",
            lawContent: ""
        };
    }
}

async function uploadLawtoVectorDB(lawTitle: string, lawContent: string, lawId: number) {
    try {
        // If already exist in lawVectorDBStatus, skip the upload process.
        const lawVectorDBStatus = await db.select().from(lawVectordbStatusTable).where(and(eq(lawVectordbStatusTable.lawId, lawId), eq(lawVectordbStatusTable.hasVectordbRecord, true)))
        if (lawVectorDBStatus && lawVectorDBStatus.length > 0) {
            await db.update(lawVectordbStatusTable).set({
                hasVectordbRecord: true,
                lastUpdated: new Date().toISOString(),
            }).where(eq(lawVectordbStatusTable.lawId, lawId));
            return [];
        }
        const textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 100
        });
        const chunks = await textSplitter.splitText(lawContent);
        const documents = chunks.map(chunk => {
            return new Document({
                metadata: {
                    title: lawTitle,
                    lawId: lawId,
                },
                pageContent: chunk,
            });
        })
        // add document to vector store
        const ids = await chromaVectorStore.addDocuments(documents);
        await db.insert(lawVectordbStatusTable).values({
            lawId: lawId,
            hasVectordbRecord: true,
            lastUpdated: new Date().toISOString(),
        }).onConflictDoUpdate({
            target: lawVectordbStatusTable.lawId,
            set: {
                hasVectordbRecord: true,
                lastUpdated: new Date().toISOString(),
            }
        })
        return ids;
    }
    catch (error) {
        console.error(`Error uploading law with ID ${lawId}:`, error);
        throw error;
    }
}

export async function uploadMultipleLaws(lawIds: number[]) {
    let ids: string[] = [];
    //Get list of existing laws in vector database status
    const existingLaws = await db.select().from(lawVectordbStatusTable).where(eq(lawVectordbStatusTable.hasVectordbRecord, true));
    const existingLawIds = new Set(existingLaws.map(law => law.lawId));
    try {
        for (const id of lawIds) {
            if (existingLawIds.has(id)) {
                console.log(`Skipping law with ID ${id}, already exists in vector database.`);
                continue;
            }
            const { lawTitle, lawContent } = await getLawPDFContentbyID(id.toString());
            ids.concat(await uploadLawtoVectorDB(lawTitle, lawContent, id))
        }
        return ids;
    } catch (error: any) {
        console.error(error);
        throw error;
    }
}