
import { Router } from "express";
import { getAllLaws, getLawByID, getFiltersInformation } from "../controllers/lawController";

const router = Router();


/**
 * @swagger
 * components:
 *   schemas:
 *     Law:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique identifier for the law
 *         title:
 *           type: string
 *           description: Title of the law
 *         description:
 *           type: string
 *           description: Description of the law
 *         type:
 *           type: string
 *           description: Type of the law (e.g., civil, criminal)
 *         region:
 *           type: string
 *           description: Region where the law applies
 *         year:
 *           type: integer
 *           description: Year the law was enacted
 *         category:
 *           type: string
 *           description: Category of the law (e.g., family, labor)
 */
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
 *         description: An object containing total pages, current pages, and list of laws in this page
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total_pages:
 *                   type: integer
 *                   description: Total number of pages
 *                 current_page:
 *                   type: integer
 *                   description: Current page number
 *                 laws:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Law'
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