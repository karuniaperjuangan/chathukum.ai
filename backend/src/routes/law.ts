
import { Router } from "express";
import { getAllLaws, getLawByID } from "../controllers/lawController";

const router = Router();

router.get("/", getAllLaws);
router.get("/:id", getLawByID);

export default router;