// Tests for storage utilities: Property 17
import { describe, it, expect, beforeEach, vi } from 'vitest';
import fc from 'fast-check';

// Load app.js to register globalThis functions
import '../js/app.js';

describe('storage', () => {
  beforeEach(() => {
    // Provide a minimal localStorage mock
    const store = {};
    vi.stubGlobal('localStorage', {
      getItem: (key) => (key in store ? store[key] : null),
      setItem: (key, val) => { store[key] = String(val); },
      removeItem: (key) => { delete store[key]; },
    });
  });

  // Feature: personal-dashboard, Property 17: Storage error resilience
  // Validates: Requirements 6.3
  it('Property 17: loadFromStorage returns [] and does not throw for null, undefined, or non-array JSON', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.constant(null),
          fc.constant('null'),
          fc.constant('undefined'),
          fc.constant(''),
          fc.constant('{}'),
          fc.constant('42'),
          fc.constant('"a string"'),
          fc.constant('not-json-at-all'),
          fc.string()
        ),
        (rawValue) => {
          const store = {};
          vi.stubGlobal('localStorage', {
            getItem: () => rawValue,
            setItem: (k, v) => { store[k] = v; },
            removeItem: (k) => { delete store[k]; },
          });

          let result;
          expect(() => {
            result = globalThis.loadFromStorage('test_key');
          }).not.toThrow();
          expect(Array.isArray(result)).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('loadFromStorage returns stored array when valid JSON array is present', () => {
    const data = [{ id: '1', label: 'task', completed: false }];
    localStorage.setItem('dashboard_todos', JSON.stringify(data));
    const result = globalThis.loadFromStorage('dashboard_todos');
    expect(result).toEqual(data);
  });

  it('saveToStorage persists data retrievable by loadFromStorage', () => {
    const data = [{ id: '2', label: 'link', url: 'https://example.com' }];
    globalThis.saveToStorage('dashboard_links', data);
    const result = globalThis.loadFromStorage('dashboard_links');
    expect(result).toEqual(data);
  });
});
