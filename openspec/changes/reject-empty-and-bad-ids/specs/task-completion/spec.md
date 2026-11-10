# Spec Delta

## Purpose

Lets a user mark a task as done by its id with the `done <id>` command, and defines how that command answers when the id it is given cannot be used.

## ADDED Requirements

### Requirement: Missing, empty or non-numeric id is rejected
When `done` is given no id, an id that is empty or only whitespace, or an id that is not a number, the system SHALL fail without changing the task list: it SHALL print `tasklog: done needs a task id` to standard error and exit with code 1. The system SHALL NOT print `tasklog: no task NaN`, and SHALL NOT report an empty id as `tasklog: no task 0`.

#### Scenario: Missing id
- **GIVEN** a task list with open task 1
- **WHEN** the user runs `tasklog done` with no id
- **THEN** standard error shows `tasklog: done needs a task id`
- **AND** the command exits with code 1
- **AND** task 1 is still open

#### Scenario: Empty id
- **GIVEN** a task list with open task 1
- **WHEN** the user runs `tasklog done ""`
- **THEN** standard error shows `tasklog: done needs a task id`
- **AND** standard error does not show `no task 0`
- **AND** the command exits with code 1
- **AND** task 1 is still open

#### Scenario: Whitespace-only id
- **GIVEN** a task list with open task 1
- **WHEN** the user runs `tasklog done " "`
- **THEN** standard error shows `tasklog: done needs a task id`
- **AND** the command exits with code 1
- **AND** task 1 is still open

#### Scenario: Non-numeric id
- **GIVEN** a task list with open task 1
- **WHEN** the user runs `tasklog done abc`
- **THEN** standard error shows `tasklog: done needs a task id`
- **AND** standard error does not show `no task NaN`
- **AND** the command exits with code 1
- **AND** task 1 is still open

#### Scenario: Numeric id that matches no task is not a usage error
- **GIVEN** a task list with only task 1
- **WHEN** the user runs `tasklog done 7`
- **THEN** standard error shows `tasklog: no task 7`
- **AND** the command exits with code 1
