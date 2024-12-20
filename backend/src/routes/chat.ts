import express from "express"
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { processLawPDF, retrieveLawContent, chatWithLawAssistant, newChatHistory, appendChatHistory, deleteChatHistory, getChatHistory, listUserChatHistories } from '../controllers/chatController.js'
import { authenticateToken } from "../middleware/auth.js";
const router = express.Router()

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     ChatHistory:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         title:
 *           type: string
 *         userId:
 *           type: integer
 *         lawIds:
 *           type: array
 *           items:
 *             type: integer
 *         messages:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               chatHistoryId:
 *                 type: integer
 *               content:
 *                 type: string
 *               message_role:
 *                 type: string
 *     Message:
 *       type: object
 *       properties:
 *         chatHistoryId:
 *           type: integer
 *         content:
 *           type: string
 *         message_role:
 *           type: string
 */


/**
 * @swagger
 * /chat/ask-chatbot:
 *   post:
 *     summary: Get an answer from the legal assistant chatbot based on the user's question and context.
 *     tags:
 *       - Chat
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question:
 *                 type: string
 *                 description: The question asked by the user.
 *                 example: "Apa isi pasal 1 ayat 1 UUD 1945?"
 *               chat_history:
 *                 type: array
 *                 description: List of previous messages exchanged in the chat session.
 *                 items:
 *                   type: object
 *                   properties:
 *                     role:
 *                       type: string
 *                       description: The role of the message sender (e.g., 'ai', 'human', 'system').
 *                       example: "human"
 *                     content:
 *                       type: string
 *                       description: The content of the message.
 *                       example: "Can you tell me about data privacy laws?"
 *                 example: [
 *                   { "role": "human", "content": "Apa bentuk negara Indonesia" },
 *                   { "role": "ai", "content": "Bentuk negara indonesia adalah republik" }
 *                 ]
 *               law_ids:
 *                 type: array
 *                 description: List of law IDs relevant to the user's question.
 *                 items:
 *                   type: integer
 *                 example: [101646]
 *     responses:
 *       200:
 *         description: Successfully retrieved answer from chatbot.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 answer:
 *                   type: string
 *                   description: The answer generated by the chatbot.
 *                   example: "Bunyi pasal 1 ayat 1 UUD 1945 adalah 'egara Indonesia ialah Negara Kesatuan, yang berbentuk Republik.'."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message describing the issue.
 *                   example: "Question is required."
 */

router.post("/ask-chatbot", chatWithLawAssistant)

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
router.post("/process-pdf", processLawPDF)


/**
 * @swagger
 * /chat/chat-history/new:
 *   post:
 *     summary: Create a new chat history
 *     tags:
 *       - Chat
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               messages:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     role:
 *                       type: string
 *                       enum: ["human", "ai"]
 *                     content:
 *                       type: string
 *                 example: [{role: "human", content: "Hello!"}, {role: "ai", content: "Hi there!"}]
 *               law_ids:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: [101646]
 *     responses:
 *       '201':
 *         description: Chat history created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChatHistory'
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.post("/chat-history/new", authenticateToken, newChatHistory)
/**
 * @swagger
 * /chat/chat-history/update:
 *   post:
 *     summary: Append messages to an existing chat history
 *     tags:
 *       - Chat
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               messages:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     role:
 *                       type: string
 *                       enum: ["human", "ai"]
 *                     content:
 *                       type: string
 *                 example: [{role: "human", content: "Hello!"}, {role: "ai", content: "Hi there!"}]
 *               chat_history_id:
 *                 type: integer
 *               law_ids:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: [101646]
 *     responses:
 *       '201':
 *         description: Messages appended successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 chat_history_id:
 *                   type: integer
 *                 messages:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Message'
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.post("/chat-history/update",authenticateToken, appendChatHistory)
/**
 * @swagger
 * /chat/chat-history/get:
 *   post:
 *     summary: Get a specific chat history
 *     tags:
 *       - Chat
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               chat_history_id:
 *                 type: integer
 *     responses:
 *       '200':
 *         description: Chat history retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChatHistory'
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.post("/chat-history/get", authenticateToken, getChatHistory)
/**
 * @swagger
 * /chat/chat-history/delete:
 *   delete:
 *     summary: Delete a specific chat history
 *     tags:
 *       - Chat
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               chat_history_id:
 *                 type: integer
 *     responses:
 *       '200':
 *         description: Chat history and messages deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.delete("/chat-history/delete", authenticateToken, deleteChatHistory)
/**
 * @swagger
 * /chat/chat-history/list:
 *   get:
 *     summary: List all chat histories for the user
 *     tags:
 *       - Chat
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: List of chat histories retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ChatHistory'
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.get("/chat-history/list", authenticateToken, listUserChatHistories)

export default router