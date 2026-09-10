import { describe, it, expect } from "vitest";
import { normalizeRiskItem, normalizeRiskSummary } from "./risks";

// Test des risques

describe("Risks normalization", () => {
  describe("normalizeRiskItem", () => {
    it("handles null or undefined input safely", () => {
      expect(() => normalizeRiskItem(null)).not.toThrow();
      expect(() => normalizeRiskItem(undefined)).not.toThrow();
      expect(() => normalizeRiskItem({})).not.toThrow();
    });

    it("returns explicit fallbacks for missing risk properties", () => {
      const item = normalizeRiskItem({});
      expect(item.id).toBe("risk-inconnu");
      expect(item.type).toBe("Risque non spécifié");
      expect(item.description).toBe("Pas de détail disponible");
    });
  });

  describe("normalizeRiskSummary", () => {
    it("handles null or undefined input safely", () => {
      expect(() => normalizeRiskSummary(null)).not.toThrow();
      expect(() => normalizeRiskSummary(undefined)).not.toThrow();
    });

    it("normalizes summary with fallbacks", () => {
      const summary = normalizeRiskSummary(null, "78440");
      expect(summary.inseeCode).toBe("78440");
      expect(summary.communeName).toBe("Nom non renseigné");
      expect(summary.risks).toEqual([]);
    });
  });
});
