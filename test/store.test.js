import assert from 'node:assert/strict';
import { test } from 'node:test';
import { add, complete, format, parseId, remove } from '../src/store.js';

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

test('complete refuses a missing id as a usage error', () => {
  assert.throws(() => complete(add([], 'a'), NaN), (error) => {
    assert.match(error.message, /done needs a task id/);
    assert.doesNotMatch(error.message, /no task/);
    return true;
  });
});

test('parseId gives NaN for a missing, empty or non-numeric id', () => {
  assert.equal(parseId(undefined), NaN);
  assert.equal(parseId(''), NaN);
  assert.equal(parseId(' '), NaN);
  assert.equal(parseId('abc'), NaN);
});

test('parseId gives the number for a numeric id, including 0', () => {
  assert.equal(parseId('2'), 2);
  assert.equal(parseId('0'), 0);
});

test('remove from the middle leaves the other tasks unchanged', () => {
  const before = complete(add(add(add([], 'a'), 'b'), 'c'), 3);
  const snapshot = structuredClone(before);
  assert.deepEqual(remove(before, 2), [
    { id: 1, title: 'a', done: false },
    { id: 3, title: 'c', done: true },
  ]);
  assert.deepEqual(before, snapshot);
});

test('remove of the only task gives an empty list', () => {
  assert.deepEqual(remove(add([], 'a'), 1), []);
});

test('remove works on a completed task', () => {
  const tasks = remove(complete(add(add([], 'a'), 'b'), 1), 1);
  assert.deepEqual(tasks, [{ id: 2, title: 'b', done: false }]);
});

test('remove refuses an unknown id', () => {
  assert.throws(() => remove(add([], 'a'), 7), /no task 7/);
});

test('remove refuses a missing id as a usage error', () => {
  assert.throws(() => remove(add([], 'a'), NaN), (error) => {
    assert.match(error.message, /remove needs a task id/);
    assert.doesNotMatch(error.message, /no task/);
    return true;
  });
});

test('format shows a checkbox per task', () => {
  assert.equal(format(complete(add([], 'a'), 1)), '[x] 1  a');
  assert.equal(format([]), 'No tasks yet.');
});
