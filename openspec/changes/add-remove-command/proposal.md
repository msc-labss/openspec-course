# Proposal

## Why

tasklog can add tasks and mark them done, but a task can never leave the list: a typo, a duplicate or a task that no longer matters stays in `tasks.json` until the file is edited by hand. A `remove` command closes that gap.

## What Changes

- Add a `remove <id>` command to the CLI that deletes the task with that id from the task file.
- Removing works for both open and completed tasks, and leaves every other task (id, title, done state, order) untouched.
- An id that matches no task fails the same way `done` does today: `tasklog: no task <id>` on stderr, exit code 1, task file unchanged.
- A missing or non-numeric id is a usage error, not an unknown task: `tasklog: remove needs a task id` on stderr, exit code 1, task file unchanged. It never prints `no task NaN`.
- Like `add` and `done`, a successful `remove` prints nothing and asks for no confirmation.
- Document the command in the README usage block.

Assumptions recorded here rather than asked:

- **Id assignment is unchanged.** New ids stay "highest existing id + 1". Consequence: removing the task with the highest id frees that id for the next `add`. Ids of the remaining tasks are never renumbered. Guaranteeing never-reused ids would need a stored counter and is out of scope.
- **One id per invocation.** `remove 1 2 3` is out of scope; only the first argument is read, as with `done`.
- **No undo.** A removed task is gone.

## Capabilities

### New Capabilities

- `task-removal`: deleting a task from the list by its id, including what happens to the remaining tasks and how an unknown, missing or non-numeric id is reported.

### Modified Capabilities

None. The project has no specs yet, and the behaviour of `add`, `done` and `list` does not change.

## Impact

- `src/store.js`: new exported function that returns the task list without the given id.
- `src/cli.js`: new `remove` branch in the command dispatch.
- `test/store.test.js`: tests for removal, the unknown-id error and the missing-id error.
- `README.md`: one more line in the usage example.
- No new dependencies and no change to the `tasks.json` format.
