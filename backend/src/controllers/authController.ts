import type { Request, Response } from 'express';
import { db } from '../db.ts';
import { usersTable } from '../db/schema.ts';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { z } from 'zod';

process.env.SALT = process.env.SALT || process.env.JWT_SECRET || "this_is_a_secret_salt"

const registrationSchema = z.object({
    username: z.string().min(8, { message: 'Username must be at least 8 characters long.' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters long.' }),
    email: z.string().email({ message: 'Invalid email address.' }),
  });
  
export async function registerUser(req: Request, res: Response) {
    try{
        const {username, password, email} = registrationSchema.parse(req.body)
    } catch (error) {
        if(error instanceof z.ZodError){
            res.status(400).json({message: error.issues})
            return;
        }
    }
    const { username, password, email } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10); // Assuming you have bcrypt installed and set up

    if (!username || !password) {
        res.status(400).json({ message: "Username and password are required" });
        return;
    }

    try {
        const userExists = await db.select().from(usersTable).where(eq(usersTable.username, username));

        if (userExists.length > 0) {
            res.status(409).json({ message: "User already exists" });
            return;
        }

        const newUser = await db.insert(usersTable).values({
            username,
            email,
            password: hashedPassword
        }).returning()

        res.status(201).json(newUser);
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
        return;
    }
}

export async function loginUser(req: Request, res: Response) {
    const { username, password } = req.body;

    if (!username || !password) {
        res.status(400).json({ message: "Username and password are required" });
    }

    try {
        const user_results = await db.select().from(usersTable).where(eq(usersTable.username, username));

        if (user_results.length === 0 || !user_results[0]) {
            res.status(401).json({ message: "Invalid username" });
            return;
        }
        const user = user_results[0];
        const isPasswordValid = bcrypt.compareSync(password, user_results[0].password);

        if (!isPasswordValid) {
            res.status(401).json({ message: "Invalid password" });
            return;
        }

        // Assuming you have a way to generate tokens
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'secretToken', {
            expiresIn: "12h" // Token expires in 12 hour
        })

        res.status(200).json({ token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function getUser(req: Request, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
        res.status(400).json({ message: "User ID is required" });
    }

    try {
        const user_results = await db.select().from(usersTable).where(eq(usersTable.id, parseInt(userId)));

        if (user_results.length === 0 || !user_results[0]) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const user = user_results[0];
        res.status(200).json(user);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function refreshToken(req: Request, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
        res.status(400).json({ message: "User ID is required" });
        return;
    }

    try {
        // Assuming you have a way to generate tokens
        const token = jwt.sign({ id: userId }, process.env.JWT_SECRET || 'secretToken', {
            expiresIn: "12h" // Token expires in 12 hour
        })

        res.status(200).json({ token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function deleteUser(req: Request, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
        res.status(400).json({ message: "User ID is required" });
        return;
    }

    try {
        const user_results = await db.select().from(usersTable).where(eq(usersTable.id, parseInt(userId)));

        if (user_results.length === 0 || !user_results[0]) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const user = user_results[0];
        await db.delete(usersTable).where(eq(usersTable.id, parseInt(userId)));
        res.status(200).json({ message: `User ${user.username} deleted successfully` });
        return;

    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: `Internal server error: ${error.message}` });
    }
}

export async function changePassword(req: Request, res: Response){
    const userId = req.user?.id;
    if (!userId) {
        res.status(400).json({ message: "User ID is required" });
        return;
    }

    const { old_password, new_password } = req.body;

    try {
        const user_results = await db.select().from(usersTable).where(eq(usersTable.id, parseInt(userId)));

        if (user_results.length === 0 || !user_results[0]) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        const user = user_results[0];

        // Verify old password
        if (!bcrypt.compareSync(old_password, user.password)) {
            res.status(401).json({ message: "Invalid old password" });
            return;
        }

        // Hash new password
        const hashedNewPassword = bcrypt.hashSync(new_password, 10);

        // Update the user's password in the database
        await db.update(usersTable)
            .set({ password: hashedNewPassword })
            .where(eq(usersTable.id, parseInt(userId)));

        res.status(200).json({ message: "Password changed successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}