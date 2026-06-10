import { Router } from "express";
import { registerHandler, registerValidation } from "./register";
import { handleValidationErrors } from "../middlewares/handleValidationErrors";
import { loginHandler, loginValidation } from "./login";
import { googleLogin } from "./google-login";
import { logoutHandler } from "./logout";


const router = Router();


router.post('/register',registerValidation,handleValidationErrors,registerHandler)
router.post('/login',loginValidation,handleValidationErrors,loginHandler);
router.post("/google",googleLogin);
router.post("/logout",logoutHandler);

export default router;