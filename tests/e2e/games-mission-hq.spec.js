/**
 * Critical Flow Test: Games → Mission HQ
 * 
 * This test verifies the most critical user flow that has failed 3 times.
 * It ensures the "Start Learning" button on the games page correctly
 * navigates to Mission HQ without being redirected to authentication.
 */

import { test, expect } from '@playwright/test';

// Test configuration
const BASE_URL = process.env.BASE_URL || 'http://localhost:3003';
const TIMEOUT = 10000; // 10 seconds

test.describe('Games → Mission HQ Critical Flow', () => {
  test.beforeEach(async ({ page, context }) => {
    // Clear any existing authentication
    await context.clearCookies();
    await context.clearPermissions();
    
    // Set up console error tracking
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    page.consoleErrors = consoleErrors;
    
    // Set up network monitoring
    const failedRequests = [];
    page.on('response', response => {
      if (response.status() >= 400) {
        failedRequests.push({
          url: response.url(),
          status: response.status(),
          statusText: response.statusText()
        });
      }
    });
    page.failedRequests = failedRequests;
  });

  test('TC001: Games page loads without authentication', async ({ page }) => {
    // Navigate to games page
    const response = await page.goto('/games');
    
    // Verify successful response
    expect(response.status()).toBe(200);
    
    // Verify page content loads
    await expect(page.locator('h2')).toContainText('CodeFly Academy');
    
    // Verify no redirect to auth occurred
    expect(page.url()).toContain('/games');
    expect(page.url()).not.toContain('/auth');
    
    // Verify Agent Academy card is present
    const agentAcademyCard = page.locator('[data-testid="agent-academy-card"]').or(
      page.locator(':has-text("Agent Academy")')
    );
    await expect(agentAcademyCard).toBeVisible();
    
    // Verify "Start Learning" button is present
    const startButton = page.locator('button:has-text("Start Learning")').or(
      page.locator('text=Start Learning')
    );
    await expect(startButton).toBeVisible();
    
    // Verify no console errors
    expect(page.consoleErrors).toHaveLength(0);
  });

  test('TC002: Start Learning button navigates to mission-hq', async ({ page }) => {
    // Navigate to games page
    await page.goto('/games');
    
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');
    
    // Find and click the Start Learning button for Agent Academy
    const agentAcademySection = page.locator(':has-text("Agent Academy")').first();
    const startButton = agentAcademySection.locator('button:has-text("Start Learning")').or(
      agentAcademySection.locator(':has-text("Start Learning")')
    );
    
    // Ensure button is clickable
    await expect(startButton).toBeVisible();
    await expect(startButton).toBeEnabled();
    
    // Set up navigation promise to track redirect
    const navigationPromise = page.waitForURL('**/mission-hq*', { timeout: TIMEOUT });
    
    // Click the button
    await startButton.click();
    
    // Wait for navigation to complete
    await navigationPromise;
    
    // Verify we're on mission-hq page
    expect(page.url()).toContain('/mission-hq');
    expect(page.url()).not.toContain('/auth');
    
    // Verify mission-hq page content starts loading
    await expect(page.locator('h1')).toContainText('MISSION', { timeout: TIMEOUT });
    
    // Verify no failed network requests
    const criticalFailures = page.failedRequests.filter(req => 
      req.status === 500 || req.status === 404
    );
    expect(criticalFailures).toHaveLength(0);
  });

  test('TC003: Mission HQ loads correctly after navigation', async ({ page }) => {
    // Navigate through the full flow
    await page.goto('/games');
    await page.waitForLoadState('networkidle');
    
    const startButton = page.locator('button:has-text("Start Learning")').first();
    await startButton.click();
    
    // Wait for mission-hq to load
    await page.waitForURL('**/mission-hq*');
    await page.waitForLoadState('networkidle');
    
    // Verify mission-hq page elements
    await expect(page.locator('h1')).toContainText('MISSION', { timeout: TIMEOUT });
    
    // Check for mission cards or operation content
    const missionContent = page.locator(':has-text("OPERATION")').or(
      page.locator(':has-text("MISSION")').or(
        page.locator('.mission').or(
          page.locator('[class*="mission"]')
        )
      )
    );
    await expect(missionContent).toBeVisible({ timeout: TIMEOUT });
    
    // Verify no authentication redirect occurred
    expect(page.url()).not.toContain('/auth');
    expect(page.url()).not.toContain('/signin');
    
    // Check that the page is interactive (not just a loading state)
    const interactiveElements = page.locator('button, a, [role="button"]');
    await expect(interactiveElements.first()).toBeVisible({ timeout: TIMEOUT });
  });

  test('TC004: Flow works with demo authentication', async ({ page, context }) => {
    // Set demo authentication cookies
    await context.addCookies([
      {
        name: 'demo_auth_token',
        value: 'demo_access_2024',
        domain: 'localhost',
        path: '/'
      },
      {
        name: 'demo_user_role', 
        value: 'student',
        domain: 'localhost',
        path: '/'
      }
    ]);
    
    // Navigate to games page
    await page.goto('/games');
    await page.waitForLoadState('networkidle');
    
    // Click Start Learning
    const startButton = page.locator('button:has-text("Start Learning")').first();
    await startButton.click();
    
    // Verify navigation to mission-hq
    await page.waitForURL('**/mission-hq*');
    
    // Verify mission-hq recognizes demo user
    await page.waitForLoadState('networkidle');
    
    // Should not redirect to auth since demo user is authenticated
    expect(page.url()).toContain('/mission-hq');
    expect(page.url()).not.toContain('/auth');
    
    // Verify demo user context is preserved
    const userInfo = page.locator(':has-text("AGENT")').or(
      page.locator(':has-text("demo")').or(
        page.locator('.user')
      )
    );
    // User info might be visible but not required for this test to pass
  });

  test('TC005: Regression test - middleware configuration', async ({ page }) => {
    // This test checks the middleware behavior indirectly by testing the flow
    
    // Test 1: Games page should be accessible without auth
    const gamesResponse = await page.goto('/games');
    expect(gamesResponse.status()).toBe(200);
    expect(page.url()).toContain('/games');
    
    // Test 2: Mission-hq should be accessible without auth (might show auth prompt in UI)
    const missionResponse = await page.goto('/mission-hq');
    expect(missionResponse.status()).toBe(200);
    expect(page.url()).toContain('/mission-hq');
    
    // The page might internally handle auth, but it shouldn't redirect at the middleware level
    // This confirms that both routes are in the public array
  });

  test('TC006: Cross-browser navigation consistency', async ({ page, browserName }) => {
    // This test runs on all configured browsers via Playwright projects
    
    await page.goto('/games');
    await page.waitForLoadState('networkidle');
    
    const startButton = page.locator('button:has-text("Start Learning")').first();
    await startButton.click();
    
    await page.waitForURL('**/mission-hq*', { timeout: TIMEOUT });
    
    // Verify consistent behavior across browsers
    expect(page.url()).toContain('/mission-hq');
    await expect(page.locator('h1')).toContainText('MISSION', { timeout: TIMEOUT });
    
    // Log browser-specific results for reporting
    console.log(`✅ Flow successful in ${browserName}`);
  });

  test('TC007: Performance and timing validation', async ({ page }) => {
    // Start timing
    const startTime = Date.now();
    
    // Navigate to games
    await page.goto('/games');
    const gamesLoadTime = Date.now() - startTime;
    
    // Wait for full load
    await page.waitForLoadState('networkidle');
    
    // Navigate to mission-hq
    const navStartTime = Date.now();
    const startButton = page.locator('button:has-text("Start Learning")').first();
    await startButton.click();
    
    await page.waitForURL('**/mission-hq*');
    await page.waitForLoadState('networkidle');
    const navTime = Date.now() - navStartTime;
    
    const totalTime = Date.now() - startTime;
    
    // Performance assertions
    expect(gamesLoadTime).toBeLessThan(5000); // Games loads in < 5s
    expect(navTime).toBeLessThan(3000);       // Navigation < 3s  
    expect(totalTime).toBeLessThan(8000);     // Total flow < 8s
    
    console.log(`Performance metrics:
      Games load: ${gamesLoadTime}ms
      Navigation: ${navTime}ms  
      Total: ${totalTime}ms`);
  });

  test('TC008: Error state handling', async ({ page }) => {
    // Test with simulated network issues
    
    // Block some requests to simulate partial failures
    await page.route('**/api/lessons**', route => route.abort());
    
    await page.goto('/games');
    await page.waitForTimeout(1000); // Allow for any async errors
    
    const startButton = page.locator('button:has-text("Start Learning")').first();
    await startButton.click();
    
    await page.waitForURL('**/mission-hq*');
    
    // Flow should still work even if some API calls fail
    expect(page.url()).toContain('/mission-hq');
    expect(page.url()).not.toContain('/auth');
  });
});

