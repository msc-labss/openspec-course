# Design

## Context

See proposal.md for motivation and specs/ for the required behaviour. What shapes the approach:

- `src/store.js` `add` computes the id as the highest id in the array plus one. The array is the only state, so once the highest task is removed nothing remembers its id.
- `load` returns the parsed file as is (a bare array, or `[]` when the file is missing); `save` writes the array it is given.
- `complete`, `remove` and `format` take the task array. `src/cli.js` calls `load`, one store function, then `save`. `list` never calls `save`.
- All tests are unit tests of `src/store.js` on in-memory arrays. Nothing touches a file or spawns the CLI.

## Goals / Non-Goals

**Goals:**

- One place decides the next id, and it is unit-tested.
- The rule for reading a file (old shape, new shape, bad counter) is a pure function, testable without a file.
- `complete`, `remove` and `format` keep their signatures, so their existing tests stay valid as written.

**Non-Goals:**

- Recovering ids that were removed from an old-format file before the upgrade (the file does not hold them).
- Validating a corrupt task file (not JSON, `tasks` not an array, tasks without numeric ids). Behaviour there is unchanged.
- Letting an older tasklog read the new shape.
- File locking or protection against two commands running at once.
- A CLI-level test harness.

## Decisions

**D1. The file becomes `{ "nextId": n, "tasks": [...] }`, where `nextId` is the id the next `add` will issue.**

- *Rejected: tombstones* (keep removed tasks in the array, flagged and hidden). The format would stay an array, but the file grows forever, every reader has to filter, and `remove` stops deleting.
- *Rejected: a sidecar counter file.* Two files can drift apart: copy or restore `tasks.json` alone and the counter is wrong.
- *Rejected: storing the last issued id instead of the next one.* Equivalent, but an empty new file would need `0`, a value that is never an id.

**D2. A pure `toState(data)` in `src/store.js` turns parsed JSON into `{ nextId, tasks }`; `load` calls it.** A bare array becomes `tasks`; an object contributes its `tasks`. In both cases `nextId` is the larger of the stored `nextId` (used only when it is a positive whole number) and the highest task id plus one. A missing file gives `{ nextId: 1, tasks: [] }`.

- *Rejected: trusting a stored `nextId` as is.* A hand edit or a merge of two files could then issue an id that is already in the list, which is worse than the bug being fixed.
- *Rejected: failing with an error on a bad counter.* The right value is always computable from the tasks, so there is nothing for the user to fix.
- *Rejected: doing this inside `load` only.* The rule would be reachable only through a file, and the tests work in memory.

**D3. `add(state, title)` takes and returns the whole state; `complete`, `remove` and `format` stay on the task array.** `add` issues `state.nextId` and returns `{ nextId: state.nextId + 1, tasks: [...] }`. `cli.js` passes `state.tasks` to the other three and saves `{ ...state, tasks: <result> }`, so the counter is carried through `done` and `remove` untouched.

- *Rejected: moving every store function to the state object.* It rewrites every existing test for no behaviour change, and the last design deliberately kept the `complete`/`remove` signatures.
- *Rejected: `add(tasks, title, id)` with `cli.js` incrementing the counter.* The id rule would be split across two files and half of it would sit in the untested one.

**D4. `save(file, state)` always writes the new shape, and the upgrade happens only through `save`.** `load` never writes. An old file is therefore upgraded by the first `add`, `done` or `remove` that succeeds, and left alone by `list` and by failed commands, with no extra code.

- *Rejected: upgrading inside `load`.* `list` would write to disk, and a read-only command changing the file is a surprise (it also breaks listing a read-only file).

## Risks / Trade-offs

- [The first `add` after upgrading an old file can reuse an id removed before the upgrade] → Accepted and stated in the proposal; the information is not in the file. It can happen once per file at most.
- [An older tasklog fails on a new-shape file with an unhelpful error (`tasks.reduce is not a function` or similar)] → Accepted; upgrading is one-way. Rollback is by hand: replace the file's contents with the value of its `tasks` member.
- [Scripts that read `tasks.json` as a top-level array break] → Listed under Impact in the proposal; they must read `.tasks`.
- [`add` now has a different first argument from `complete` and `remove`] → Accepted for the reasons in D3; `cli.js` is the only caller and makes the difference visible in four lines.
- [Two tasklog commands running at the same moment can still issue the same id] → Unchanged from today and out of scope.

## Migration Plan

No step for the user. Each task file is upgraded in place by the first command that changes it (D4). To go back to an older tasklog, replace the file's contents with its `tasks` array.
