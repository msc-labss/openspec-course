# Proposal

## Why

A task's id is the only name a user has for it, and `remove` has no undo. Today `add` picks "highest id in the list, plus one", so removing the highest-numbered task (or every task) hands its id to the next task added. An old `tasklog done 3` from shell history or a script then silently acts on a different task instead of failing with `no task 3`. No spec says what id a new task gets, so this behaviour is an accident, not a decision.

The decision is: an id is a permanent name. Once issued it is never issued again in that task file.

## What Changes

- `add` gives each new task an id that has never been issued before in that task file, even when the task that held the highest id (or every task) has been removed.
- The task file records the next id to issue. **BREAKING** (file format): `tasks.json` changes from a bare array of tasks to an object `{ "nextId": <number>, "tasks": [...] }`.
- A task file written by an older version (a bare array) still loads. Its next id is taken to be one more than the highest id in it. The file is rewritten in the new shape the first time a command changes the task list; `list` does not rewrite it.
- If the recorded counter is missing or is not higher than every id in the file (for example after a hand edit), the next id is still one more than the highest id present, so two tasks never share an id.

Known limits, accepted:

- An old-format file does not record ids that were removed before the upgrade, so the first `add` after upgrading can still reuse one such id. From then on no id is reused.
- A version of tasklog from before this change cannot read a file in the new shape. Upgrading is one-way.

Assumptions:

- "Never" is scoped to one task file. A deleted `tasks.json` starts again at 1.
- Ids keep counting up by one from 1. There is no change to how `done`, `remove` or `list` behave or to any message they print.

## Capabilities

### New Capabilities

- `task-ids`: how a new task gets its id, and the guarantee that an id is never reused within a task file.
- `task-storage`: the shape of the task file on disk, including the id counter, and how files written by older versions are read and upgraded.

### Modified Capabilities

None. The `task-removal` requirements are unchanged; its "id that was already removed" scenario now keeps holding after a later `add`, which is covered by `task-ids`.

## Impact

- `src/store.js`: `load`, `save` and `add` work with the counter as well as the task list.
- `src/cli.js`: every command passes the counter through to `save`.
- `test/store.test.js`: the `add` tests change shape; new tests for id reuse and for reading old files.
- `tasks.json` files: upgraded in place on the first `add`, `done` or `remove`. Anything else that reads `tasks.json` directly (a script using `jq`, for example) must read `.tasks` instead of the top-level array.
- No new dependencies.