test.describe('Regression Prevention Tests', () => {
  test('TC009: Middleware route configuration check', async ({ page }) => {
    // Test that simulates the common failure scenarios
    
    // If middleware was reverted, these requests would redirect to /auth
    const testRoutes = ['/games', '/mission-hq'];
    
    for (const route of testRoutes) {
      const response = await page.goto(route);
      
      // Should get 200 response, not a redirect
      expect(response.status()).toBe(200);
      expect(page.url()).toContain(route);
      expect(page.url()).not.toContain('/auth');
    }
  });
  
  test('TC010: End-to-end flow integrity', async ({ page }) => {
    // Complete flow test that would catch any regression
    
    // Step 1: Games page accessible
    await page.goto('/games');
    await expect(page.locator('h2')).toContainText('CodeFly Academy');
    
    // Step 2: Agent Academy card visible and interactive
    const agentCard = page.locator(':has-text("Agent Academy")');
    await expect(agentCard).toBeVisible();
    
    // Step 3: Start Learning button clickable  
    const startButton = page.locator('button:has-text("Start Learning")').first();
    await expect(startButton).toBeEnabled();
    
    // Step 4: Navigation to mission-hq works
    await startButton.click();
    await page.waitForURL('**/mission-hq*');
    
    // Step 5: Mission HQ loads with expected content
    await expect(page.locator('h1')).toContainText('MISSION');
    
    // Step 6: No authentication redirect in the entire flow
    expect(page.url()).not.toContain('/auth');
    expect(page.url()).not.toContain('/signin');
    
    console.log('✅ Complete end-to-end flow successful');
  });
});