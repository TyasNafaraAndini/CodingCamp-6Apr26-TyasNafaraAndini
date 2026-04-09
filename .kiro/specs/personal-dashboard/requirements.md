# Requirements Document

## Introduction

A personal dashboard web app built with vanilla HTML, CSS, and JavaScript. It runs entirely in the browser with no backend, using Local Storage for persistence. The dashboard provides four core widgets: a time/date greeting, a focus timer, a to-do list, and a quick links panel.

## Glossary

- **Dashboard**: The single-page web application rendered in the browser.
- **Widget**: A self-contained UI section within the Dashboard (Greeting, Focus_Timer, Todo_List, Quick_Links).
- **Greeting**: The widget that displays the current time, date, and a time-based greeting message.
- **Focus_Timer**: The widget that runs a 25-minute countdown timer with start, stop, and reset controls.
- **Todo_List**: The widget that manages a list of user tasks with add, edit, complete, and delete operations.
- **Quick_Links**: The widget that stores and displays user-defined shortcut links to external websites.
- **Storage**: The browser's Local Storage API used for all client-side data persistence.
- **Task**: A single to-do item with a text label and a completion state.
- **Link**: A user-defined entry consisting of a label and a URL stored in Quick_Links.

---

## Requirements

### Requirement 1: Time and Date Greeting

**User Story:** As a user, I want to see the current time, date, and a contextual greeting, so that I have an at-a-glance sense of the moment when I open the dashboard.

#### Acceptance Criteria

1. THE Greeting SHALL display the current time in HH:MM format, updated every second.
2. THE Greeting SHALL display the current date including the day of the week, month, day, and year.
3. WHEN the current hour is between 05:00 and 11:59, THE Greeting SHALL display the message "Good morning".
4. WHEN the current hour is between 12:00 and 17:59, THE Greeting SHALL display the message "Good afternoon".
5. WHEN the current hour is between 18:00 and 20:59, THE Greeting SHALL display the message "Good evening".
6. WHEN the current hour is between 21:00 and 04:59, THE Greeting SHALL display the message "Good night".

---

### Requirement 2: Focus Timer

**User Story:** As a user, I want a 25-minute countdown timer with start, stop, and reset controls, so that I can time focused work sessions.

#### Acceptance Criteria

1. THE Focus_Timer SHALL initialise with a countdown value of 25 minutes and 00 seconds (25:00).
2. WHEN the user activates the start control, THE Focus_Timer SHALL begin counting down one second at a time.
3. WHILE the Focus_Timer is counting down, THE Focus_Timer SHALL update the displayed time every second.
4. WHEN the user activates the stop control, THE Focus_Timer SHALL pause the countdown at the current value.
5. WHEN the user activates the reset control, THE Focus_Timer SHALL stop any active countdown and restore the display to 25:00.
6. WHEN the countdown reaches 00:00, THE Focus_Timer SHALL stop automatically and display a visual indication that the session has ended.
7. THE Focus_Timer SHALL display the remaining time in MM:SS format at all times.

---

### Requirement 3: To-Do List

**User Story:** As a user, I want to manage a list of tasks with add, edit, complete, and delete operations, so that I can track what I need to do.

#### Acceptance Criteria

1. WHEN the user submits a non-empty task label, THE Todo_List SHALL add a new Task with that label and an incomplete state.
2. IF the user submits an empty or whitespace-only task label, THEN THE Todo_List SHALL reject the submission and display an inline validation message.
3. WHEN the user activates the edit control on a Task, THE Todo_List SHALL allow the user to modify the Task label inline.
4. WHEN the user confirms an edited Task label that is non-empty, THE Todo_List SHALL save the updated label.
5. IF the user confirms an edited Task label that is empty or whitespace-only, THEN THE Todo_List SHALL reject the update and restore the previous label.
6. WHEN the user toggles the completion control on a Task, THE Todo_List SHALL update the Task's completion state and apply a visual distinction to completed Tasks.
7. WHEN the user activates the delete control on a Task, THE Todo_List SHALL remove the Task from the list.
8. WHEN any Task is added, edited, completed, or deleted, THE Storage SHALL persist the full updated Task list to Local Storage.
9. WHEN the Dashboard loads, THE Todo_List SHALL restore all Tasks from Local Storage and render them in their saved state.

---

### Requirement 4: Quick Links

**User Story:** As a user, I want to save and access shortcut links to my favourite websites, so that I can open them quickly from the dashboard.

#### Acceptance Criteria

1. WHEN the user submits a Link with a non-empty label and a valid URL, THE Quick_Links SHALL add the Link and display it as a clickable button.
2. IF the user submits a Link with an empty label or an invalid URL, THEN THE Quick_Links SHALL reject the submission and display an inline validation message.
3. WHEN the user activates a Link button, THE Quick_Links SHALL open the associated URL in a new browser tab.
4. WHEN the user activates the delete control on a Link, THE Quick_Links SHALL remove the Link from the panel.
5. WHEN any Link is added or deleted, THE Storage SHALL persist the full updated Link list to Local Storage.
6. WHEN the Dashboard loads, THE Quick_Links SHALL restore all Links from Local Storage and render them as clickable buttons.

---

### Requirement 5: Layout and Visual Design

**User Story:** As a user, I want a clean, readable interface with a clear visual hierarchy, so that I can use the dashboard without confusion or distraction.

#### Acceptance Criteria

1. THE Dashboard SHALL arrange all four widgets in a responsive grid layout that adapts to the viewport width.
2. THE Dashboard SHALL apply consistent typography with a readable font size of at least 14px for body text.
3. THE Dashboard SHALL maintain a single CSS file located at `css/style.css` and a single JavaScript file located at `js/app.js`.
4. WHILE the viewport width is below 768px, THE Dashboard SHALL stack widgets in a single-column layout.

---

### Requirement 6: Data Persistence and Storage

**User Story:** As a user, I want my tasks and links to survive page reloads, so that I don't lose my data between sessions.

#### Acceptance Criteria

1. THE Storage SHALL store Task data under a dedicated Local Storage key.
2. THE Storage SHALL store Link data under a dedicated Local Storage key.
3. IF Local Storage is unavailable or returns malformed data, THEN THE Dashboard SHALL initialise the affected widget with an empty state and continue operating normally.
4. THE Dashboard SHALL require no backend server, build step, or external dependency to function.
