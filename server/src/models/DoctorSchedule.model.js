import mongoose from "mongoose";

const slotSchema = new mongoose.Schema(
  {
    start: { type: String, required: true },
    end: { type: String, required: true },
  },
  { _id: false }
);

const doctorScheduleSchema = new mongoose.Schema(
  {
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    weeklySlots: {
      monday: { type: [slotSchema], default: [] },
      tuesday: { type: [slotSchema], default: [] },
      wednesday: { type: [slotSchema], default: [] },
      thursday: { type: [slotSchema], default: [] },
      friday: { type: [slotSchema], default: [] },
      saturday: { type: [slotSchema], default: [] },
      sunday: { type: [slotSchema], default: [] },
    },
    blockedDates: { type: [Date], default: [] },
  },
  { timestamps: true }
);

export const DoctorSchedule = mongoose.model("DoctorSchedule", doctorScheduleSchema);
