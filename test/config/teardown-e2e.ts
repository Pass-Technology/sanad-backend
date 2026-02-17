import { getE2eApp } from './e2e-context';

export async function teardownE2e(): Promise<void> {
  const app = getE2eApp();
  if (app) {
    await app.close();
  }
}
