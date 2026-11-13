/**
 * @jest-environment jsdom
 *
 * Integration test pattern for a flow: a real hook + a real QueryClient, with only the service
 * mocked. Proves the pieces work together: service → cache → `select` filter → component state.
 */
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useCategories } from "@/hooks/useCategories";
import { serviceListService } from "@/services/serviceList/serviceListService";

jest.mock("@/services/serviceList/serviceListService", () => ({
  serviceListService: { getCategories: jest.fn() },
}));

const getCategories = serviceListService.getCategories as jest.Mock;

const wrapper = ({ children }: { children: ReactNode }) => {
  // A fresh client per test: no cache leaks between tests, and no retries to wait through.
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};

const category = (id: string, is_deleted: boolean) => ({
  id,
  name: id,
  is_deleted,
  created_at: "",
  updated_at: "",
});

describe("useCategories flow", () => {
  beforeEach(() => jest.clearAllMocks());

  it("hides deleted categories from the UI", async () => {
    getCategories.mockResolvedValue([category("kept", false), category("gone", true)]);

    const { result } = renderHook(() => useCategories(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.map((c) => c.id)).toEqual(["kept"]);
  });

  it("surfaces a failed request as an error state, not an empty list", async () => {
    getCategories.mockRejectedValue(new Error("Network Error"));

    const { result } = renderHook(() => useCategories(), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.data).toBeUndefined();
  });
});
