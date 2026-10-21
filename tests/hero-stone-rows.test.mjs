import test from 'node:test';
import assert from 'node:assert/strict';
import { heroStoneRows } from '../app/data/hero-stone-rows.ts';

test('moving rows cannot form matching adjacent stone pairs at any cyclic alignment', () => {
  const pairs = new Set();
  for (const { order } of heroStoneRows) {
    assert.deepEqual(
      [...order].sort(),
      [0, 1, 2, 3, 4, 5, 6, 7],
      'Each row retains all eight photographs',
    );
    for (let i = 0; i < order.length; i++) {
      // Include the repeated group's seam, not only pairs inside one copy.
      const pair = `${order[i]}:${order[(i + 1) % order.length]}`;
      assert.ok(!pairs.has(pair), `Repeated adjacent pair would allow row alignment: ${pair}`);
      pairs.add(pair);
    }
  }
});
