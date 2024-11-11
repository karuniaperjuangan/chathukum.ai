import { Router } from "express";
import { registerUser, loginUser,refreshToken} from "../controllers/authController";
import { authenticateToken } from "../../middleware/auth";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/check",authenticateToken, (req,res)=>{
    res.json({ message: "Authenticated successfully" });
    return;
}); // Protected route to test authentication middleware
router.get("/refresh",authenticateToken, refreshToken);

export default router;