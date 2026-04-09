import mongoose from "mongoose";

const historyItemSchema = new mongoose.Schema(
	{
		role: { type: String, enum: ["user", "model"], required: true },
		content: { type: String, required: true },
		timestamp: { type: Date, default: Date.now },
	},
	{ _id: false },
);

const conversationSchema = new mongoose.Schema(
	{
		phone: { type: String, required: true, unique: true, index: true },
		patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", default: null },
		state: {
			type: String,
			enum: ["idle", "triage", "booking", "awaiting_confirm"],
			default: "idle",
		},
		context: { type: mongoose.Schema.Types.Mixed, default: {} },
		history: { type: [historyItemSchema], default: [] },
	},
	{ timestamps: true },
);

conversationSchema.index({ updatedAt: -1 });

export const Conversation = mongoose.model("Conversation", conversationSchema);

