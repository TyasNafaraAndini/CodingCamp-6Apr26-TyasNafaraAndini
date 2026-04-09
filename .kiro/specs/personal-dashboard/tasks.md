# Implementation Plan: Personal Dashboard

## Overview

Implement a single-page personal dashboard using vanilla HTML, CSS, and JavaScript. The app is delivered as three files (`index.html`, `css/style.css`, `js/app.js`) with no build step or external dependencies. Four widgets — Greeting, Focus Timer, To-Do List, and Quick Links — each manage their own state and persist to Local Storage where applicable. Property-based tests use fast-check across five test files.

## Tasks

- [x] 1. Set up project structure and core files
  - Create `index.html` with the four widget containers and correct DOM ids
  - Create empty `css/style.css` and `js/app.js` stubs
  - Create `tests/` directory with empty test file stubs
  - Add a `package.json` with vitest and fast-check as dev dependencies
  - _Requirements: 5.3, 6.4_

- [ ] 2. Implement shared utilities and storage helpers
  - [x] 2.1 Write `loadFromStorage(key)` and `saveToStorage(key, data)` in `js/app.js`
    - Wrap `localStorage.getItem` / `JSON.parse` in try/catch; return `[]` on any error
    - _Requirements: 6.1, 6.2, 6.3_
  - [ ]* 2.2 Write property test for storage error resilience (Property 17)
    - **Property 17: Storage error resilience**
    - **Validates: Requirements 6.3**
    - File: `tests/storage.test.js`

- [ ] 3. Implement Greeting widget
  - [x] 3.1 Write `formatTime(date)`, `formatDate(date)`, and `getGreeting(hour)` pure functions in `js/app.js`
    - `formatTime` → zero-padded HH:MM; `formatDate` → "Weekday, DD Month YYYY"; `getGreeting` → one of four strings based on hour range
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_
  - [ ]* 3.2 Write property test for time formatting (Property 1)
    - **Property 1: Time formatting correctness**
    - **Validates: Requirements 1.1**
    - File: `tests/greeting.test.js`
  - [ ]* 3.3 Write property test for date formatting (Property 2)
    - **Property 2: Date formatting completeness**
    - **Validates: Requirements 1.2**
    - File: `tests/greeting.test.js`
  - [ ]* 3.4 Write property test for greeting selection (Property 3)
    - **Property 3: Greeting selection correctness**
    - **Validates: Requirements 1.3, 1.4, 1.5, 1.6**
    - File: `tests/greeting.test.js`
  - [x] 3.5 Wire Greeting widget `init()` in `js/app.js`
    - Start `setInterval(tick, 1000)` on `DOMContentLoaded`; update `#greeting-message`, `#greeting-time`, `#greeting-date`
    - _Requirements: 1.1, 1.2_

- [ ] 4. Implement Focus Timer widget
  - [x] 4.1 Write `formatTime(seconds)` and timer state logic (`start`, `stop`, `reset`, `tick`) in `js/app.js`
    - State: `{ remaining: 1500, running: false, intervalId: null }`; `onComplete()` adds `.timer-complete` class
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7_
  - [ ]* 4.2 Write property test for timer countdown decrement (Property 4)
    - **Property 4: Timer countdown decrement**
    - **Validates: Requirements 2.2, 2.3**
    - File: `tests/timer.test.js`
  - [ ]* 4.3 Write property test for timer display formatting (Property 5)
    - **Property 5: Timer display formatting**
    - **Validates: Requirements 2.3, 2.7**
    - File: `tests/timer.test.js`
  - [ ]* 4.4 Write property test for timer reset invariant (Property 6)
    - **Property 6: Timer reset invariant**
    - **Validates: Requirements 2.5**
    - File: `tests/timer.test.js`
  - [ ]* 4.5 Write unit tests for timer init, stop, and complete (example-based)
    - Assert `remaining === 1500` and display `"25:00"` on init (Req 2.1)
    - Assert remaining frozen after stop (Req 2.4)
    - Assert `running === false` and `.timer-complete` present when countdown hits 0 (Req 2.6)
    - File: `tests/timer.test.js`
  - [x] 4.6 Wire Focus Timer `init()` and attach button listeners in `js/app.js`
    - Bind `#timer-start`, `#timer-stop`, `#timer-reset` to their handlers; render `#timer-display`
    - _Requirements: 2.1, 2.2, 2.4, 2.5_

