import { type Request, type Response } from 'express';
import { postgresVectorStore } from '../vectorDB/vectorStore.ts';
import { uploadMultipleLaws } from '../vectorDB/uploadLaws.ts';
import { getAnswerFromRAG } from '../ai/rag.ts';
import { generateChatHistoryTitle } from '../ai/generateChatHistoryTitle.ts';
import { db } from '../db.ts';
import { chatHistoryTable, messagesTable } from '../db/schema.ts';
import { eq } from 'drizzle-orm';
import type { Message } from '../model/message.tsx';

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
        const result = (await postgresVectorStore.similaritySearchWithScore(query, 10, {
            "$or": (lawIds.map(id => ({ lawId: id }))
                .concat([{ lawId: lawIds[0] }
                ]
                )
            ) // to make sure that at least two laws are returned
        }
        )
        ).filter(item => item[1] < 0.5) // filter out results with cosine distance greater than 0.45
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
        if (!chat_history) {
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


//route : /chat/chat-history/new (POST)
export async function newChatHistory(req: Request, res: Response) {
    const {messages, law_ids} : {messages: any, law_ids:string[]} = req.body;
    const lawIds = law_ids.map(id => parseInt(id));
    const title = await generateChatHistoryTitle(messages);
    const userId = parseInt(req.user?.id);
    if (!userId) {
        throw new Error("User ID is required");
    }

    try {
        const insertedChatHistory = await db.insert(chatHistoryTable).values({
            title,
            userId,
            lawIds
        }).returning();
        const insertedMessages = await db.insert(messagesTable).values([{
            chatHistoryId: insertedChatHistory[0].id,
            content: messages[0].content, // The question by human
            message_role: "human",
        },
    {
        chatHistoryId: insertedChatHistory[0].id,
        content: messages[1].content, // The answer by AI
        message_role: "ai",
    }]).returning();
        res.status(201).json({
            ...insertedChatHistory[0],
            messages: insertedMessages,
        });
        return;
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: error.message });
        return;
    }
}

//route : /chat/chat-history/update (POST)
export async function appendChatHistory(req: Request, res: Response) {
    try{
    const {messages, chat_history_id, law_ids} : {messages: Message[], chat_history_id:string, law_ids:string[]|undefined} = req.body;
    if (law_ids){
        const lawIds = law_ids.map(id => parseInt(id));   
        await db.update(chatHistoryTable).set({lawIds: lawIds}).where(eq(chatHistoryTable.id, parseInt(chat_history_id))) 
    }
    const chatHistoryId = parseInt(chat_history_id);
    const results = await db.insert(messagesTable).values([
        {
            chatHistoryId,
            content: messages[messages.length-2].content, // The second last element is the question by human
            message_role: "human",
        },
        {
            chatHistoryId,
            content: messages[messages.length-1].content, // The last element is the answer by AI
            message_role: "ai",
        }
    ])
    const newMessages = await db.select().from(messagesTable).where(eq(messagesTable.chatHistoryId, chatHistoryId)).orderBy(messagesTable.id);
    res.status(201).json({
        "chat_history_id":chat_history_id,
        "messages":newMessages
    })
    }catch (error: any) {
        console.error(error);
        res.status(500).json({ error: error.message });
        return;
    }
}

//route : /chat/chat-history/get (POST)
export async function getChatHistory(req: Request, res: Response) {
    try{
    const userId = parseInt(req.user?.id);

    if (!userId) {
        throw new Error("User ID is required");
    }

    const {chat_history_id} : {chat_history_id:string} = req.body;

    const chatHistoryId = parseInt(chat_history_id);
    const chatHistory = await db.select().from(chatHistoryTable).where(eq(chatHistoryTable.id, chatHistoryId));
    if (!chatHistory.length) {
        throw new Error("Chat history not found");
    }
    if (chatHistory[0].userId !== userId) {
        throw new Error("Unauthorized access");
    }
    const messages = await db.select().from(messagesTable).where(eq(messagesTable.chatHistoryId, chatHistoryId)).orderBy(messagesTable.id);
    res.status(200).json({
        ...chatHistory[0],
        messages: messages,
    });
    return;}
    catch(error:any) {
        res.status(500).json({ error: error.message });
        return;
    }
}

//route : /chat/chat-history/delete (DELETE)
export async function deleteChatHistory(req: Request, res: Response) {
   try{
    const userId = parseInt(req.user?.id);

    if (!userId) {
        throw new Error("User ID is required");
    }

    const {chat_history_id} : {chat_history_id:string} = req.body;

    const chatHistoryId = parseInt(chat_history_id);
    const chatHistory = await db.select().from(chatHistoryTable).where(eq(chatHistoryTable.id, chatHistoryId));
    if (!chatHistory.length) {
        throw new Error("Chat history not found");
    }
    if (chatHistory[0].userId !== userId) {
        throw new Error("Unauthorized access");
    }

    const deleted = await db.delete(messagesTable).where(eq(messagesTable.chatHistoryId, chatHistoryId));
    const deleted2 = await db.delete(chatHistoryTable).where(eq(chatHistoryTable.id, chatHistoryId));

    res.status(200).json({
        message: "Chat history and messages deleted successfully",
    });
    return;}
    catch(error:any) {
        res.status(500).json({ error: error.message });
        return;
    }
}

//route : /chat/chat-history/list (GET)
export async function listUserChatHistories(req: Request, res: Response) {
    try{
    const userId = parseInt(req.user?.id);

    if (!userId) {
        throw new Error("User ID is required");
    }

    const chatHistory = await db.select().from(chatHistoryTable).where(eq(chatHistoryTable.userId, userId));
    res.status(200).json(chatHistory);
    return;}
    catch(error:any) {
        res.status(500).json({ error: error.message });
        return;
    }
}