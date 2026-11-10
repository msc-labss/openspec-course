import assert from 'node:assert/strict';
import { test } from 'node:test';
import { add, complete, format } from '../src/store.js';

test('add gives the next id and trims the title', () => {
  const tasks = add(add([], 'write the spec'), '  ship it ');
  assert.deepEqual(tasks.map((task) => [task.id, task.title]), [[1, 'write the spec'], [2, 'ship it']]);
});

test('add refuses an empty title', () => {
  assert.throws(() => add([], '   '), /needs a title/);
});

test('complete marks one task done', () => {
  const tasks = complete(add(add([], 'a'), 'b'), 2);
  assert.deepEqual(tasks.map((task) => task.done), [false, true]);
});

test('complete refuses an unknown id', () => {
  assert.throws(() => complete([], 7), /no task 7/);
});

test('format shows a checkbox per task', () => {
  assert.equal(format(complete(add([], 'a'), 1)), '[x] 1  a');
  assert.equal(format([]), 'No tasks yet.');
});
