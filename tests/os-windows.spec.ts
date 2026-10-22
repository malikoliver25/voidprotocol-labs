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

test('desktop icons can be dragged to reorder', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('.os-icon', { timeout: 15000 });

  // capture initial icon order
  const ids = await page.locator('.os-icon').evaluateAll((els) =>
    els.map((el) => (el as HTMLElement).dataset.iconId)
  );
  const first = ids[0];
  const second = ids[1];

  // drag first icon onto second icon's position
  const firstBox = await page.locator('.os-icon').first().boundingBox();
  const secondBox = await page.locator('.os-icon').nth(1).boundingBox();
  await page.mouse.move(firstBox!.x + 20, firstBox!.y + 20);
  await page.mouse.down();
  await page.mouse.move(secondBox!.x + 20, secondBox!.y + 20, { steps: 5 });
  await page.mouse.up();
  await page.waitForTimeout(300);

  // order should reflect the drag: second icon now appears before first
  const nextIds = await page.locator('.os-icon').evaluateAll((els) =>
    els.map((el) => (el as HTMLElement).dataset.iconId)
  );
  expect(nextIds.indexOf(second)).toBeLessThan(nextIds.indexOf(first));
});
test('desktop icons reorder via keyboard arrows', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('.os-icon', { timeout: 15000 });

  const ids = await page.locator('.os-icon').evaluateAll((els) =>
    els.map((el) => (el as HTMLElement).dataset.iconId)
  );
  const first = ids[0];
  const second = ids[1];

  // focus first icon
  await page.locator('.os-icon').first().focus();
  await page.waitForTimeout(100);

  // ArrowRight should move focus and swap first with second
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(150);

  const nextIds = await page.locator('.os-icon').evaluateAll((els) =>
    els.map((el) => (el as HTMLElement).dataset.iconId)
  );
  expect(nextIds.indexOf(second)).toBeLessThan(nextIds.indexOf(first));
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
