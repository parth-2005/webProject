import { Router } from "express";
import { receiveTelegramWebhook, validateTelegramWebhookSecret } from "../controllers/webhook.controller.js";

const router = Router();

router.post("/telegram", validateTelegramWebhookSecret, receiveTelegramWebhook);

export default router;


