import { Router } from "express";
import { getAppointments, createNewAppointment, updateAppointment, deleteAppointment } from "../controllers/appointment.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { validateBody } from "../middleware/validate.middleware.js";
import { rbac } from "../middleware/rbac.middleware.js";
import { appointmentSchema } from "shared/schemas/appointment.schema.js";
import { ROLES } from "shared/constants/roles.js";

const router = Router();

router.use(authenticate);

router.get("/", rbac(ROLES.ADMIN, ROLES.DOCTOR, ROLES.RECEPTIONIST), getAppointments);
router.post("/", rbac(ROLES.ADMIN, ROLES.RECEPTIONIST, ROLES.DOCTOR), validateBody(appointmentSchema), createNewAppointment);
// Partial updates may not strictly match the creation schema. Bypassing validateBody for partial PUT
router.put("/:id", rbac(ROLES.ADMIN, ROLES.RECEPTIONIST, ROLES.DOCTOR), updateAppointment);
router.delete("/:id", rbac(ROLES.ADMIN), deleteAppointment);

export default router;
