import { Router } from "express";

import { getSummary } from "../controllers/analytics.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { rbac } from "../middleware/rbac.middleware.js";
import { ROLES } from "shared/constants/roles.js";

const router = Router();

router.use(authenticate);
router.get(
  "/summary",
  rbac(ROLES.ADMIN, ROLES.DOCTOR, ROLES.RECEPTIONIST),
  getSummary,
);

export default router;