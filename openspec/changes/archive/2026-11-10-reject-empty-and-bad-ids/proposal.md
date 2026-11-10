# Proposal

## Why

Two id mistakes still get a misleading answer. An empty id (`tasklog remove ""`, typically an unset shell variable) is converted to the number 0, so it is reported as `tasklog: no task 0` instead of as the usage error the `task-removal` spec gives a missing id. And `done` has no usage error at all: `tasklog done` and `tasklog done abc` print `tasklog: no task NaN`, the exact message `remove` was specified to never print.

## What Changes

- `remove` with an empty id fails like `remove` with no id: `tasklog: remove needs a task id` on stderr, exit code 1, task file unchanged.
- `done` with a missing, empty or non-numeric id fails the same way `remove` does, with its own command name: `tasklog: done needs a task id` on stderr, exit code 1, task file unchanged. It never prints `tasklog: no task NaN`.
- Both commands read the id through one shared rule, so they cannot drift apart again.
- Nothing else changes: a numeric id that matches no task still gives `tasklog: no task <id>` for both commands, and successful `done` and `remove` behave as before.

Assumptions recorded here rather than asked:

- **Whitespace-only counts as empty.** `remove " "` is treated like `remove ""`. Today it also becomes 0.
- **Numeric ids that can never match stay "unknown", not "bad".** `0`, `-1` and `1.5` are numbers, so they keep answering `tasklog: no task <id>`. Tightening the rule to positive integers is out of scope.
- **Still one id per invocation.** Only the first argument is read; extra arguments are ignored as today.

The current behaviour described above is read from `src/cli.js` and `src/store.js` (`Number('')` is `0`; `complete` has no `NaN` check); it was not reproduced by running the CLI during planning.

## Capabilities

### New Capabilities

- `task-completion`: marking a task done by its id. This change specifies only how `done` reports a missing, empty or non-numeric id; the rest of the existing `done` behaviour is left unspecified for now and does not change.

### Modified Capabilities

- `task-removal`: the requirement "Missing or non-numeric id is rejected" is extended so that an empty id is rejected the same way as a missing one.

## Impact

- `src/store.js`: a shared id-parsing rule, and a usage-error check in `complete`.
- `src/cli.js`: the `done` and `remove` branches read the id through the shared rule instead of a bare `Number(...)`.
- `test/store.test.js`: tests for the empty id and for the `done` usage error.
- No README change (usage is the same), no new dependencies, no change to the `tasks.json` format.
- Anyone scripting against `tasklog: no task NaN` or `tasklog: no task 0` for these inputs sees a different message; the exit code stays 1.
