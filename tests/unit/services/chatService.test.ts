import { POST } from "@/services/api";
import { startConversation } from "@/services/chat/chatService";

jest.mock("@/services/api", () => ({ POST: jest.fn() }));
const post = POST as jest.Mock;

describe("startConversation", () => {
  beforeEach(() => post.mockReset());

  it("opens a conversation with the other user through the shared client, and returns its id", async () => {
    post.mockResolvedValue({ status: "success", data: { id: "conv-1" } });
    await expect(startConversation("user-9")).resolves.toBe("conv-1");
    expect(post).toHaveBeenCalledWith("/chat/conversations", { participant2_id: "user-9" });
  });

  it("fails when the backend does not report success", async () => {
    post.mockResolvedValue({ status: "failed", data: null });
    await expect(startConversation("user-9")).rejects.toThrow("Could not start chat");
  });

  it("fails when no conversation id comes back", async () => {
    post.mockResolvedValue({ status: "success", data: {} });
    await expect(startConversation("user-9")).rejects.toThrow("Could not start chat");
  });

  it("passes a network error through to the caller (which shows a toast)", async () => {
    post.mockRejectedValue(new Error("Network Error"));
    await expect(startConversation("user-9")).rejects.toThrow("Network Error");
  });
});
