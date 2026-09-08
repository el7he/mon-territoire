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

export function CommuneData(raw: ApiCommuneRaw): Commune {
    return {
        codeInsee: raw.code || 'Inconnu',
        nom: raw.nom || 'Nom non renseigné',
        codesPostaux: Array.isArray(raw.codesPostaux) && raw.codesPostaux.length > 0 
        ? raw.codesPostaux 
        : ['Non renseigné'],
        population: typeof raw.population === 'number' 
        ? String(raw.population)
        : 'Non renseignée',
        departement: raw.departement?.nom 
        ? `${raw.departement.nom} (${raw.departement.code ?? 'Code non renseigné'})` 
        : 'Département non renseigné',
        region: raw.region?.nom || 'Région non renseignée',
    };
}