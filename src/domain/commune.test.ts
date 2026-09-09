import { describe, it, expect } from "vitest";
import { CommuneData } from "./commune";

//Test des données de la commune

describe("CommuneData normalization", () => {
  it("handles null, undefined, or empty objects without throwing exceptions", () => {
    expect(() => CommuneData(null)).not.toThrow();
    expect(() => CommuneData(undefined)).not.toThrow();
    expect(() => CommuneData({})).not.toThrow();
  });

  it("provides explicit fallback values for missing fields", () => {
    const resNull = CommuneData(null);
    expect(resNull.codeInsee).toBe("Inconnu");
    expect(resNull.nom).toBe("Nom non renseigné");
    expect(resNull.codesPostaux).toEqual(["Non renseigné"]);
    expect(resNull.population).toBe("Non renseignée");
    expect(resNull.departement).toBe("Département non renseigné");
    expect(resNull.region).toBe("Région non renseignée");
  });

  it("handles partial objects with null properties", () => {
    const resPartial = CommuneData({
      code: null,
      nom: null,
      codesPostaux: null,
      departement: null,
      region: null,
      population: null,
    });
    expect(resPartial.codeInsee).toBe("Inconnu");
    expect(resPartial.nom).toBe("Nom non renseigné");
    expect(resPartial.codesPostaux).toEqual(["Non renseigné"]);
    expect(resPartial.population).toBe("Non renseignée");
    expect(resPartial.departement).toBe("Département non renseigné");
    expect(resPartial.region).toBe("Région non renseignée");
  });

  it("normalizes valid raw commune object correctly", () => {
    const res = CommuneData({
      code: "78440",
      nom: "Les Mureaux",
      codesPostaux: ["78440"],
      population: 31000,
      departement: { code: "78", nom: "Yvelines" },
      region: { code: "11", nom: "Île-de-France" },
    });
    expect(res.codeInsee).toBe("78440");
    expect(res.nom).toBe("Les Mureaux");
    expect(res.codesPostaux).toEqual(["78440"]);
    expect(res.population).toBe("31000");
    expect(res.departement).toBe("Yvelines (78)");
    expect(res.region).toBe("Île-de-France");
  });
});
