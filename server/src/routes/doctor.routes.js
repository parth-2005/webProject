import { Router } from "express";
import { getDoctors, getDoctorSlots, updateDoctorSchedule } from "../controllers/doctor.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { validateBody } from "../middleware/validate.middleware.js";
import { rbac } from "../middleware/rbac.middleware.js";
import { doctorScheduleSchema } from "shared/schemas/doctorSchedule.schema.js";
import { ROLES } from "shared/constants/roles.js";

const router = Router();

router.use(authenticate);

router.get("/", getDoctors);
router.get("/:id/slots", getDoctorSlots);
router.put("/:id/schedule", rbac(ROLES.ADMIN, ROLES.DOCTOR), validateBody(doctorScheduleSchema), updateDoctorSchedule);

export default router;
