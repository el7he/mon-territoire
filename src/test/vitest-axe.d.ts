// src/test/vitest-axe.d.ts
import type { AxeResults } from 'vitest-axe';

declare module 'vitest' {
  interface Assertion<T = any, R = any> {
    toHaveNoViolations(): T extends AxeResults ? void : never;
  }
}

export {};