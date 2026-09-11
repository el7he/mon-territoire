// src/pages/DetailSheet.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { DetailSheet } from './DetailSheet';
import { fetchCommuneRisks } from '../api/georisques';
import { searchCommunes } from '../api/geoapi';
import { searchByCommunes } from '../api/annuaire';

vi.mock('../api/georisques');
vi.mock('../api/geoapi');
vi.mock('../api/annuaire');

function renderAt(codeInsee: string) {
  return render(
    <MemoryRouter initialEntries={[`/info/${codeInsee}`]}>
      <Routes>
        <Route path="/info/:codeInsee" element={<DetailSheet />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('DetailSheet', () => {
  beforeEach(() => {
    vi.resetAllMocks();

    // Réponses par défaut neutres pour les hooks annexes,
    // à surcharger dans les tests qui s'y intéressent spécifiquement
    vi.mocked(searchCommunes).mockResolvedValue([]);
    vi.mocked(searchByCommunes).mockResolvedValue({ records: [], totalCount: 0 });
  });

  it('affiche les risques une fois les données chargées', async () => {
    vi.mocked(fetchCommuneRisks).mockResolvedValue({
      inseeCode: '57751',
      communeName: 'WOIPPY',
      risks: [
        { id: '11', type: 'Inondation', description: 'Pas de détail disponible' },
      ],
    });

    renderAt('57751');

    expect(screen.getByText(/chargement/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/WOIPPY/i)).toBeInTheDocument();
    });

    expect(screen.getByText('Inondation')).toBeInTheDocument();
  });

  it('affiche la page 404 si aucun risque n’est trouvé', async () => {
    vi.mocked(fetchCommuneRisks).mockResolvedValue({
      inseeCode: '00000',
      communeName: 'Nom non renseigné',
      risks: [],
    });

    renderAt('00000');

    await waitFor(() => {
      expect(screen.getByText(/404/i)).toBeInTheDocument();
    });
  });

  it('affiche une erreur si l’appel API échoue', async () => {
    vi.mocked(fetchCommuneRisks).mockRejectedValue(new Error('Erreur API Géorisques (500)'));

    renderAt('57751');

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  it('met à jour le titre de l’onglet avec le nom de la commune', async () => {
    vi.mocked(fetchCommuneRisks).mockResolvedValue({
      inseeCode: '57751',
      communeName: 'WOIPPY',
      risks: [{ id: '11', type: 'Inondation', description: '' }],
    });

    renderAt('57751');

    await waitFor(() => {
      expect(document.title).toBe('WOIPPY — 57751');
    });
  });
});