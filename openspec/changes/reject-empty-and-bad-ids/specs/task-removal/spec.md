# Spec Delta

## MODIFIED Requirements

### Requirement: Missing or non-numeric id is rejected
When no id is given, the given id is empty or only whitespace, or the given id is not a number, the system SHALL fail without changing the task list: it SHALL print `tasklog: remove needs a task id` to standard error and exit with code 1. The system SHALL NOT print `tasklog: no task NaN`, and SHALL NOT report an empty id as `tasklog: no task 0`.

#### Scenario: Missing id
- **GIVEN** a task list with task 1
- **WHEN** the user runs `tasklog remove` with no id
- **THEN** standard error shows `tasklog: remove needs a task id`
- **AND** the command exits with code 1
- **AND** the task list still contains task 1

#### Scenario: Empty id
- **GIVEN** a task list with task 1
- **WHEN** the user runs `tasklog remove ""`
- **THEN** standard error shows `tasklog: remove needs a task id`
- **AND** standard error does not show `no task 0`
- **AND** the command exits with code 1
- **AND** the task list still contains task 1

#### Scenario: Whitespace-only id
- **GIVEN** a task list with task 1
- **WHEN** the user runs `tasklog remove " "`
- **THEN** standard error shows `tasklog: remove needs a task id`
- **AND** the command exits with code 1
- **AND** the task list still contains task 1

#### Scenario: Non-numeric id
- **GIVEN** a task list with task 1
- **WHEN** the user runs `tasklog remove abc`
- **THEN** standard error shows `tasklog: remove needs a task id`
- **AND** the command exits with code 1
- **AND** the task list still contains task 1
