import type { Request, Response } from 'express';
import { db } from '../db.ts';
import { lawData, lawStatus, lawUrl, users } from '../db/schema.ts';
import {eq, sql,and} from 'drizzle-orm';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
import 'dotenv/config';

export async function registerUser(req:Request,res:Response) {
    const {username,password}=req.body;
    const hashedPassword = await bcrypt.hash(password, 10); // Assuming you have bcrypt installed and set up
    
    if(!username || !password){
        res.status(400).json({message:"Username and password are required"});
    }
    
    try {
        const userExists = await db.select().from(users).where(eq(users.username, username)).execute();
        
        if(userExists.length > 0) {
            res.status(409).json({ message: "User already exists" });
        }

        const newUser = await db.insert(users).values({
            username,
            password: hashedPassword
        }).returning()

        res.status(201).json(newUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function loginUser(req:Request,res:Response){
    const {username,password}=req.body;
    
    if(!username || !password){
        res.status(400).json({message:"Username and password are required"});
    }

    try {
        const user_results = await db.select().from(users).where(eq(users.username, username));
        
        if(user_results.length === 0) {
            res.status(401).json({ message: "Invalid username" });
        }
        const user = user_results[0];
        
        const isPasswordValid = await bcrypt.compare(password, user_results[0].password);
        
        if(!isPasswordValid){
            res.status(401).json({ message: "Invalid password" });
        }

        // Assuming you have a way to generate tokens
        const token = jwt.sign({id:user.id}, process.env.JWT_SECRET || 'secretToken',{
            expiresIn:"12h" // Token expires in 1 hour
        })

        res.status(200).json({ token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}
