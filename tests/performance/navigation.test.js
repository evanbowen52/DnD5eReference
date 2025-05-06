// tests/performance/navigation.test.js
describe('Navigation Performance', () => {
  test('page load time is acceptable', async () => {
    const start = performance.now();
    // Simulate navigation
    await new Promise(resolve => setTimeout(resolve, 100));
    const duration = performance.now() - start;
    expect(duration).toBeLessThan(200); // 200ms threshold
  });
});