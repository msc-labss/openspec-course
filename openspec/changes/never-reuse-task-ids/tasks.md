# Tasks

## 1. Reading a task file into state

- [ ] 1.1 In `src/store.js`, export `toState(data)` that returns `{ nextId, tasks }` for a bare array and for a `{ nextId, tasks }` object, with `nextId` the larger of a valid stored counter and the highest task id plus one (D1, D2). Verify with new tests in `test/store.test.js`: `[]` gives `nextId` 1; an array with ids 1 and 5 gives 6; an object with ids 1 and 5 and `nextId` 2 gives 6; a missing or non-numeric `nextId` gives highest plus one; `nextId` 9 with only task 1 stays 9; and `npm test` passes.
- [ ] 1.2 Make `load(file)` return `toState` of the parsed file, and `{ nextId: 1, tasks: [] }` when the file is missing (D2). Verify with a test that writes a bare-array file into a temporary directory (`node:fs` `mkdtempSync`, no new dependency) and checks `load` returns the tasks and the right `nextId`, and a test that `load` of a missing path gives `{ nextId: 1, tasks: [] }`.
- [ ] 1.3 Make `save(file, state)` write `{ nextId, tasks }` (D1, D4). Verify with a test that saves a state to a temporary file, reads the JSON back, and finds an object with exactly `nextId` and `tasks`; and that `load` of that file returns an equal state.

## 2. Issuing ids from the counter

- [ ] 2.1 Change `add(state, title)` to issue `state.nextId` and return the new state with `nextId` one higher; keep the empty-title error as it is (D3). Update the two existing `add` tests to the new shape and verify `npm test` passes.
- [ ] 2.2 Add tests for the `task-ids` scenarios on in-memory state (D3): remove the highest task then add gives a new id (1, 2, 3; remove 3; add gives 4); remove every task then add does not restart at 1; remove from the middle then add gives 4; after the first case `complete(tasks, 3)` throws `no task 3`. Verify `npm test` passes. Update the helpers in the existing `complete`/`remove`/`format` tests only as far as needed to build their task arrays from `add`'s new return value.

## 3. Wiring the CLI

- [ ] 3.1 In `src/cli.js`, treat the result of `load` as state: `add` saves `add(state, title)`; `done` and `remove` save `{ ...state, tasks: <result> }`; `list` formats `state.tasks` and does not save (D3, D4). Verify by hand with `TASKLOG_FILE` set to a file in a temporary directory: `add a`, `add b`, `add c`, `remove 3`, `add d`, then `list` shows ids 1, 2 and 4, the file is an object with `nextId` 5, and `done 3` prints `tasklog: no task 3` with exit code 1.
- [ ] 3.2 Check the old-file path end to end (D2, D4): write `[{"id":1,"title":"a","done":false},{"id":5,"title":"b","done":true}]` to a temporary `TASKLOG_FILE`; verify `list` shows both tasks and leaves the file byte-for-byte unchanged, `remove 7` exits 1 and leaves it unchanged, and `add c` rewrites it as an object with task ids 1, 5 and 6 and `nextId` 7.

## 4. Integration check

- [ ] 4.1 Run `npm test` and `openspec validate never-reuse-task-ids --strict`; verify both pass and that `package.json` still lists no dependencies.
