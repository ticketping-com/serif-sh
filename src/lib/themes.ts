export type QuoteStyle = 'brutalist' | "startup" | 'editorial' | 'breeze' | 'aura' | 'noir' | 'glass' | 'claude-code';
export type Alignment = 'left' | 'center' | 'right';
export type FontFamily = 'playfair' | 'crimson' | 'geist' | 'inter'|'mono'|'instrument-serif';
export type Brand = 'vercel' | 'peerlist';

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
  authorFont?: FontFamily;
  brand?: Brand;
  defaultAlignment?: Alignment;
  // Background image support
  backgroundImage?: string;
  backgroundSize?: string;
}

export const FONTS: Record<FontFamily, { name: string; css: string }> = {
  'geist': {
    name: 'Geist',
    css: '"Geist", sans-serif',
  },
  'inter': {
    name: 'Inter',
    css: '"Inter", sans-serif',
  },
   'playfair': {
    name: 'Playfair Display',
    css: '"Playfair Display", serif',
  },
  'crimson': {
    name: 'Crimson Pro',
    css: '"Crimson Pro", serif',
  },
  'mono': {
    name: 'JetBrains Mono',
    css: '"JetBrains Mono", monospace',
  },
  'instrument-serif': {
    name: 'Instrument Serif',
    css: '"Instrument Serif", serif',
  }
};

export const THEMES: Record<string, Theme> = {
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
    font: 'geist',
    authorFont: "geist",
    brand: 'vercel',
    defaultAlignment: 'left',
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
    font: 'geist',
    authorFont: "geist",
    brand: 'vercel',
    defaultAlignment: 'left',
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
    font: "instrument-serif",
    authorFont: "geist",
    brand: 'peerlist',
    defaultAlignment: 'left',
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
    font: "instrument-serif",
    authorFont: "geist",
    brand: 'peerlist',
    defaultAlignment: 'left',
  },
  "editorial": {
    id: 'editorial',
    name: 'Editorial',
    quoteStyle: 'editorial',
    background: '#FFFFF0',
    text: '#000000',
    accent: '#666666',
    quoteMark: '#000000',
    border: '#E5E7EB',
    font: 'playfair',
  },
  "breeze": {
    id: 'breeze',
    name: 'Breeze',
    quoteStyle: 'breeze',
    backgroundImage:'linear-gradient(180deg, rgb(196, 213, 255), rgb(255, 255, 255))',
    background: '#AEC6FF',
    cardBackground: '#FFFFFFF2',
    text: '#374151',
    accent: '#666666',
    quoteMark: '#AEC6FF',
    border: '#AEC6FF',
    font: 'crimson',
  },
  "aura": {
    id: 'aura',
    name: 'Aura',
    quoteStyle: 'aura',
    backgroundImage:'linear-gradient(0deg, rgba(162, 89, 255, 0.5), rgb(255, 135, 38))',
    background: '#FFFFFF',
    cardBackground: '#FFFFFF80',
    text: '#514437',
    accent: '#666666',
    quoteMark: '#FF943E99',
    border: '#FF943E99',
    font: 'inter',
  },
   "noir": {
    id: 'noir',
    name: 'Noir',
    quoteStyle: 'noir',
    background: '#000000',
    text: '#FFFFFF',
    accent: '#A0A0A0',
    quoteMark: '#FFCC00',
    border: '#FFCC00',
    font: 'playfair',
  },
  "glass": {
    id: 'glass',
    name: 'Glass',
    quoteStyle: 'glass',
    backgroundImage:'linear-gradient(140deg, rgb(177, 177, 177), rgb(24, 24, 24))',
    background: '#000000',
    text: '#FFFFFF',
    accent: '##EDEDED',
    quoteMark: '#FFFFFF',
    border: '#EAEAEA',
    font: 'crimson',
  },
  "claude-code": {
    id: 'claude-code',
    name: 'Claude code',
    quoteStyle: 'claude-code',
    background: '#DE7356',
    cardBackground: '#1E1E1E',
    text: '#737568',
    accent: '#DE7356',
    quoteMark: '#DE7356',
    border: '#FFFFFF',
    font: 'mono',
    defaultAlignment: 'left',
  }
};

export const PADDING_PRESETS = [32, 64, 96, 128];

export const DEFAULT_QUOTE = "Writing doesn't just communicate ideas; it generates them. If you're bad at writing and don't like to do it, you'll miss out on most of the ideas writing would have generated.";
export const DEFAULT_AUTHOR = "Paul Graham";
