import express from "express"
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
const router = express.Router()

router.get("/",(req,res)=>{
    res.send({
        "status":"success!!",
       "message":"Hello world"
    })
});

router.post("/chat",async (req,res)=>{
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
export default router