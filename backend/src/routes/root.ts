import { Router } from "express";

const router = Router();

/**
 * @swagger
 * /:
 *   get:
 *     summary: Returns a simple greeting
 *     responses:
 *       '200':
 *         description: A successful response
 */
router.get("/",(req,res)=>{
    res.send("Hello World!")
})

export default router;