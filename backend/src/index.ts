import express from "express"
import 'dotenv/config'
import chatRouter from "./routes/chat"
import lawRouter from './routes/law'
import authRouter from './routes/auth'
import rootRouter from './routes/root'

import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swaggerConfig';
import swaggerJSDoc from "swagger-jsdoc"
import { drizzle } from 'drizzle-orm/node-postgres';

const db = drizzle(process.env.DATABASE_URL!);
const app = express()
app.use(express.json())
const port = process.env.PORT || 3000

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerJSDoc(swaggerSpec)));
app.use("/", rootRouter)
app.use("/chat", chatRouter)
app.use("/laws", lawRouter)
app.use("/auth", authRouter)


app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})
