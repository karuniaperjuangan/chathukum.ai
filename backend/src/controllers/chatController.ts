import type { Request, Response } from 'express';
import { db } from '../db.ts';
import { lawData, lawStatus, lawUrl } from '../db/schema.ts';

import pdfParse from 'pdf-parse';
import {eq} from 'drizzle-orm'

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

export async function processLawPDF(req:Request,res:Response) {
    const {id} = req.params;
    try{
        const law = await db.select({url:lawUrl.downloadUrl}).from(lawData).leftJoin(lawUrl,(eq(lawData.id,lawUrl.lawId))).where(eq(lawData.id as any,parseInt(id)))
        // Check if the law exists in the database. If not, return an error response.
        if(!law){
            res.status(404).json({error:'Law not found'});
        }
        // Download the law file from the URL and send it as a response
        let law_content = '';
        for(const law_file of law){
            if(!law_file.url) continue;
            const content = await extractTextFromPDFUrl('https://peraturan.bpk.go.id/'+law_file.url) || '';
            if(content) {
                law_content += content;
            }
        }
        law_content = law_content.replace(RegExp(/\n+/g),'\n');
        law_content = law_content.replace(RegExp(/(?<=[a-z],)\n/g)," ");
        law_content = law_content.trim();
        res.send(law_content);
    } catch(error:any){
        console.error(error);
        res.status(500).json({error:error.message});
    }
};