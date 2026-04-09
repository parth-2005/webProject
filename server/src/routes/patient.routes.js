import { Router } from "express";
import { getPatients, createPatient, getPatientById, updatePatient } from "../controllers/patient.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { validateBody } from "../middleware/validate.middleware.js";
import { rbac } from "../middleware/rbac.middleware.js";
import { patientSchema } from "shared/schemas/patient.schema.js";
import { ROLES } from "shared/constants/roles.js";

const router = Router();

router.use(authenticate); // Require authentication for all patient routes

router.get("/", rbac(ROLES.ADMIN, ROLES.DOCTOR, ROLES.RECEPTIONIST), getPatients);
router.post("/", rbac(ROLES.ADMIN, ROLES.RECEPTIONIST), validateBody(patientSchema), createPatient);
router.get("/:id", rbac(ROLES.ADMIN, ROLES.DOCTOR, ROLES.RECEPTIONIST), getPatientById);
router.put("/:id", rbac(ROLES.ADMIN, ROLES.RECEPTIONIST), validateBody(patientSchema), updatePatient);

export default router;
