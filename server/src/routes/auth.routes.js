import { Router } from "express";

import { login, logout, refresh, validateLoginBody } from "../controllers/auth.controller.js";

const router = Router();

router.post("/login", validateLoginBody, login);
router.post("/refresh", refresh);
router.post("/logout", logout);

export default router;

