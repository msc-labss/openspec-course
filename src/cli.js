#!/usr/bin/env node
import { add, complete, format, load, remove, save } from './store.js';

const file = process.env.TASKLOG_FILE ?? 'tasks.json';
const [command, ...rest] = process.argv.slice(2);

try {
  const tasks = load(file);
  if (command === 'add') {
    save(file, add(tasks, rest.join(' ')));
  } else if (command === 'done') {
    save(file, complete(tasks, Number(rest[0])));
  } else if (command === 'remove') {
    save(file, remove(tasks, Number(rest[0])));
  } else if (command === 'list' || command === undefined) {
    console.log(format(tasks));
  } else {
    throw new Error(`unknown command: ${command}`);
  }
} catch (error) {
  console.error(`tasklog: ${error.message}`);
  process.exitCode = 1;
}
