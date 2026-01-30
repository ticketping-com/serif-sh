export type QuoteStyle = 'classic' | 'goodreads' | 'minimal' | 'editorial' | 'decorative' | 'modern';
export type Alignment = 'left' | 'center' | 'right';
export type FontFamily = 'playfair' | 'crimson' | 'source-serif' | 'libre';

export interface Theme {
  id: string;
  name: string;
  quoteStyle: QuoteStyle;
  background: {
    light: string;
    dark: string;
  };
  text: {
    light: string;
    dark: string;
  };
  accent: {
    light: string;
    dark: string;
  };
  quoteMark: {
    light: string;
    dark: string;
  };
  border?: {
    light: string;
    dark: string;
  };
  shadow?: boolean;
  font: FontFamily;
  // Background image support
  backgroundImage?: {
    light?: string;
    dark?: string;
  };
  // Container styling when there's a background image
  containerStyle?: {
    blur?: boolean;
    opacity?: number;
    rounded?: boolean;
  };
}

export const FONTS: Record<FontFamily, { name: string; css: string }> = {
  'playfair': {
    name: 'Playfair Display',
    css: '"Playfair Display", serif',
  },
  'crimson': {
    name: 'Crimson Pro',
    css: '"Crimson Pro", serif',
  },
  'source-serif': {
    name: 'Source Serif 4',
    css: '"Source Serif 4", serif',
  },
  'libre': {
    name: 'Libre Baskerville',
    css: '"Libre Baskerville", serif',
  },
};

export const THEMES: Record<string, Theme> = {
  paper: {
    id: 'paper',
    name: 'Paper',
    quoteStyle: 'classic',
    background: {
      light: '#fdfcf9',
      dark: '#1c1917',
    },
    text: {
      light: '#292524',
      dark: '#f5f5f4',
    },
    accent: {
      light: '#78716c',
      dark: '#a8a29e',
    },
    quoteMark: {
      light: '#d6d3d1',
      dark: '#44403c',
    },
    shadow: true,
    font: 'source-serif',
  },
  ink: {
    id: 'ink',
    name: 'Ink',
    quoteStyle: 'minimal',
    background: {
      light: '#ffffff',
      dark: '#0a0a0a',
    },
    text: {
      light: '#0a0a0a',
      dark: '#fafafa',
    },
    accent: {
      light: '#525252',
      dark: '#a3a3a3',
    },
    quoteMark: {
      light: '#e5e5e5',
      dark: '#262626',
    },
    font: 'crimson',
  },
  nightsky: {
    id: 'nightsky',
    name: 'Night Sky',
    quoteStyle: 'editorial',
    background: {
      light: 'transparent',
      dark: 'transparent',
    },
    backgroundImage: {
      light: `
        radial-gradient(ellipse at top, #1a1a2e 0%, #16213e 50%, #0f0f1a 100%),
        radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(255, 107, 107, 0.15) 0%, transparent 40%)
      `,
      dark: `
        radial-gradient(ellipse at top, #0a0a15 0%, #0d1525 50%, #050508 100%),
        radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.2) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(255, 107, 107, 0.1) 0%, transparent 40%)
      `,
    },
    text: {
      light: '#f1f5f9',
      dark: '#e2e8f0',
    },
    accent: {
      light: '#94a3b8',
      dark: '#64748b',
    },
    quoteMark: {
      light: '#c084fc',
      dark: '#a855f7',
    },
    border: {
      light: '#e2e8f0',
      dark: '#334155',
    },
    font: 'playfair',
    containerStyle: {
      blur: true,
      opacity: 0.85,
      rounded: true,
    },
  },
  vintage: {
    id: 'vintage',
    name: 'Vintage',
    quoteStyle: 'decorative',
    background: {
      light: 'linear-gradient(145deg, #f5e6d3 0%, #e8d4bc 100%)',
      dark: 'linear-gradient(145deg, #2d2318 0%, #1f1912 100%)',
    },
    text: {
      light: '#3d2914',
      dark: '#e6d5c3',
    },
    accent: {
      light: '#8b6f47',
      dark: '#a8956e',
    },
    quoteMark: {
      light: '#c4a882',
      dark: '#5c4a32',
    },
    border: {
      light: '#b8a082',
      dark: '#4a3d2a',
    },
    shadow: true,
    font: 'playfair',
  },
};

export const PADDING_PRESETS = [32, 64, 96, 128];

export const DEFAULT_QUOTE = "Writing doesn't just communicate ideas; it generates them. If you're bad at writing and don't like to do it, you'll miss out on most of the ideas writing would have generated.";
export const DEFAULT_AUTHOR = "Paul Graham";