- [x] 5. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Implement To-Do List widget
  - [x] 6.1 Write `addTask`, `editTask`, `toggleTask`, `deleteTask`, and `render` functions in `js/app.js`
    - Use `"dashboard_todos"` storage key; generate ids with `crypto.randomUUID()`; trim and validate labels
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9_
  - [ ]* 6.2 Write property test for task addition correctness (Property 7)
    - **Property 7: Task addition correctness**
    - **Validates: Requirements 3.1**
    - File: `tests/todo.test.js`
  - [ ]* 6.3 Write property test for task addition rejection (Property 8)
    - **Property 8: Task addition rejection**
    - **Validates: Requirements 3.2**
    - File: `tests/todo.test.js`
  - [ ]* 6.4 Write property test for task edit correctness and rejection (Property 9)
    - **Property 9: Task edit correctness and rejection**
    - **Validates: Requirements 3.4, 3.5**
    - File: `tests/todo.test.js`
  - [ ]* 6.5 Write property test for task completion toggle round-trip (Property 10)
    - **Property 10: Task completion toggle round-trip**
    - **Validates: Requirements 3.6**
    - File: `tests/todo.test.js`
  - [ ]* 6.6 Write property test for task deletion correctness (Property 11)
    - **Property 11: Task deletion correctness**
    - **Validates: Requirements 3.7**
    - File: `tests/todo.test.js`
  - [ ]* 6.7 Write property test for task storage round-trip (Property 12)
    - **Property 12: Task storage round-trip**
    - **Validates: Requirements 3.8, 3.9, 6.1**
    - File: `tests/todo.test.js`
  - [ ]* 6.8 Write unit test for inline edit mode (example-based)
    - Trigger edit on a task; assert `<input>` element is rendered in place of label span (Req 3.3)
    - File: `tests/todo.test.js`
  - [x] 6.9 Wire To-Do List `init()` and attach form/list listeners in `js/app.js`
    - Bind `#todo-add`, `#todo-input`, `#todo-list` (delegated); show/clear `#todo-validation`
    - _Requirements: 3.1, 3.2, 3.8, 3.9_

- [x] 7. Implement Quick Links widget
  - [x] 7.1 Write `addLink`, `deleteLink`, `isValidUrl`, and `render` functions in `js/app.js`
    - Use `"dashboard_links"` storage key; validate URL with `new URL(str)`; render as `<a target="_blank" rel="noopener noreferrer">`
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_
  - [ ]* 7.2 Write property test for link addition correctness (Property 13)
    - **Property 13: Link addition correctness**
    - **Validates: Requirements 4.1**
    - File: `tests/links.test.js`
  - [ ]* 7.3 Write property test for link addition rejection (Property 14)
    - **Property 14: Link addition rejection**
    - **Validates: Requirements 4.2**
    - File: `tests/links.test.js`
  - [ ]* 7.4 Write property test for link deletion correctness (Property 15)
    - **Property 15: Link deletion correctness**
    - **Validates: Requirements 4.4**
    - File: `tests/links.test.js`
  - [ ]* 7.5 Write property test for link storage round-trip (Property 16)
    - **Property 16: Link storage round-trip**
    - **Validates: Requirements 4.5, 4.6, 6.2**
    - File: `tests/links.test.js`
  - [ ]* 7.6 Write unit test for link opens new tab (example-based)
    - Assert rendered anchor has `target="_blank"` and `rel="noopener noreferrer"` (Req 4.3)
    - File: `tests/links.test.js`
  - [x] 7.7 Wire Quick Links `init()` and attach form/grid listeners in `js/app.js`
    - Bind `#link-add`, `#link-label-input`, `#link-url-input`; show/clear `#link-validation`
    - _Requirements: 4.1, 4.2, 4.5, 4.6_

- [x] 8. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 9. Implement responsive CSS layout and visual design
  - [x] 9.1 Write CSS Grid layout for the four-widget dashboard in `css/style.css`
    - Default multi-column grid; single-column below 768px via media query; body font-size ≥ 14px
    - _Requirements: 5.1, 5.2, 5.4_
  - [ ]* 9.2 Write layout smoke test (example-based)
    - Assert all four widget container elements exist in the DOM (Req 5.1)
    - File: `tests/storage.test.js` or a dedicated `tests/layout.test.js`

- [x] 10. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Each task references specific requirements for traceability
- Property tests use fast-check with a minimum of 100 iterations per property
- Each property test must include the comment `// Feature: personal-dashboard, Property N: <property text>`
- Local Storage is mocked via a plain in-memory object in tests (`getItem`, `setItem`, `removeItem`)
- Pure logic functions (formatTime, getGreeting, addTask, etc.) must be exported or otherwise accessible from test files
