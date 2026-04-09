// Tests for Greeting widget: Properties 1, 2, 3
// Feature: personal-dashboard
import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { formatTime, formatDate, getGreeting } from '../js/app.js';

const WEEKDAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

// Property 1: Time formatting correctness
// Validates: Requirements 1.1
describe('Property 1: Time formatting correctness', () => {
  it('formatTime returns zero-padded HH:MM for any date', () => {
    fc.assert(
      fc.property(fc.date(), (date) => {
        const result = formatTime(date);
        expect(result).toMatch(/^\d{2}:\d{2}$/);
        const [hh, mm] = result.split(':').map(Number);
        expect(hh).toBe(date.getHours());
        expect(mm).toBe(date.getMinutes());
      }),
      { numRuns: 100 }
    );
  });
});

// Property 2: Date formatting completeness
// Validates: Requirements 1.2
describe('Property 2: Date formatting completeness', () => {
  it('formatDate contains weekday, day, month, and year for any date', () => {
    fc.assert(
      fc.property(fc.date(), (date) => {
        const result = formatDate(date);
        expect(result).toContain(WEEKDAYS[date.getDay()]);
        expect(result).toContain(MONTHS[date.getMonth()]);
        expect(result).toContain(String(date.getDate()));
        expect(result).toContain(String(date.getFullYear()));
      }),
      { numRuns: 100 }
    );
  });
});

// Property 3: Greeting selection correctness
// Validates: Requirements 1.3, 1.4, 1.5, 1.6
describe('Property 3: Greeting selection correctness', () => {
  const VALID_GREETINGS = ['Good morning', 'Good afternoon', 'Good evening', 'Good night'];

  it('getGreeting returns one of the four valid strings for any hour in [0,23]', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 23 }), (hour) => {
        const result = getGreeting(hour);
        expect(VALID_GREETINGS).toContain(result);
      }),
      { numRuns: 100 }
    );
  });

  it('getGreeting returns correct string for each hour range', () => {
    // 05–11 → Good morning
    for (let h = 5; h <= 11; h++) expect(getGreeting(h)).toBe('Good morning');
    // 12–17 → Good afternoon
    for (let h = 12; h <= 17; h++) expect(getGreeting(h)).toBe('Good afternoon');
    // 18–20 → Good evening
    for (let h = 18; h <= 20; h++) expect(getGreeting(h)).toBe('Good evening');
    // 21–23, 0–4 → Good night
    for (const h of [21, 22, 23, 0, 1, 2, 3, 4]) expect(getGreeting(h)).toBe('Good night');
  });
});
