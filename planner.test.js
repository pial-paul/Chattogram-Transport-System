const assert = require('node:assert/strict');
const test = require('node:test');
const { stops, routes, sources } = require('./transit-data');
const { findStops, resolveStop, createPlanner } = require('./planner');

test('all route landmarks and sources resolve', () => {
  assert.equal(new Set(routes.map((route) => route.id)).size, routes.length);
  for (const route of routes) {
    assert.ok(route.stops.length > 1);
    assert.equal(new Set(route.stops).size, route.stops.length);
    assert.ok(route.stops.every((id) => Object.hasOwn(stops, id)));
    assert.ok(route.sources.length && route.sources.every((id) => sources[id]?.url));
  }
});

test('Bangla numerals, English punctuation and aliases resolve', () => {
  assert.equal(resolveStop(stops, '২ নং গেট').id, 'gate-2');
  assert.equal(resolveStop(stops, '  a.k. KHAN ').id, 'ak-khan');
  assert.equal(resolveStop(stops, 'পতেঙ্গা').id, 'patenga');
  assert.equal(findStops(stops, 'oxy', 'en')[0].id, 'oxygen');
  assert.equal(resolveStop(stops, 'somewhere unknown'), undefined);
});

test('direct trips slice the route in the requested direction', () => {
  const plan = createPlanner(routes);
  const [forward] = plan('new-market', 'patenga');
  const [reverse] = plan('patenga', 'new-market');
  assert.equal(forward[0].route.id, '6');
  assert.equal(reverse[0].toward, 'laldighi');
  assert.deepEqual(reverse[0].stops, [...forward[0].stops].reverse());
  assert.deepEqual(plan('new-market', 'new-market'), []);
});

test('one-change trips join at a shared landmark and preserve direction', () => {
  const trips = createPlanner(routes)('oxygen', 'agrabad');
  assert.ok(trips.length > 1);
  for (const [first, second] of trips) {
    assert.notEqual(first.route.id, second.route.id);
    assert.equal(first.stops[0], 'oxygen');
    assert.equal(first.stops.at(-1), second.stops[0]);
    assert.equal(second.stops.at(-1), 'agrabad');
  }
});

test('explicit one-way directions are respected, including at transfers', () => {
  const plan = createPlanner([
    { id: 'a', directions: [['a', 'b']] },
    { id: 'b', directions: [['b', 'c', 'a', 'f']] },
    { id: 'c', directions: [['d', 'e']] },
  ]);
  assert.equal(plan('a', 'c')[0].length, 2);
  assert.deepEqual(plan('f', 'b'), []);
  assert.deepEqual(plan('a', 'd'), []);
});
