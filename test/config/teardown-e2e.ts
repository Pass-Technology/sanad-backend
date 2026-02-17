export async function teardownE2e(): Promise<void> {
  const app = global.app;
  if (app) {
    await app.close();
  }
}
