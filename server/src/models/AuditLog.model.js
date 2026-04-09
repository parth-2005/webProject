import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
	{
		actorUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
		action: { type: String, required: true },
		entityType: { type: String, required: true },
		entityId: { type: mongoose.Schema.Types.ObjectId, required: true },
		metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
	},
	{ timestamps: true },
);

auditLogSchema.index({ createdAt: -1 });

export const AuditLog = mongoose.model("AuditLog", auditLogSchema);

