import { writable, derived, get } from 'svelte/store';
import { browser } from '$app/environment';
import { THEMES, FONTS, type Theme, type Alignment, type FontFamily } from '$lib/themes';

// Helper to sync store with URL hash
function createHashStore<T>(
  key: string,
  defaultValue: T,
  serialize: (val: T) => string = String,
  deserialize: (str: string) => T = (s) => s as T
) {
  const { subscribe, set, update } = writable<T>(defaultValue);

  // Initialize from URL hash on browser
  if (browser) {
    const params = new URLSearchParams(window.location.hash.slice(1));
    const hashValue = params.get(key);
    if (hashValue !== null) {
      try {
        set(deserialize(hashValue));
      } catch (e) {
        console.error(`Failed to deserialize ${key}:`, e);
      }
    }
  }

  // Update URL when store changes
  const setWithHash = (value: T) => {
    set(value);
    if (browser) {
      const params = new URLSearchParams(window.location.hash.slice(1));
      const serialized = serialize(value);
      if (serialized === serialize(defaultValue)) {
        params.delete(key);
      } else {
        params.set(key, serialized);
      }
      const newHash = params.toString();
      window.location.hash = newHash ? `#${newHash}` : '';
    }
  };

  return {
    subscribe,
    set: setWithHash,
    update: (fn: (val: T) => T) => {
      const currentVal = get({ subscribe });
      setWithHash(fn(currentVal));
    },
  };
}

// Theme
export const selectedThemeId = createHashStore<string>(
  'theme',
  'editorial',
  (val) => val,
  (str) => str
);
export const selectedTheme = derived(selectedThemeId, ($id) => THEMES[$id] || THEMES['editorial']);

// Alignment
export const alignment = createHashStore<Alignment>(
  'align',
  'center',
  (val) => val,
  (str) => str as Alignment
);

// Apply theme's default alignment when theme changes
if (browser) {
  let initialized = false;
  selectedTheme.subscribe(($theme) => {
    if (!initialized) {
      initialized = true;
      return;
    }
    alignment.set($theme.defaultAlignment || 'center');
  });
}

// Padding
export const padding = createHashStore<number>(
  'padding',
  64,
  (val) => String(val),
  (str) => parseInt(str, 10) || 64
);

// Font (can override theme default)
export const selectedFontId = createHashStore<FontFamily | ''>(
  'font',
  '',
  (val) => val,
  (str) => str as FontFamily | ''
);
export const currentFont = derived(
  [selectedFontId, selectedTheme],
  ([$fontId, $theme]) => ($fontId || $theme.font) as FontFamily
);
export const currentFontCSS = derived(currentFont, ($font) => FONTS[$font].css);
export const authorFontCSS = derived(
  selectedTheme,
  ($theme) => $theme.authorFont ? FONTS[$theme.authorFont].css : null
);

// Show background
export const showBackground = createHashStore<boolean>(
  'bg',
  true,
  (val) => val ? 'true' : 'false',
  (str) => str === 'true'
);

// Show quotation marks
export const showQuoteMarks = createHashStore<boolean>(
  'marks',
  true,
  (val) => val ? 'true' : 'false',
  (str) => str === 'true'
);

// Frame width (null means auto)
export const frameWidth = createHashStore<number | null>(
  'width',
  null,
  (val) => val === null ? '' : String(val),
  (str) => str === '' ? null : parseInt(str, 10) || null
);

// Copy current URL helper
export function copyShareableUrl(): string {
  if (browser) {
    return window.location.href;
  }
  return '';
}

export const showBrandLogo = writable<boolean>(true);