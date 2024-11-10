import express from "express"
import 'dotenv/config'
import chatRouter from "./routes/chat"
import lawRouter from './routes/law'
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json';
import { drizzle } from 'drizzle-orm/node-postgres';

const db = drizzle(process.env.DATABASE_URL!);
const app = express()
app.use(express.json())
const port = process.env.PORT || 3000

app.get("/",(req,res)=>{
    res.send("Hello World!")
})
app.use("/chat", chatRouter)
app.use("/laws", lawRouter)
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.listen(port,()=>{
    console.log(`Listening on port ${port}`)
})
