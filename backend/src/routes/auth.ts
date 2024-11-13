import { Router } from "express";
import { registerUser, loginUser, refreshToken } from "../controllers/authController";
import { authenticateToken } from "../../middleware/auth";

const router = Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - username
 *               - password
 *     responses:
 *       201:
 *         description: User successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 username:
 *                   type: string
 *       400:
 *         description: Username and password are required
 *       409:
 *         description: User already exists
 *       500:
 *         description: Internal server error
 */
router.post("/register", registerUser);
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Authenticate a user and return a token
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - username
 *               - password
 *     responses:
 *       200:
 *         description: User successfully authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       400:
 *         description: Username and password are required
 *       401:
 *         description: Invalid username or password
 *       500:
 *         description: Internal server error
 */
router.post("/login", loginUser);
/**
 * @swagger
 * /auth/check:
 *   post:
 *     summary: Refresh the authentication token
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: A successful response
 *       403:
 *         description: Unauthorized
 */
router.get("/check", authenticateToken, (req, res) => {
    res.json({ message: "Authenticated successfully" });
    return;
}); // Protected route to test authentication middleware

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Refresh the authentication token
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token successfully refreshed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       400:
 *         description: User ID is required
 *       500:
 *         description: Internal server error
 */
router.get("/refresh", authenticateToken, refreshToken);

export default router;