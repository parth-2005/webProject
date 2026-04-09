import { Conversation } from "../../models/Conversation.model.js";
import { formatDoctorNotes } from "./notesFormatter.js";
import { orchestrateMessage } from "./orchestrator.js";

/**
 * Process one inbound message and persist conversation state/history.
 * @param {{ phone: string, message: string }} params
 * @returns {Promise<{ responseText: string, state: string, context: Record<string, any> }>} 
 */
export async function processIncomingMessage({ phone, message }) {
  let conversation = await Conversation.findOne({ phone });
  if (!conversation) {
    conversation = await Conversation.create({
      phone,
      state: "idle",
      context: {},
      history: [],
    });
  }

  const result = await orchestrateMessage({
    message,
    conversation: {
      state: conversation.state,
      context: conversation.context,
      history: conversation.history,
    },
  });

  const nextHistory = [
    ...(conversation.history || []),
    { role: "user", content: message, timestamp: new Date() },
    { role: "model", content: result.responseText, timestamp: new Date() },
  ].slice(-10);

  conversation.state = result.newState;
  conversation.context = result.contextUpdate || {};
  conversation.history = nextHistory;
  await conversation.save();

  return {
    responseText: result.responseText,
    state: conversation.state,
    context: conversation.context,
  };
}

/**
 * Format raw clinical notes into structured JSON.
 * @param {{ rawNotes: string }} params
 * @returns {Promise<any>}
 */
export async function processNotesFormatting({ rawNotes }) {
  return formatDoctorNotes(rawNotes);
}