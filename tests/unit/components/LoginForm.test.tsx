/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { render, screen, within } from "@testing-library/react";
import LoginForm from "@/components/pages/Login/components/LoginForm";

jest.mock("@/hooks/useTranslate", () => ({ useTranslate: () => ({ t: (key: string) => key }) }));

const renderForm = (role = "customer") =>
  render(<LoginForm role={role} onSubmit={jest.fn()} loading={false} error={null} />);

describe("login page: service provider sign-up option", () => {
  it("shows a highlighted option that sends providers to the business listing page", () => {
    renderForm();
    const section = screen.getByRole("region", { name: "provider_signup_title" });
    expect(within(section).getByText("provider_signup_subtitle")).toBeInTheDocument();
    expect(within(section).getByRole("link", { name: "listYourBusiness" })).toHaveAttribute(
      "href",
      "/business-listing",
    );
  });

  it("keeps the customer sign-up link pointing at customer sign-up", () => {
    renderForm("customer");
    expect(screen.getByRole("link", { name: "sign_up" })).toHaveAttribute(
      "href",
      "/signUp?role=customer",
    );
  });
});
