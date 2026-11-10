# Spec Delta

## Purpose

Defines how a new task gets its id, and guarantees that an id is a permanent name: once a task file has issued an id, it never issues that id to another task.

## ADDED Requirements

### Requirement: A new task gets the next id
The `add` command SHALL give the new task a whole-number id. The first task added to a new task file SHALL get id 1, and each later task SHALL get an id one greater than the last id the task file issued.

#### Scenario: First task
- **GIVEN** no task file exists
- **WHEN** the user runs `tasklog add "write the spec"`
- **THEN** `tasklog list` shows the task with id 1

#### Scenario: Following tasks count up
- **GIVEN** a task list with tasks 1 and 2, and no task has ever been removed
- **WHEN** the user runs `tasklog add "ship it"`
- **THEN** the new task has id 3

### Requirement: An id is never reused
Once a task file has issued an id, the system SHALL NOT issue that id again in that task file, whether the task that held it is still present or has been removed. Removing a task SHALL NOT make its id available to a later `add`.

#### Scenario: Removing the highest-numbered task
- **GIVEN** a task list with tasks 1, 2 and 3
- **WHEN** the user runs `tasklog remove 3` and then `tasklog add "call mum"`
- **THEN** the new task has id 4
- **AND** no task in the list has id 3

#### Scenario: Removing every task
- **GIVEN** a task list with tasks 1 and 2
- **WHEN** the user removes both tasks and then runs `tasklog add "start again"`
- **THEN** the new task has id 3

#### Scenario: Removing a task from the middle
- **GIVEN** a task list with tasks 1, 2 and 3
- **WHEN** the user runs `tasklog remove 2` and then `tasklog add "d"`
- **THEN** the new task has id 4

#### Scenario: A stale id fails instead of reaching another task
- **GIVEN** task 3 was the highest-numbered task, has been removed, and another task has been added since
- **WHEN** the user runs `tasklog done 3`
- **THEN** standard error shows `tasklog: no task 3`
- **AND** the command exits with code 1
- **AND** no task's done state has changed
