export type QuoteStyle = 'classic' | 'goodreads' | 'minimal' | 'editorial' | 'decorative' | 'modern' | 'elegant' | 'brutalist' | "startup";
export type Alignment = 'left' | 'center' | 'right';
export type FontFamily = 'playfair' | 'crimson' | 'source-serif' | 'libre' | 'sans' | 'roboto';

export interface Theme {
  id: string;
  name: string;
  quoteStyle: QuoteStyle;
  background: string;
  cardBackground?: string;
  text: string;
  accent: string;
  quoteMark: string;
  border?: string;
  shadow?: boolean;
  font: FontFamily;
  // Background image support
  backgroundImage?: string;
  backgroundSize?: string;
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
  'sans': {
    name: 'Geist Sans',
    css: '"Geist", sans-serif',
  },
  'roboto': {
    name: 'Roboto',
    css: '"Roboto", sans-serif',
  }
};

export const THEMES: Record<string, Theme> = {
  paper: {
    id: 'paper',
    name: 'Paper',
    quoteStyle: 'classic',
    background: '#ffffff',
    text: '#292524',
    accent: '#78716c',
    quoteMark: '#d6d3d1',
    border: '#e5e5e5',
    shadow: true,
    font: 'source-serif',
  },
  ink: {
    id: 'ink',
    name: 'Ink',
    quoteStyle: 'minimal',
    background: '#ffffff',
    text: '#0a0a0a',
    accent: '#525252',
    quoteMark: '#e5e5e5',
    font: 'crimson',
  },
  terminal: {
    id: 'terminal',
    name: 'Terminal',
    quoteStyle: 'modern',
    background: '#0d0d0d',
    backgroundImage: `
      linear-gradient(to right, #1f1f1f 1px, transparent 1px),
      linear-gradient(to bottom, #1f1f1f 1px, transparent 1px)
    `,
    backgroundSize: '48px 48px',
    text: '#f0f0f0',
    accent: '#5de4ee',
    quoteMark: '#f472b6',
    border: '#262626',
    font: 'crimson',
  },
  vintage: {
    id: 'vintage',
    name: 'Vintage',
    quoteStyle: 'decorative',
    background: 'linear-gradient(145deg, #f5e6d3 0%, #e8d4bc 100%)',
    text: '#3d2914',
    accent: '#8b6f47',
    quoteMark: '#c4a882',
    border: '#b8a082',
    shadow: true,
    font: 'playfair',
  },
  noir: {
    id: 'noir',
    name: 'Noir',
    quoteStyle: 'elegant',
    background: '#000000',
    text: '#ffffff',
    accent: '#ffffff',
    quoteMark: '#c9943c',
    border: '#c9943c',
    font: 'playfair',
  },
  lumiere: {
    id: 'lumiere',
    name: 'Lumière',
    quoteStyle: 'elegant',
    background: '#ffffff',
    text: '#1a1a1a',
    accent: '#1a1a1a',
    quoteMark: '#c9943c',
    border: '#c9943c',
    font: 'playfair',
  },
  "vercel-dark": {
    id: 'vercel-dark',
    name: 'Vercel Dark',
    quoteStyle: 'brutalist',
    background: '#000000',
    backgroundImage: 'url(/vercel-dark-bg.jpg)',
    backgroundSize: 'cover',
    cardBackground: '#000000',
    text: '#ffffff',
    accent: '#A0A0A0',
    quoteMark: '#0070F3',
    border: '#FFFFFF20',
    font: 'sans',
  },
  "vercel-light": {
    id: 'vercel-light',
    name: 'Vercel Light',
    quoteStyle: 'brutalist',
    background: '#ffffff',
    backgroundImage: 'url(/vercel-light-bg.jpg)',
    backgroundSize: 'cover',
    cardBackground: '#ffffff',
    text: '#111827',
    accent: '#666666',
    quoteMark: '#0070F3',
    border: '#0000001A',
    font: 'sans',
  },
  "peerlist-dark": {
    id: 'peerlist-dark',
    name: 'Peerlist Dark',
    quoteStyle: 'startup',
    background: "#171717",
    text: "#fafafa",
    accent: "#A0A0A0",
    quoteMark: "#00AA45",
    border: "#FFFFFF20",
    font: "roboto",
  },
  "peerlist-light": {
    id: 'peerlist-light',
    name: 'Peerlist Light',
    quoteStyle: 'startup',
    background: "#FFFFFF",
    text: "#0d0d0d",
    accent: "#666666",
    quoteMark: "#00AA45",
    border: "#0000001A",
    font: "roboto",
  }
};

export const PADDING_PRESETS = [32, 64, 96, 128];

export const DEFAULT_QUOTE = "Writing doesn't just communicate ideas; it generates them. If you're bad at writing and don't like to do it, you'll miss out on most of the ideas writing would have generated.";
export const DEFAULT_AUTHOR = "Paul Graham";
