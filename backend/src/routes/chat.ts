import express from "express"
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import {processLawPDF, retrieveLawContent} from '../controllers/chatController'
const router = express.Router()

router.post("/",async (req,res)=>{
    const input = req.body.message || "Halo"
    const messages = [
        new SystemMessage("You are AI assistant that resemble AI Waifu. You must answer with cute language and full of kaomoji"),
        new HumanMessage(input),
      ];

    const model = new ChatOpenAI({
        model:"gpt-4o-mini"
    })
    const result = (await model.invoke(messages)).content.toString()
    res.json({
        "message":result
    })
})

/**
 * Retrieves law content based on a query.
 * @swagger
 * /chat/retrieve-content:
 *   post:
 *     tags:
 *       - Chat
 *     summary: Retrieves law content based on a query and uploads new laws to the vector database if necessary.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               law_ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *               query:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Successful response with similarity search results.
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.post("/retrieve-content", retrieveLawContent)

/**
 * Uploads multiple laws to the vector database.
 * @swagger
 * /chat/process-pdf:
 *   post:
 *     summary: Processes multiple laws by uploading their content to the vector database.
 *     tags:
 *       - Chat
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               law_ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       '200':
 *         description: Successful response with a list of uploaded IDs.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ids:
 *                   type: array
 *                   items:
 *                     type: string
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.post("/process-pdf",processLawPDF)

export default router