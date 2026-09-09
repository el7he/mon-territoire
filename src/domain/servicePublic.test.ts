import { describe, it, expect } from "vitest";
import { normalizeServicePublic } from "./servicePublic";

// Test des services publics

describe("normalizeServicePublic", () => {
  it("handles null, undefined, or empty objects without throwing exceptions", () => {
    expect(() => normalizeServicePublic(null)).not.toThrow();
    expect(() => normalizeServicePublic(undefined)).not.toThrow();
    expect(() => normalizeServicePublic({})).not.toThrow();
  });

  it("returns explicit fallback 'Adresse non renseignée' when address is missing or empty, never undefined", () => {
    const resNull = normalizeServicePublic(null);
    expect(resNull.adresse).toBe("Adresse non renseignée");
    expect(resNull.adresse).not.toBe("undefined");
    expect(resNull.adresse).not.toBeUndefined();

    const resEmptyAdr = normalizeServicePublic({ adresse: "   " });
    expect(resEmptyAdr.adresse).toBe("Adresse non renseignée");
  });

  it("provides explicit fallbacks for all null or missing fields", () => {
    const res = normalizeServicePublic({
      code_insee_commune: null,
      nom_commune: null,
      id_service_local: null,
      code_type_service_local: null,
      nom_structure: null,
      adresse: null,
      code_postal: null,
      telephone: null,
      url_site_web: null,
    });

    expect(res.id).toBe("service-inconnu");
    expect(res.codeInsee).toBe("N/A");
    expect(res.nomCommune).toBe("Commune non renseignée");
    expect(res.nomStructure).toBe("Service public");
    expect(res.adresse).toBe("Adresse non renseignée");
    expect(res.codePostal).toBe("Non renseigné");
    expect(res.telephone).toBe("Non renseigné");
    expect(res.urlSiteWeb).toBe("");
  });

  it("normalizes complete service record properly", () => {
    const res = normalizeServicePublic({
      code_insee_commune: "78440",
      nom_commune: "Les Mureaux",
      id_service_local: "service-123",
      nom_structure: "Mairie des Mureaux",
      adresse: "Place de la Libération 78440 Les Mureaux",
    });

    expect(res.id).toBe("service-123");
    expect(res.codeInsee).toBe("78440");
    expect(res.nomCommune).toBe("Les Mureaux");
    expect(res.nomStructure).toBe("Mairie des Mureaux");
    expect(res.adresse).toBe("Place de la Libération 78440 Les Mureaux");
  });
});
