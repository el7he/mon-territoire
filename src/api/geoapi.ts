import type { ApiCommuneRaw, Commune } from '../domain/commune';
import { CommuneData } from '../domain/commune';

interface SearchCommunesParams {
	query: string;
	limit?: number;
	signal?: AbortSignal;
}

export async function searchCommunes({
	query,
	limit = 10,
	signal,
}: SearchCommunesParams): Promise<Commune[]> {
	const text = query.trim();
	if (!text) {
		return [];
	}

	const url = new URL('https://geo.api.gouv.fr/communes');

	const isPostalCode = /^\d+$/.test(text);
	if (isPostalCode) {
		url.searchParams.set('codePostal', text);
	} else {
		url.searchParams.set('nom', text);
		url.searchParams.set('boost', 'population');
	}

	url.searchParams.set('fields', 'nom,code,codesPostaux,population,departement,region');
	url.searchParams.set('limit', limit.toString());

	const response = await fetch(url.toString(), {
		method: 'GET',
		headers: {
			accept: 'application/json',
		},
		signal,
	});

	if (!response.ok) {
		throw new Error(`Erreur API Géo (${response.status})`);
	}

	const data: ApiCommuneRaw[] = await response.json();

	const rawList = Array.isArray(data) ? data : [];
	
    const cleanResults: Commune[] = [];
	for (const rawItem of rawList) {
		const cleaned = CommuneData(rawItem);
		
		cleanResults.push(cleaned);
	}

	return cleanResults;
}