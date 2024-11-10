import express from "express"
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import {processLawPDF} from '../controllers/chatController'
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

router.get("/process-pdf/:id",processLawPDF)

export default router