# Spec Delta

## Purpose

Lets a user delete a task from the task list by its id, so that mistakes and tasks that no longer matter do not stay in the list forever.

## ADDED Requirements

### Requirement: Remove a task by id
The system SHALL provide a `remove <id>` command that deletes the task with the given id from the task list and persists the result. The command SHALL apply to open and completed tasks alike, SHALL print nothing on success, and SHALL exit with code 0.

#### Scenario: Removing an open task
- **GIVEN** a task list with tasks 1 "write the spec" and 2 "ship it"
- **WHEN** the user runs `tasklog remove 1`
- **THEN** the command exits with code 0 and prints nothing
- **AND** `tasklog list` shows only task 2 "ship it"

#### Scenario: Removing a completed task
- **GIVEN** a task list where task 1 is marked done
- **WHEN** the user runs `tasklog remove 1`
- **THEN** task 1 is no longer in the list

#### Scenario: Removing the last task
- **GIVEN** a task list with exactly one task, with id 1
- **WHEN** the user runs `tasklog remove 1`
- **THEN** `tasklog list` prints `No tasks yet.`

### Requirement: Remaining tasks are unchanged
Removing a task SHALL NOT alter any other task: the remaining tasks SHALL keep their ids, titles, done state and relative order. The system SHALL NOT renumber tasks after a removal.

#### Scenario: Removing a task from the middle of the list
- **GIVEN** a task list with tasks 1 "a", 2 "b" (done) and 3 "c"
- **WHEN** the user runs `tasklog remove 2`
- **THEN** `tasklog list` shows task 1 "a" open followed by task 3 "c" open
- **AND** task 3 still has id 3

### Requirement: Unknown id is rejected
When the given id matches no task, the system SHALL fail without changing the task list: it SHALL print `tasklog: no task <id>` to standard error and exit with code 1. A missing or non-numeric id SHALL be treated as an id that matches no task.

#### Scenario: Id that does not exist
- **GIVEN** a task list with only task 1
- **WHEN** the user runs `tasklog remove 7`
- **THEN** standard error shows `tasklog: no task 7`
- **AND** the command exits with code 1
- **AND** the task list still contains task 1

#### Scenario: Id that was already removed
- **GIVEN** task 1 has been removed
- **WHEN** the user runs `tasklog remove 1` again
- **THEN** standard error shows `tasklog: no task 1` and the command exits with code 1

#### Scenario: Missing or non-numeric id
- **WHEN** the user runs `tasklog remove` with no id, or `tasklog remove abc`
- **THEN** the command prints an error starting with `tasklog: no task` to standard error and exits with code 1
- **AND** the task list is unchanged
