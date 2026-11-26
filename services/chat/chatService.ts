import { POST } from "../api";
import { CHAT_ENDPOINTS } from "./apiEndPoints";
import type { Conversation } from "./chatInterface";

/**
 * Opens (or reuses) the conversation between the signed-in user and `participantId`, and returns
 * its id. Goes through the shared API client, so the token is attached and refreshed there.
 */
export async function startConversation(participantId: string): Promise<string> {
  const response = await POST<Conversation>(CHAT_ENDPOINTS.CONVERSATIONS, {
    participant2_id: participantId,
  });
  if (response.status !== "success" || !response.data?.id) {
    throw new Error("Could not start chat");
  }
  return response.data.id;
}
