import { Router } from "express";
import { receiveWhatsappWebhook, validateWhatsappWebhookBody } from "../controllers/webhook.controller.js";

const router = Router();

router.post("/whatsapp", validateWhatsappWebhookBody, receiveWhatsappWebhook);

export default router;


