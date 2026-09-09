// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Spinner } from "../components/Spinner";

describe("Spinner component", () => {
  it("renders with correct ARIA accessibility attributes", () => {
    render(<Spinner label="Chargement des données..." />);

    const statusElement = screen.getByRole("status");
    expect(statusElement).toBeDefined();
    expect(statusElement.getAttribute("aria-live")).toBe("polite");
    expect(statusElement.getAttribute("aria-busy")).toBe("true");
  });

  it("displays the default or custom loading label", () => {
    render(<Spinner label="Recherche de commune en cours..." />);

    expect(screen.getByText("Recherche de commune en cours...")).toBeDefined();
  });
});
