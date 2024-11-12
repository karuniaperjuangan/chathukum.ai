import { type Request, type Response } from 'express';
import { chromaVectorStore } from '../vectorDB/chroma.ts';
import { uploadMultipleLaws } from '../vectorDB/uploadLaws.ts';
import { getAnswerFromRAG } from '../ai/rag.ts';

export async function processLawPDF(req: Request, res: Response) {
    const lawIds: string[] = req.body.law_ids;
    try {
        const ids = await uploadMultipleLaws(lawIds.map(id => parseInt(id)));
        res.status(200).json({ ids: ids });
        return;
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: error.message });
        return;
    }
};

export async function retrieveLawContent(req: Request, res: Response) {
    const lawIds: number[] = req.body.law_ids.map((id: string) => parseInt(id));
    const query: string = req.body.query;
    try {
        if (!query) {
            throw new Error("Query is required");
        }
        if (!lawIds || lawIds.length === 0) {
            throw new Error("Law IDs are required");
        }
        const ids = await uploadMultipleLaws(lawIds);
        const result = (await chromaVectorStore.similaritySearchWithScore(query, 10, {
            "$or": (lawIds.map(id => ({ lawId: id }))
                .concat([{ lawId: lawIds[0] }])) // to make sure that at least two laws are returned
        })).filter(item => item[1] < 0.45) // filter out results with cosine distance greater than 0.45
        res.status(200).json(result);
        return;
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: error.message });
        return;
    }
}

export async function chatWithLawAssistant(req: Request, res: Response) {
    try {
        const { question, chat_history, law_ids } = req.body;
        if (!question) {
            throw new Error("Question is required");
        }
        if (!chat_history || chat_history.length === 0) {
            throw new Error("Chat history is required");
        }
        if (!law_ids || law_ids.length === 0) {
            throw new Error("Law IDs are required");
        }
        await uploadMultipleLaws(law_ids);

        const answer = await getAnswerFromRAG({
            question: question,
            chatHistory: chat_history,
            lawIds: law_ids
        })
        res.status(200).json(answer);
        return;
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: error.message });
        return;
    }
}