# Spec Delta

## Purpose

Defines the shape of the task file on disk, including the id counter that outlives removed tasks, and how task files written by older versions are read and upgraded.

## ADDED Requirements

### Requirement: The task file records the tasks and the next id
When the system writes the task file, it SHALL write a JSON object with two members: `tasks`, the array of tasks in list order, and `nextId`, the id the next added task will get. Each task SHALL keep the members `id`, `title` and `done`.

#### Scenario: File after the first add
- **GIVEN** no task file exists
- **WHEN** the user runs `tasklog add "write the spec"`
- **THEN** the task file is an object whose `tasks` holds one task with `id` 1, `title` "write the spec" and `done` false
- **AND** its `nextId` is 2

#### Scenario: The counter survives a removal
- **GIVEN** a task file with tasks 1, 2 and 3 and `nextId` 4
- **WHEN** the user runs `tasklog remove 3`
- **THEN** the task file's `tasks` holds tasks 1 and 2
- **AND** its `nextId` is still 4

### Requirement: Task files from older versions still load
The system SHALL accept a task file that is a bare JSON array of tasks, as written by older versions. Every command SHALL treat the array as the task list, and SHALL treat the next id as one greater than the highest id in the array, or 1 when the array is empty.

#### Scenario: Listing an old file
- **GIVEN** a task file containing the bare array of tasks 1 "a" and 2 "b" (done)
- **WHEN** the user runs `tasklog list`
- **THEN** the output shows task 1 "a" open followed by task 2 "b" done

#### Scenario: Adding to an old file
- **GIVEN** a task file containing the bare array of tasks 1 and 5
- **WHEN** the user runs `tasklog add "next"`
- **THEN** the new task has id 6

#### Scenario: Old file with an empty array
- **GIVEN** a task file containing `[]`
- **WHEN** the user runs `tasklog add "first"`
- **THEN** the new task has id 1

### Requirement: An old task file is upgraded on the first change
The system SHALL rewrite an old-format task file in the current shape when a command changes the task list (`add`, `done` or `remove`), keeping every task's id, title, done state and order. A command that does not change the task list, including `list` and any command that fails, SHALL leave the file as it was.

#### Scenario: Completing a task upgrades the file
- **GIVEN** a task file containing the bare array of open tasks 1 and 2
- **WHEN** the user runs `tasklog done 1`
- **THEN** the task file is an object whose `tasks` holds task 1 done and task 2 open
- **AND** its `nextId` is 3

#### Scenario: Listing does not rewrite the file
- **GIVEN** a task file containing a bare array of tasks
- **WHEN** the user runs `tasklog list`
- **THEN** the task file's contents are unchanged

#### Scenario: A failed command does not rewrite the file
- **GIVEN** a task file containing the bare array of task 1
- **WHEN** the user runs `tasklog remove 7`
- **THEN** the command exits with code 1
- **AND** the task file's contents are unchanged

### Requirement: The counter never yields an id that is in use
When a task file's `nextId` is missing, is not a positive whole number, or is not greater than every task id in the file, the system SHALL use one greater than the highest task id in the file as the next id, so that two tasks never share an id. The next write SHALL record the corrected counter.

#### Scenario: Counter lower than an existing id
- **GIVEN** a task file whose `tasks` holds tasks 1 and 5 and whose `nextId` is 2
- **WHEN** the user runs `tasklog add "next"`
- **THEN** the new task has id 6
- **AND** the task file's `nextId` is 7

#### Scenario: Counter missing
- **GIVEN** a task file that is an object whose `tasks` holds tasks 1 and 2 and that has no `nextId`
- **WHEN** the user runs `tasklog add "next"`
- **THEN** the new task has id 3

#### Scenario: Counter higher than every id is kept
- **GIVEN** a task file whose `tasks` holds only task 1 and whose `nextId` is 9
- **WHEN** the user runs `tasklog add "next"`
- **THEN** the new task has id 9
