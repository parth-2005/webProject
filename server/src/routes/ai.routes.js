import { Router } from "express";
import { formatNotes, processMessage, validateFormatNotesBody, validateProcessMessageBody } from "../controllers/ai.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { rbac } from "../middleware/rbac.middleware.js";
import { ROLES } from "shared/constants/roles.js";

const router = Router();

router.post("/process-message", validateProcessMessageBody, processMessage);
router.post(
  "/format-notes",
  authenticate,
  rbac(ROLES.DOCTOR, ROLES.ADMIN),
  validateFormatNotesBody,
  formatNotes,
);

export default router;

