# Design

## Context

See proposal.md for motivation. Today the id is handled in two places:

- `src/cli.js` converts the argument with `Number(rest[0])` in both the `done` and `remove` branches.
- `src/store.js` decides what is an error: `remove` throws `remove needs a task id` on `NaN`; `complete` has no such check.

`Number(undefined)` and `Number('abc')` are `NaN`, but `Number('')` and `Number(' ')` are `0`. So by the time the store sees an empty id it is indistinguishable from a real `0`, and no check inside `remove` or `complete` can catch it. The fix has to happen where the text is still text.

The only tests are unit tests of `src/store.js`; nothing spawns the CLI.

## Goals / Non-Goals

**Goals:**

- One rule for turning an argument into an id, used by both commands.
- The rule is unit-testable in the existing test file.

**Non-Goals:**

- Rejecting `0`, negative or fractional ids as usage errors (see proposal assumptions).
- A CLI-level test harness.
- Changing the signatures of `complete(tasks, id)` or `remove(tasks, id)`.

## Decisions

**Export a `parseId(text)` function from `src/store.js`.** It returns `NaN` when `text` is `undefined`, empty or only whitespace, and `Number(text)` otherwise. `src/cli.js` calls it in place of `Number(rest[0])` for `done` and `remove`.

- *Why not fix it inline in `cli.js`?* The CLI has no tests, so the empty-id rule would be covered only by manual checks. In `store.js` it gets a unit test.
- *Why not make `complete`/`remove` accept the raw string?* It would change their contract and every existing test that passes a number.

**`NaN` stays the "no usable id" signal, and each command names itself.** `complete` gains the same first-line check `remove` already has, throwing `done needs a task id`. `remove` is unchanged. The existing `tasklog: ${error.message}` wrapper in `cli.js` produces the exact messages in the specs.

- *Why not have `parseId` throw?* It would need the command name passed in to build the message, and `remove`'s existing `NaN` check and its test would become dead or redundant. Keeping the check in each command leaves that test valid as written.

## Risks / Trade-offs

- [The store message is the command name `done` while the function is `complete`] → Accepted: the message is user-facing and the user typed `done`.
- [A future id-taking command could call `Number(...)` directly and reintroduce the bug] → `parseId` sits next to the commands it serves and is the only id conversion left in `cli.js` after this change.
- [Scripts matching `no task NaN` / `no task 0` on these inputs break] → Exit code is unchanged (1); noted in proposal Impact.
