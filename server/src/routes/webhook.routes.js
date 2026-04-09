import { Router } from "express";
import { receiveTelegramWebhook, validateTelegramWebhookBody } from "../controllers/webhook.controller.js";

const router = Router();

router.post("/telegram", validateTelegramWebhookBody, receiveTelegramWebhook);

export default router;


