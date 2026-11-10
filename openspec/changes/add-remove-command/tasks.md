# Tasks

## 1. Store: remove a task

- [ ] 1.1 In `src/store.js`, export `remove(tasks, id)`: throw `new Error('remove needs a task id')` when `id` is `NaN`; throw `new Error(`no task ${id}`)` when no task has that id (same check as `complete`); otherwise return a new array without that task. It must not mutate its input. Verify with the tests in 1.2.
- [ ] 1.2 In `test/store.test.js`, add tests: removing from the middle keeps the other tasks' ids, titles, done state and order; removing the only task returns `[]`; removing a completed task works; an unknown id throws `/no task 7/`; `remove(tasks, NaN)` throws `/remove needs a task id/` and not `/no task/`. Verify `npm test` passes.

## 2. CLI: the `remove` command

- [ ] 2.1 In `src/cli.js`, import `remove` and add a `command === 'remove'` branch next to `done`: `save(file, remove(tasks, Number(rest[0])))`. Verify in a temp directory with `TASKLOG_FILE` set: add two tasks, `remove 1` exits 0 with no output and `list` shows only task 2.
- [ ] 2.2 Verify the error paths with the same temp file: `remove 7` prints `tasklog: no task 7`; `remove abc` and `remove` with no id each print exactly `tasklog: remove needs a task id`. All three write to stderr, exit with code 1, and leave the task file byte-for-byte unchanged.
- [ ] 2.3 In `README.md`, add `node src/cli.js remove 1` to the usage block. Verify the documented commands run as written, in order.

## 3. Integration check

- [ ] 3.1 Run `npm test` and `openspec validate add-remove-command --strict`; verify both pass and that `add`, `done` and `list` behave as before.
