import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';
import 'dotenv/config';

const jwtSecretKey = process.env.JWT_SECRET || 'default-secret-key'; // Ensure this is set in your environment variables

declare global {
    namespace Express {
        interface Request {
            user: any; // replace `any` with the actual type of `user`
        }
    }
}

export const authenticateToken = (req:Request,res:Response,next:NextFunction)=>{
    try{
    const authHeader = req.headers.authorization;
    console.log(authHeader);
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null){
        res.sendStatus(401);
        return;
    }
    
    jwt.verify(token, jwtSecretKey, (err,user)=>{
        if(err) return res.sendStatus(403);
        req.user = user;
        next();
    });
    } catch(error){
        res.status(401).json({ message: 'Authentication failed' });
    }
}