
import { Router } from "express";
import { getAllLaws, getLawByID, getFiltersInformation } from "../controllers/lawController";

const router = Router();

router.get("/", getAllLaws);
router.get("/info", getFiltersInformation);
router.get("/:id", getLawByID);

export default router;