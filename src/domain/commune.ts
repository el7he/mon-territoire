export interface ApiCommuneRaw {
    code?: string | null;
    nom?: string | null;
    codesPostaux?: string[] | null;
    departement?: { code?: string | null; nom?: string | null } | null;
    region?: { code?: string | null; nom?: string | null } | null;
    population?: number | null;
}

export interface Commune {
    codeInsee: string;
    nom: string;
    codesPostaux: string[];
    departement: string;
    region: string;
    population: string;
}

export function CommuneData(raw?: ApiCommuneRaw | null): Commune {
    const safeRaw = raw || {};
    return {
        codeInsee: safeRaw.code || 'Inconnu',
        nom: safeRaw.nom || 'Nom non renseigné',
        codesPostaux: Array.isArray(safeRaw.codesPostaux) && safeRaw.codesPostaux.length > 0 
            ? safeRaw.codesPostaux 
            : ['Non renseigné'],
        population: typeof safeRaw.population === 'number' 
            ? String(safeRaw.population)
            : 'Non renseignée',
        departement: safeRaw.departement?.nom 
            ? `${safeRaw.departement.nom} (${safeRaw.departement.code ?? 'Code non renseigné'})` 
            : 'Département non renseigné',
        region: safeRaw.region?.nom || 'Région non renseignée',
    };
}