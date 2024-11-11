
import { Router } from "express";
import { getAllLaws, getLawByID, getFiltersInformation } from "../controllers/lawController";

const router = Router();

/**
 * @swagger
 * /laws:
 *   get:
 *     summary: Retrieve a list of laws with optional filtering, pagination, and sorting
 *     tags:
 *       - Laws
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 100
 *           maximum: 100
 *         description: Number of laws to retrieve per page
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filter laws by type
 *       - in: query
 *         name: region
 *         schema:
 *           type: string
 *         description: Filter laws by region
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Filter laws by year
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter laws by category
 *     responses:
 *       200:
 *         description: A list of laws
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   type:
 *                     type: string
 *                   region:
 *                     type: string
 *                   year:
 *                     type: integer
 *                   category:
 *                     type: string
 *       500:
 *         description: Internal server error
 */
router.get("/", getAllLaws);

/**
 * @swagger
 * /laws/info:
 *   get:
 *     summary: Retrieve distinct values for law filters
 *     tags:
 *       - Laws
 *     responses:
 *       200:
 *         description: Available filter values
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 types:
 *                   type: array
 *                   items:
 *                     type: string
 *                 regions:
 *                   type: array
 *                   items:
 *                     type: string
 *                 years:
 *                   type: array
 *                   items:
 *                     type: integer
 *                 categories:
 *                   type: array
 *                   items:
 *                     type: string
 *       500:
 *         description: Internal server error
 */
router.get("/info", getFiltersInformation);

/**
 * @swagger
 * /laws/{id}:
 *   get:
 *     summary: Retrieve a law by its ID
 *     tags:
 *       - Laws
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the law to retrieve
 *     responses:
 *       200:
 *         description: Law details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 type:
 *                   type: string
 *                 region:
 *                   type: string
 *                 year:
 *                   type: integer
 *                 category:
 *                   type: string
 *       404:
 *         description: Law not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", getLawByID);

export default router;