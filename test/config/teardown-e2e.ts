export async function teardownE2e(): Promise<void> {
  const app = (global as any).app;
  if (app) {
    await app.close();
  }
}
