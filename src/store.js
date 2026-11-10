import { existsSync, readFileSync, writeFileSync } from 'node:fs';

export function load(file) {
  if (!existsSync(file)) return [];
  return JSON.parse(readFileSync(file, 'utf8'));
}

export function save(file, tasks) {
  writeFileSync(file, JSON.stringify(tasks, null, 2) + '\n');
}

export function add(tasks, title) {
  const text = title.trim();
  if (!text) throw new Error('a task needs a title');
  const id = tasks.reduce((max, task) => Math.max(max, task.id), 0) + 1;
  return [...tasks, { id, title: text, done: false }];
}

export function complete(tasks, id) {
  if (!tasks.some((task) => task.id === id)) throw new Error(`no task ${id}`);
  return tasks.map((task) => (task.id === id ? { ...task, done: true } : task));
}

export function format(tasks) {
  if (tasks.length === 0) return 'No tasks yet.';
  return tasks.map((task) => `${task.done ? '[x]' : '[ ]'} ${task.id}  ${task.title}`).join('\n');
}
