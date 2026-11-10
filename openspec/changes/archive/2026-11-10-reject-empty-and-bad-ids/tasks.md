# Tasks

## 1. Store: one rule for reading an id

- [x] 1.1 In `src/store.js`, export `parseId(text)`: return `NaN` when `text` is `undefined`, `''` or only whitespace; otherwise return `Number(text)`. Verify with the tests in 1.2.
- [x] 1.2 In `test/store.test.js`, add a test for `parseId`: `undefined`, `''`, `' '` and `'abc'` each give `NaN`; `'2'` gives `2`; `'0'` gives `0` (a number, not a usage error). Verify `npm test` passes.

## 2. Store: `done` rejects a bad id

- [x] 2.1 In `src/store.js`, make `complete(tasks, id)` throw `new Error('done needs a task id')` when `id` is `NaN`, before the existing `no task` check (same shape as `remove`). Verify with the test in 2.2.
- [x] 2.2 In `test/store.test.js`, add a test that `complete(tasks, NaN)` throws `/done needs a task id/` and not `/no task/`, mirroring the existing `remove` usage-error test. Verify `npm test` passes and that the existing `complete refuses an unknown id` test still passes unchanged.

## 3. CLI: both commands use the shared rule

- [x] 3.1 In `src/cli.js`, import `parseId` and replace `Number(rest[0])` with `parseId(rest[0])` in the `done` and `remove` branches. Verify no `Number(` call remains in `src/cli.js`.
- [x] 3.2 Verify `remove` in a temp directory with `TASKLOG_FILE` set and one task added: `remove ""`, `remove " "`, `remove abc` and `remove` with no id each print exactly `tasklog: remove needs a task id` to stderr, exit with code 1, and leave the task file byte-for-byte unchanged; `remove 7` still prints `tasklog: no task 7`.
- [x] 3.3 Verify `done` with the same temp file: `done ""`, `done " "`, `done abc` and `done` with no id each print exactly `tasklog: done needs a task id` to stderr, exit with code 1, and leave the task file byte-for-byte unchanged; `done 7` still prints `tasklog: no task 7`; `done 1` exits 0 with no output and `list` shows `[x] 1`.

## 4. Integration check

- [x] 4.1 Run `npm test` and `openspec validate reject-empty-and-bad-ids --strict`; verify both pass and that `add` and `list` behave as before.
