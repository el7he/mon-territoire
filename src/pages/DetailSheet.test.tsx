import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { DetailSheet } from './DetailSheet';
import { fetchCommuneRisks } from '../api/georisques';

// On remplace tout le module par une fausse version
vi.mock('../api/georisques');

// Petit utilitaire : monte DetailSheet comme si l'utilisateur
// était arrivé directement sur /info/<codeInsee>
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

    // Chargement affiché avant la résolution de la promesse
    expect(screen.getByText(/chargement/i)).toBeInTheDocument();

    // waitFor : attend que le state se mette à jour après le fetch
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