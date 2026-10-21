import { test, expect } from '@playwright/test';

test('taskbar chips: raise -> minimize -> restore', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('.os-icon', { timeout: 15000 });
  await page.getByRole('button', { name: /Open ABOUT/ }).click();
  await page.waitForTimeout(300);
  await page.getByRole('button', { name: /Open SKILLS/ }).click();
  await page.waitForTimeout(300);

  const about = page.locator('.os-win[data-id="about"]');
  const skills = page.locator('.os-win[data-id="skills"]');
  const zOf = async (loc) => +(await loc.evaluate((el) => getComputedStyle(el).zIndex));

  // click ABOUT chip while SKILLS is in front -> ABOUT raises
  const zSkills = await zOf(skills);
  await page.locator('.os-taskchip', { hasText: 'ABOUT' }).click();
  await page.waitForTimeout(300);
  expect(await zOf(about)).toBeGreaterThan(zSkills);

  // click again (now front) -> minimizes
  await page.locator('.os-taskchip', { hasText: 'ABOUT' }).click();
  await page.waitForTimeout(300);
  expect(await about.count()).toBe(0);

  // click again -> restores
  await page.locator('.os-taskchip', { hasText: 'ABOUT' }).click();
  await page.waitForTimeout(300);
  expect(await about.count()).toBe(1);
});

test('drag is smooth: state commits every move, no snap-back', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('.os-icon', { timeout: 15000 });
  await page.getByRole('button', { name: /Open ABOUT/ }).click();
  await page.waitForTimeout(400);

  const win = page.locator('.os-win[data-id="about"]');
  const tb = win.locator('.os-titlebar');
  const box = await tb.boundingBox();
  const startX = box.x + 100, startY = box.y + 10;

  await page.mouse.move(startX, startY);
  await page.mouse.down();
  const samples = [];
  for (let i = 1; i <= 8; i++) {
    await page.mouse.move(startX + i * 25, startY + i * 6, { steps: 2 });
    await page.waitForTimeout(40);
    const r = await win.boundingBox();
    samples.push([Math.round(r.x), Math.round(r.y)]);
  }
  await page.mouse.up();
  await page.waitForTimeout(200);
  const final = await win.boundingBox();

  // window must track monotonically rightward — no snap-back to earlier positions
  const xs = samples.map(([x]) => x);
  const snapBacks = xs.filter((x, i) => i > 0 && x < xs[i - 1] - 2).length;
  expect(snapBacks).toBe(0);
  expect(Math.round(final.x)).toBeGreaterThan(samples[0][0] + 100);
});

test('window content scrolls when taller than maxHeight', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('.os-icon', { timeout: 15000 });
  await page.getByRole('button', { name: /Open UPLINK/ }).click();
  await page.waitForTimeout(400);

  const scroller = page.locator('.os-win[data-id="transmission"] > div').nth(1);
  const scrollable = await scroller.evaluate((el) => el.scrollHeight > el.clientHeight);
  expect(scrollable).toBe(true);
  // actually scroll it
  await scroller.evaluate((el) => { el.scrollTop = 40; });
  expect(await scroller.evaluate((el) => el.scrollTop)).toBe(40);
});

test('TRASH window has real content', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('.os-icon', { timeout: 15000 });
  await page.getByRole('button', { name: /Open TRASH/ }).click();
  await page.waitForTimeout(400);
  const trash = page.locator('.os-win[data-id="trash"]');
  await expect(trash).toContainText('7 deleted files');
  await expect(trash).toContainText('useTerminal.ts');
});
