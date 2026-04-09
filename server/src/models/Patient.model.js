import mongoose from "mongoose";

const visitHistorySchema = new mongoose.Schema(
  {
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment", required: true },
    date: { type: Date, required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    notes: { type: String, required: true },
  },
  { _id: false },
);

const patientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true, index: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: ["male", "female", "other"], required: true },
    bloodGroup: { type: String, required: true },
    address: { type: String, required: true },
    visitHistory: { type: [visitHistorySchema], default: [] },
    whatsappOptIn: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const Patient = mongoose.model("Patient", patientSchema);
