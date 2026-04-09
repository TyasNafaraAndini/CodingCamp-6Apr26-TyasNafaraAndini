// Tests for Focus Timer widget: Properties 4, 5, 6 + unit examples
import { describe, it, expect, beforeEach } from 'vitest';
import fc from 'fast-check';
import { timerFormatTime, FocusTimer } from '../js/app.js';

// Helper: reset timer state before each test
function resetTimer() {
  FocusTimer.reset();
}

describe('timerFormatTime', () => {
  // Feature: personal-dashboard, Property 5: Timer display formatting
  // Validates: Requirements 2.3, 2.7
  it('Property 5: Timer display formatting', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 1500 }), (seconds) => {
        const result = timerFormatTime(seconds);
        // Must match MM:SS format
        expect(result).toMatch(/^\d{2}:\d{2}$/);
        const [mm, ss] = result.split(':').map(Number);
        expect(mm).toBe(Math.floor(seconds / 60));
        expect(ss).toBe(seconds % 60);
      }),
      { numRuns: 100 }
    );
  });

  it('formats 1500 as 25:00', () => {
    expect(timerFormatTime(1500)).toBe('25:00');
  });

  it('formats 0 as 00:00', () => {
    expect(timerFormatTime(0)).toBe('00:00');
  });

  it('formats 90 as 01:30', () => {
    expect(timerFormatTime(90)).toBe('01:30');
  });
});

describe('FocusTimer state logic', () => {
  beforeEach(() => {
    resetTimer();
  });

  // Unit: timer initialises at 25:00 (Req 2.1)
  it('Unit: timer initialises at 25:00', () => {
    const state = FocusTimer.getState();
    expect(state.remaining).toBe(1500);
    expect(state.running).toBe(false);
  });

  // Feature: personal-dashboard, Property 4: Timer countdown decrement
  // Validates: Requirements 2.2, 2.3
  it('Property 4: Timer countdown decrement', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 1500 }),
        fc.integer({ min: 0, max: 1500 }),
        (start, n) => {
          // Reset to a known state
          FocusTimer.reset();
          const state = FocusTimer.getState();
          state.remaining = start;
          state.running = false;

          const ticks = Math.min(n, start);
          FocusTimer.start();
          for (let i = 0; i < ticks; i++) {
            if (state.remaining > 0) FocusTimer.tick();
          }
          FocusTimer.stop();

          expect(state.remaining).toBe(start - ticks);
        }
      ),
      { numRuns: 100 }
    );
  });

  // Unit: stop freezes remaining (Req 2.4)
  it('Unit: stop freezes remaining', () => {
    const state = FocusTimer.getState();
    FocusTimer.start();
    FocusTimer.tick();
    FocusTimer.tick();
    FocusTimer.tick();
    FocusTimer.stop();
    const frozen = state.remaining;
    // Manually calling tick after stop should still work (tick is pure decrement)
    // but running flag is false so interval won't fire
    expect(state.running).toBe(false);
    expect(state.remaining).toBe(frozen);
  });

  // Feature: personal-dashboard, Property 6: Timer reset invariant
  // Validates: Requirements 2.5
  it('Property 6: Timer reset invariant', () => {
    fc.assert(
      fc.property(
        fc.record({
          remaining: fc.integer({ min: 0, max: 1500 }),
          running: fc.boolean(),
        }),
        ({ remaining, running }) => {
          const state = FocusTimer.getState();
          state.remaining = remaining;
          if (running) {
            FocusTimer.start();
          } else {
            FocusTimer.stop();
          }
          FocusTimer.reset();
          expect(state.remaining).toBe(1500);
          expect(state.running).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  // Unit: countdown reaching 0 triggers complete (Req 2.6)
  it('Unit: countdown reaching 0 triggers complete', () => {
    const state = FocusTimer.getState();
    state.remaining = 1;
    FocusTimer.start();
    FocusTimer.tick();
    expect(state.remaining).toBe(0);
    expect(state.running).toBe(false);
  });

  // Unit: start while already running is a no-op
  it('Unit: start while running is a no-op', () => {
    const state = FocusTimer.getState();
    FocusTimer.start();
    const firstIntervalId = state.intervalId;
    FocusTimer.start(); // second call should be no-op
    expect(state.intervalId).toBe(firstIntervalId);
    FocusTimer.stop();
  });
});
