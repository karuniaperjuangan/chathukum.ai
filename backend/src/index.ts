import express from "express"
import 'dotenv/config'
import chatRouter from "./routes/chat.js"
import lawRouter from './routes/law.js'
import authRouter from './routes/auth.js'
import rootRouter from './routes/root.js'

import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swaggerConfig.js';
import swaggerJSDoc from "swagger-jsdoc"
import { drizzle } from 'drizzle-orm/node-postgres';
import cors from 'cors'

const db = drizzle(process.env.DATABASE_URL!);
const app = express()
app.use(express.json())
app.use(cors())
const port = process.env.PORT || 3000

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerJSDoc(swaggerSpec)));
app.use("/", rootRouter)
app.use("/chat", chatRouter)
app.use("/laws", lawRouter)
app.use("/auth", authRouter)


app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})
