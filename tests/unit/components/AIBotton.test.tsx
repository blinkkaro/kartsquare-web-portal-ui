/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import uiReducer, { setInlineAiVisible } from "@/features/ui/uiSlice";
import AIBotton from "@/components/common/Ai/AIBotton";

jest.mock("next/navigation", () => ({ usePathname: () => "/" }));
jest.mock("next/image", () => ({ __esModule: true, default: () => null }));
jest.mock("@/hooks/useTranslate", () => ({ useTranslate: () => ({ t: (key: string) => key }) }));
jest.mock("@/helper/SecureStorage", () => ({ secureStorage: { getItem: () => null } }));
jest.mock("@/hooks/useAppConfig", () => ({ useAppAIServiceConfig: () => ({ data: null }) }));

function renderButton(inlineVisible: boolean) {
  const store = configureStore({ reducer: { ui: uiReducer } });
  store.dispatch(setInlineAiVisible(inlineVisible));
  return render(
    <Provider store={store}>
      <AIBotton setOpen={jest.fn()} />
    </Provider>,
  );
}

describe("floating Kart AI button", () => {
  it("is available by default", () => {
    renderButton(false);
    expect(screen.getAllByLabelText("Ask Kart AI").length).toBeGreaterThan(0);
  });

  it("steps aside while an inline Kart AI entry is on screen, so there is one entry point, not two", () => {
    renderButton(true);
    expect(screen.queryByLabelText("Ask Kart AI")).not.toBeInTheDocument();
  });
});
