/**
 * Saved items (bookmarks) — POST/DELETE/GET /saved-items.
 * Only posts are used by the feed; the API also supports services and events.
 */
import api, { GET, POST } from "@/services/api";

export type SavedItemType = "post" | "service" | "event";

interface SavedItemRow {
  id: string;
  item_type: SavedItemType;
  item_id: string;
  created_at: string;
}

interface Envelope<T> {
  data?: T;
}

class SavedItemsService {
  /** Ids of the user's saved items of one type (up to 100, newest first). */
  async getSavedIds(itemType: SavedItemType): Promise<string[]> {
    // The shared client's interceptor returns the response body.
    const body = (await GET<Envelope<{ items: SavedItemRow[] }>>(
      "/saved-items",
      { item_type: itemType, limit: 100, page: 1 },
    )) as unknown as Envelope<{ items: SavedItemRow[] }>;
    return (body?.data?.items ?? []).map((row) => row.item_id);
  }

  async save(itemType: SavedItemType, itemId: string): Promise<void> {
    await POST("/saved-items", { item_type: itemType, item_id: itemId });
  }

  /** The API reads the item from the request body, so this sends `data`. */
  async unsave(itemType: SavedItemType, itemId: string): Promise<void> {
    await api.delete("/saved-items", {
      data: { item_type: itemType, item_id: itemId },
    });
  }
}

export const savedItemsService = new SavedItemsService();
