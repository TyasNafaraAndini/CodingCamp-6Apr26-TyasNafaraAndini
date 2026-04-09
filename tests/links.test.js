// Tests for Quick Links widget: Properties 13-16 + unit examples
import { describe, it, expect, beforeEach, vi } from 'vitest';
import fc from 'fast-check';
import { isValidUrl, QuickLinks, loadFromStorage, saveToStorage } from '../js/app.js';

// --- Local Storage mock ---
let store = {};
const localStorageMock = {
  getItem: (key) => (key in store ? store[key] : null),
  setItem: (key, value) => { store[key] = String(value); },
  removeItem: (key) => { delete store[key]; },
};

beforeEach(() => {
  store = {};
  globalThis.localStorage = localStorageMock;
  // Reset links state to empty
  QuickLinks.setLinks([]);
});

// --- Arbitrary for a valid link object ---
const linkArb = fc.record({
  id: fc.uuid(),
  label: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
  url: fc.webUrl(),
});

// --- Property 13: Link addition correctness ---
describe('Property 13: Link addition correctness', () => {
  it('addLink increases list by 1 with correct trimmed label, url, and unique id', () => {
    // Feature: personal-dashboard, Property 13: For any non-empty label string and any string that is a valid absolute URL, calling addLink(label, url) SHALL increase the links list length by exactly 1, and the new link SHALL have the trimmed label, the original URL, and a unique id.
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
        fc.webUrl(),
        (label, url) => {
          QuickLinks.setLinks([]);
          const before = QuickLinks.getLinks().length;
          QuickLinks.addLink(label, url);
          const links = QuickLinks.getLinks();
          expect(links.length).toBe(before + 1);
          const added = links[links.length - 1];
          expect(added.label).toBe(label.trim());
          expect(added.url).toBe(url);
          expect(typeof added.id).toBe('string');
          expect(added.id.length).toBeGreaterThan(0);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// --- Property 14: Link addition rejection ---
describe('Property 14: Link addition rejection', () => {
  it('addLink with empty label leaves list unchanged', () => {
    // Feature: personal-dashboard, Property 14: For any empty label string or any string that is not a valid absolute URL, calling addLink(label, url) SHALL leave the links list unchanged.
    fc.assert(
      fc.property(
        fc.webUrl(),
        (url) => {
          QuickLinks.setLinks([]);
          QuickLinks.addLink('', url);
          expect(QuickLinks.getLinks().length).toBe(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('addLink with invalid URL leaves list unchanged', () => {
    // Feature: personal-dashboard, Property 14: For any empty label string or any string that is not a valid absolute URL, calling addLink(label, url) SHALL leave the links list unchanged.
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
        fc.string().filter(s => !isValidUrl(s)),
        (label, invalidUrl) => {
          QuickLinks.setLinks([]);
          QuickLinks.addLink(label, invalidUrl);
          expect(QuickLinks.getLinks().length).toBe(0);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// --- Property 15: Link deletion correctness ---
describe('Property 15: Link deletion correctness', () => {
  it('deleteLink removes the target link and reduces length by 1', () => {
    // Feature: personal-dashboard, Property 15: For any links list containing at least one link and any link id present in that list, calling deleteLink(id) SHALL produce a list that does not contain a link with that id and whose length is exactly one less than before.
    fc.assert(
      fc.property(
        fc.array(linkArb, { minLength: 1 }),
        fc.integer({ min: 0, max: 99 }),
        (links, indexSeed) => {
          const uniqueLinks = links.map((l, i) => ({ ...l, id: `id-${i}` }));
          QuickLinks.setLinks([...uniqueLinks]);
          const targetIndex = indexSeed % uniqueLinks.length;
          const targetId = uniqueLinks[targetIndex].id;
          const before = QuickLinks.getLinks().length;
          QuickLinks.deleteLink(targetId);
          const after = QuickLinks.getLinks();
          expect(after.length).toBe(before - 1);
          expect(after.find(l => l.id === targetId)).toBeUndefined();
        }
      ),
      { numRuns: 100 }
    );
  });
});

// --- Property 16: Link storage round-trip ---
describe('Property 16: Link storage round-trip', () => {
  it('serializing and deserializing links produces deeply equal array', () => {
    // Feature: personal-dashboard, Property 16: For any sequence of link mutations (add, delete), serializing the links list to Local Storage and then deserializing it SHALL produce an array that is deeply equal to the current in-memory links list.
    fc.assert(
      fc.property(
        fc.array(linkArb),
        (links) => {
          const uniqueLinks = links.map((l, i) => ({ ...l, id: `id-${i}` }));
          QuickLinks.setLinks([...uniqueLinks]);
          saveToStorage('dashboard_links', QuickLinks.getLinks());
          const loaded = loadFromStorage('dashboard_links');
          expect(loaded).toEqual(QuickLinks.getLinks());
        }
      ),
      { numRuns: 100 }
    );
  });
});

// --- Unit test: link opens in new tab ---
describe('Unit: link opens in new tab', () => {
  it('rendered anchor has target="_blank" and rel="noopener noreferrer"', () => {
    // Set up a minimal DOM for links-grid
    const grid = document.createElement('div');
    grid.id = 'links-grid';
    document.body.appendChild(grid);

    QuickLinks.setLinks([{ id: 'test-1', label: 'Example', url: 'https://example.com' }]);
    QuickLinks.render();

    const anchor = grid.querySelector('a');
    expect(anchor).not.toBeNull();
    expect(anchor.getAttribute('target')).toBe('_blank');
    expect(anchor.getAttribute('rel')).toBe('noopener noreferrer');

    document.body.removeChild(grid);
  });
});
