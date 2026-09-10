import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { axe } from 'vitest-axe';
import { NotFoundPage } from './NotFoundPage';

function renderPage() {
  return render(
    <MemoryRouter>
      <NotFoundPage />
    </MemoryRouter>
  );
}

describe('NotFoundPage — accessibilité', () => {
  it("ne présente aucune violation d'accessibilité détectable automatiquement", async () => {
    const { container } = renderPage();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('permet de parcourir tous les éléments interactifs au clavier', async () => {
    const user = userEvent.setup();
    renderPage();

    expect(document.body).toHaveFocus();

    const focusedElements: Element[] = [];

    for (let i = 0; i < 15; i++) {
      await user.tab();
      const active = document.activeElement;

      if (active === document.body) break;

      expect(active).not.toBeNull();
      expect(active).toHaveFocus();
      focusedElements.push(active as Element);
    }

    expect(focusedElements.length).toBeGreaterThan(0);

    const retourLink = screen.getByRole('link', { name: /retour à la recherche/i });
    expect(focusedElements).toContain(retourLink);
  });

  it('le lien "Retour à la recherche" reçoit le focus explicitement au clavier', async () => {
    const user = userEvent.setup();
    renderPage();

    const retourLink = screen.getByRole('link', { name: /retour à la recherche/i });

    let guard = 0;
    while (document.activeElement !== retourLink && guard < 20) {
      await user.tab();
      guard++;
    }

    expect(retourLink).toHaveFocus();
  });
});