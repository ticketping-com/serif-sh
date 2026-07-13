import { writable, derived, get } from 'svelte/store';
import { browser } from '$app/environment';
import { selectedThemeId } from './settings';
import { PRESETS } from '$lib/preset-libraries';

export interface CustomBgConfig {
  enabled: boolean;
  type: 'solid' | 'gradient' | 'pattern' | 'image' | 'preset';
  solid: {
    hex: string;
    opacity: number;
    h: number;
    s: number;
    v: number;
  };
  gradient: {
    type: 'linear' | 'radial';
    angle: number;
    activeStopId: string;
    stops: Array<{
      id: string;
      offset: number; // 0-100
      hex: string;
      opacity: number;
    }>;
  };
  pattern: {
    enabled: boolean;
    source: 'dots' | 'grid' | 'blueprint' | 'dual-gradient-overlay-strong' | 'top-fade-grid' | 'bottom-fade-grid' | 'diagonal-fade-grid-left' | 'diagonal-fade-grid-right' | 'diagonal-fade-bottom-grid-Left' | 'diagonal-fade-bottom-grid-right' | 'diagonal-fade-center-grid' | 'diagonal-cross-grid' | 'diagonal-cross-grid-top' | 'diagonal-cross-grid-bottom' | 'diagonal-cross-top-right-fade-grid' | 'diagonal-cross-top-left-fade-grid' | 'diagonal-cross-Bottom-right-fade-grid' | 'diagonal-cross-Bottom-left-fade-grid' | 'diagonal-cross-center-fade-grid' | 'dashed-grid-light' | 'dashed-top-fade-grid' | 'dashed-bottom-fade-grid';
    scale: number;
  };
  image: {
    url: string;
    fill: 'fill' | 'fit' | 'stretch' | 'tile';
    exposure: number; // 0-200, default 100
    contrast: number; // 0-200, default 100
    saturation: number; // 0-200, default 100
    temperature: number; // 0-200, default 100
    tint: number; // 0-200, default 100
    blur: number; // 0-100, default 0
  };
  preset: {
    id: string;
  };
}

export const DEFAULT_CUSTOM_BG: CustomBgConfig = {
  enabled: false,
  type: 'solid',
  solid: {
    hex: '#FDFCF9',
    opacity: 100,
    h: 45,
    s: 1.58,
    v: 99.2
  },
  gradient: {
    type: 'linear',
    angle: 90,
    activeStopId: 'stop-1',
    stops: [
      { id: 'stop-1', offset: 0, hex: '#FFFFFF', opacity: 100 },
      { id: 'stop-2', offset: 100, hex: '#000000', opacity: 100 }
    ]
  },
  pattern: {
    enabled: false,
    source: 'grid',
    scale: 100
  },
  image: {
    url: '',
    fill: 'fill',
    exposure: 100,
    contrast: 100,
    saturation: 100,
    temperature: 100,
    tint: 100,
    blur: 0
  },
  preset: {
    id: ''
  }
};

export const customBgConfig = writable<CustomBgConfig>(DEFAULT_CUSTOM_BG);
export const customBgPanelOpen = writable<boolean>(false);

// Load from local storage
if (browser) {
  const stored = localStorage.getItem('serif-custom-bg');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      // Migrate older versions gracefully
      if (parsed.solid && typeof parsed.solid === 'string') {
        const hex = parsed.solid;
        const rgb = hexToRgb(hex);
        let h = 0, s = 0, v = 100;
        if (rgb) {
          const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
          h = hsv.h; s = hsv.s; v = hsv.v;
        }
        parsed.solid = { hex, opacity: 100, h, s, v };
      }
      
      // Ensure preset field exists for older configs
      if (!parsed.preset) {
        parsed.preset = { id: '' };
      }
      
      // Migrate legacy 'pattern' type to overlay
      if (parsed.type === 'pattern') {
        parsed.type = 'solid';
        if (parsed.pattern) {
          parsed.pattern.enabled = true;
        } else {
          parsed.pattern = { enabled: true, source: 'grid', scale: 100 };
        }
      }

      customBgConfig.set({ ...DEFAULT_CUSTOM_BG, ...parsed });
    } catch (e) {
      console.error('Failed to parse custom bg config', e);
    }
  }

  customBgConfig.subscribe((val) => {
    localStorage.setItem('serif-custom-bg', JSON.stringify(val));
  });

  let initialized = false;
  selectedThemeId.subscribe(() => {
    if (!initialized) {
      initialized = true;
      return;
    }
    customBgConfig.update((c) => {
      if (c.enabled) {
        return { ...c, enabled: false };
      }
      return c;
    });
  });
}

// Utility: HSV to RGB
export function hsvToRgb(h: number, s: number, v: number) {
  s /= 100;
  v /= 100;
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  let r = 0, g = 0, b = 0;

  if (0 <= h && h < 60) { r = c; g = x; b = 0; }
  else if (60 <= h && h < 120) { r = x; g = c; b = 0; }
  else if (120 <= h && h < 180) { r = 0; g = c; b = x; }
  else if (180 <= h && h < 240) { r = 0; g = x; b = c; }
  else if (240 <= h && h < 300) { r = x; g = 0; b = c; }
  else if (300 <= h && h < 360) { r = c; g = 0; b = x; }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255)
  };
}

export function rgbToHex(r: number, g: number, b: number) {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('').toUpperCase();
}

export function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

export function rgbToHsv(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, v = max;
  const d = max - min;
  s = max === 0 ? 0 : d / max;

  if (max === min) {
    h = 0;
  } else {
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    v: Math.round(v * 100)
  };
}

export function hexToRgba(hex: string, opacity: number) {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity / 100})`;
}

// Derived CSS styles
export const customBgStyle = derived(customBgConfig, ($config) => {
  if (!$config.enabled) return '';
  
  let css = '';
  if ($config.type === 'solid') {
    css += `background-color: ${hexToRgba($config.solid.hex, $config.solid.opacity)}; background-image: none;`;
  } else if ($config.type === 'gradient') {
    const { type, angle, stops } = $config.gradient;
    const sortedStops = [...stops].sort((a, b) => a.offset - b.offset);
    const stopsStr = sortedStops.map(s => `${hexToRgba(s.hex, s.opacity)} ${s.offset}%`).join(', ');
    if (type === 'linear') {
      css += `background-image: linear-gradient(${angle}deg, ${stopsStr});`;
    } else {
      css += `background-image: radial-gradient(circle, ${stopsStr});`;
    }
  } else if ($config.type === 'image') {
    const { url, fill } = $config.image;
    if (url) {
      css += `background-image: url(${url});`;
      if (fill === 'fill') {
        css += `background-size: cover; background-position: center; background-repeat: no-repeat;`;
      } else if (fill === 'fit') {
        css += `background-size: contain; background-position: center; background-repeat: no-repeat;`;
      } else if (fill === 'stretch') {
        css += `background-size: 100% 100%; background-position: center; background-repeat: no-repeat;`;
      } else if (fill === 'tile') {
        css += `background-size: auto; background-position: center; background-repeat: repeat;`;
      }
    } else {
      css += `background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Crect width='8' height='8' fill='%23222'/%3E%3Crect x='8' y='8' width='8' height='8' fill='%23222'/%3E%3Crect x='8' width='8' height='8' fill='%23181818'/%3E%3Crect y='8' width='8' height='8' fill='%23181818'/%3E%3C/svg%3E"); background-size: 16px 16px;`;
    }
  } else if ($config.type === 'preset') {
    const preset = PRESETS.find(p => p.id === $config.preset.id);
    if (preset && preset.style) {
      for (const [key, value] of Object.entries(preset.style)) {
        const cssKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();
        css += `${cssKey}: ${value};`;
      }
    }
  }
  return css;
});

export const customBgPatternStyle = derived(customBgConfig, ($config) => {
  if (!$config.enabled || !$config.pattern.enabled) return '';
  const { source, scale } = $config.pattern;
  const scaleFactor = scale / 100;
  
  let isDark = false;
  
  function checkHexDarkness(hex: string) {
    if (!hex) return false;
    let normalized = hex.replace('#', '');
    if (normalized.length === 3) {
      normalized = normalized.split('').map(c => c + c).join('');
    }
    const r = parseInt(normalized.slice(0, 2), 16) || 0;
    const g = parseInt(normalized.slice(2, 4), 16) || 0;
    const b = parseInt(normalized.slice(4, 6), 16) || 0;
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return luma < 128;
  }

  if ($config.type === 'solid') {
    isDark = checkHexDarkness($config.solid.hex);
  } else if ($config.type === 'gradient' && $config.gradient.stops.length > 0) {
    isDark = checkHexDarkness($config.gradient.stops[0].hex);
  } else if ($config.type === 'preset') {
    const preset = PRESETS.find(p => p.id === $config.preset.id);
    if (preset && preset.style?.background) {
      isDark = preset.style.background === '#020617' || preset.style.background === '#0f172a';
    }
  }

  const fgColor = isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)';
  const fgColorSubtle = isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)';
  
  let css = getPatternCSS(source as any, fgColor, fgColorSubtle, scaleFactor);
  css += `background-repeat: repeat;`;
  return css;
});

export const customBgFilter = derived(customBgConfig, ($config) => {
  if (!$config.enabled || $config.type !== 'image') return '';
  const { exposure, contrast, saturation, blur = 0 } = $config.image;
  return `filter: brightness(${exposure}%) contrast(${contrast}%) saturate(${saturation}%) blur(${blur / 10}px);`;
});

export const customBgOverlayStyle = derived(customBgConfig, ($config) => {
  if (!$config.enabled || $config.type !== 'image') return '';
  const { temperature = 100, tint = 100 } = $config.image;
  if (temperature === 100 && tint === 100) return '';
  
  let tR = 0, tG = 0, tB = 0, tOp = 0;
  if (temperature > 100) {
    tR = 255; tG = 130; tB = 0; // Warm
    tOp = (temperature - 100) / 400;
  } else if (temperature < 100) {
    tR = 0; tG = 120; tB = 255; // Cool
    tOp = (100 - temperature) / 400;
  }
  
  let tintR = 0, tintG = 0, tintB = 0, tintOp = 0;
  if (tint > 100) {
    tintR = 255; tintG = 0; tintB = 255; // Magenta
    tintOp = (tint - 100) / 400;
  } else if (tint < 100) {
    tintR = 0; tintG = 255; tintB = 0; // Green
    tintOp = (100 - tint) / 400;
  }
  
  const layers = [];
  if (tOp > 0) layers.push(`linear-gradient(rgba(${tR}, ${tG}, ${tB}, ${tOp}), rgba(${tR}, ${tG}, ${tB}, ${tOp}))`);
  if (tintOp > 0) layers.push(`linear-gradient(rgba(${tintR}, ${tintG}, ${tintB}, ${tintOp}), rgba(${tintR}, ${tintG}, ${tintB}, ${tintOp}))`);
  
  if (layers.length === 0) return '';
  
  return `background: ${layers.join(', ')}; mix-blend-mode: color;`;
});

export function getPatternCSS(source: CustomBgConfig['pattern']['source'], fgColor: string, fgColorSubtle: string, scaleFactor: number) {
  let css = '';
  if (source === 'dots') {
      css += `background-image: radial-gradient(${fgColor} ${1.5 * scaleFactor}px, transparent ${1.5 * scaleFactor}px); background-size: ${16 * scaleFactor}px ${16 * scaleFactor}px;`;
    } else if (source === 'grid') {
      css += `background-image: linear-gradient(${fgColor} ${1 * scaleFactor}px, transparent 1px), linear-gradient(90deg, ${fgColor} ${1 * scaleFactor}px, transparent 1px); background-size: ${16 * scaleFactor}px ${16 * scaleFactor}px;`;
    } else if (source === 'blueprint') {
      css += `background-image: linear-gradient(${fgColor} 1.5px, transparent 1.5px), linear-gradient(90deg, ${fgColor} 1.5px, transparent 1.5px), linear-gradient(${fgColorSubtle} 0.5px, transparent 0.5px), linear-gradient(90deg, ${fgColorSubtle} 0.5px, transparent 0.5px); background-size: ${80 * scaleFactor}px ${80 * scaleFactor}px, ${80 * scaleFactor}px ${80 * scaleFactor}px, ${16 * scaleFactor}px ${16 * scaleFactor}px, ${16 * scaleFactor}px ${16 * scaleFactor}px;`;

    } else if (source === 'top-fade-grid') {
      css += `background-image: linear-gradient(to right, ${fgColor} 1px, transparent 1px), linear-gradient(to bottom, ${fgColor} 1px, transparent 1px); background-size: ${20 * scaleFactor}px ${30 * scaleFactor}px; -webkit-mask-image: radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%); mask-image: radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%);`;
    } else if (source === 'bottom-fade-grid') {
      css += `background-image: linear-gradient(to right, ${fgColor} 1px, transparent 1px), linear-gradient(to bottom, ${fgColor} 1px, transparent 1px); background-size: ${20 * scaleFactor}px ${30 * scaleFactor}px; -webkit-mask-image: radial-gradient(ellipse 70% 60% at 50% 100%, #000 60%, transparent 100%); mask-image: radial-gradient(ellipse 70% 60% at 50% 100%, #000 60%, transparent 100%);`;
    } else if (source === 'diagonal-fade-grid-left') {
      css += `background-image: linear-gradient(to right, ${fgColor} 1px, transparent 1px), linear-gradient(to bottom, ${fgColor} 1px, transparent 1px); background-size: ${32 * scaleFactor}px ${32 * scaleFactor}px; -webkit-mask-image: radial-gradient(ellipse 80% 80% at 0% 0%, #000 50%, transparent 90%); mask-image: radial-gradient(ellipse 80% 80% at 0% 0%, #000 50%, transparent 90%);`;
    } else if (source === 'diagonal-fade-grid-right') {
      css += `background-image: linear-gradient(to right, ${fgColor} 1px, transparent 1px), linear-gradient(to bottom, ${fgColor} 1px, transparent 1px); background-size: ${32 * scaleFactor}px ${32 * scaleFactor}px; -webkit-mask-image: radial-gradient(ellipse 80% 80% at 100% 0%, #000 50%, transparent 90%); mask-image: radial-gradient(ellipse 80% 80% at 100% 0%, #000 50%, transparent 90%);`;
    } else if (source === 'diagonal-fade-bottom-grid-Left') {
      css += `background-image: linear-gradient(to right, ${fgColor} 1px, transparent 1px), linear-gradient(to bottom, ${fgColor} 1px, transparent 1px); background-size: ${32 * scaleFactor}px ${32 * scaleFactor}px; -webkit-mask-image: radial-gradient(ellipse 80% 80% at 0% 100%, #000 50%, transparent 90%); mask-image: radial-gradient(ellipse 80% 80% at 0% 100%, #000 50%, transparent 90%);`;
    } else if (source === 'diagonal-fade-bottom-grid-right') {
      css += `background-image: linear-gradient(to right, ${fgColor} 1px, transparent 1px), linear-gradient(to bottom, ${fgColor} 1px, transparent 1px); background-size: ${32 * scaleFactor}px ${32 * scaleFactor}px; -webkit-mask-image: radial-gradient(ellipse 80% 80% at 100% 100%, #000 50%, transparent 90%); mask-image: radial-gradient(ellipse 80% 80% at 100% 100%, #000 50%, transparent 90%);`;
    } else if (source === 'diagonal-fade-center-grid') {
      css += `background-image: linear-gradient(to right, ${fgColor} 1px, transparent 1px), linear-gradient(to bottom, ${fgColor} 1px, transparent 1px); background-size: ${32 * scaleFactor}px ${32 * scaleFactor}px; -webkit-mask-image: radial-gradient(ellipse 60% 60% at 50% 50%, #000 30%, transparent 70%); mask-image: radial-gradient(ellipse 60% 60% at 50% 50%, #000 30%, transparent 70%);`;
    } else if (source === 'diagonal-cross-grid') {
      css += `background-image: linear-gradient(45deg, transparent 49%, ${fgColor} 49%, ${fgColor} 51%, transparent 51%), linear-gradient(-45deg, transparent 49%, ${fgColor} 49%, ${fgColor} 51%, transparent 51%); background-size: ${40 * scaleFactor}px ${40 * scaleFactor}px;`;
    } else if (source === 'diagonal-cross-grid-top') {
      css += `background-image: linear-gradient(45deg, transparent 49%, ${fgColor} 49%, ${fgColor} 51%, transparent 51%), linear-gradient(-45deg, transparent 49%, ${fgColor} 49%, ${fgColor} 51%, transparent 51%); background-size: ${40 * scaleFactor}px ${40 * scaleFactor}px; -webkit-mask-image: radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%); mask-image: radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%);`;
    } else if (source === 'diagonal-cross-grid-bottom') {
      css += `background-image: linear-gradient(45deg, transparent 49%, ${fgColor} 49%, ${fgColor} 51%, transparent 51%), linear-gradient(-45deg, transparent 49%, ${fgColor} 49%, ${fgColor} 51%, transparent 51%); background-size: ${40 * scaleFactor}px ${40 * scaleFactor}px; -webkit-mask-image: radial-gradient(ellipse 100% 80% at 50% 100%, #000 50%, transparent 90%); mask-image: radial-gradient(ellipse 100% 80% at 50% 100%, #000 50%, transparent 90%);`;
    } else if (source === 'diagonal-cross-top-right-fade-grid') {
      css += `background-image: linear-gradient(45deg, transparent 49%, ${fgColor} 49%, ${fgColor} 51%, transparent 51%), linear-gradient(-45deg, transparent 49%, ${fgColor} 49%, ${fgColor} 51%, transparent 51%); background-size: ${40 * scaleFactor}px ${40 * scaleFactor}px; -webkit-mask-image: radial-gradient(ellipse 80% 80% at 0% 0%, #000 50%, transparent 90%); mask-image: radial-gradient(ellipse 80% 80% at 0% 0%, #000 50%, transparent 90%);`;
    } else if (source === 'diagonal-cross-top-left-fade-grid') {
      css += `background-image: linear-gradient(45deg, transparent 49%, ${fgColor} 49%, ${fgColor} 51%, transparent 51%), linear-gradient(-45deg, transparent 49%, ${fgColor} 49%, ${fgColor} 51%, transparent 51%); background-size: ${40 * scaleFactor}px ${40 * scaleFactor}px; -webkit-mask-image: radial-gradient(ellipse 80% 80% at 100% 0%, #000 50%, transparent 90%); mask-image: radial-gradient(ellipse 80% 80% at 100% 0%, #000 50%, transparent 90%);`;
    } else if (source === 'diagonal-cross-Bottom-right-fade-grid') {
      css += `background-image: linear-gradient(45deg, transparent 49%, ${fgColor} 49%, ${fgColor} 51%, transparent 51%), linear-gradient(-45deg, transparent 49%, ${fgColor} 49%, ${fgColor} 51%, transparent 51%); background-size: ${40 * scaleFactor}px ${40 * scaleFactor}px; -webkit-mask-image: radial-gradient(ellipse 80% 80% at 0% 100%, #000 50%, transparent 90%); mask-image: radial-gradient(ellipse 80% 80% at 0% 100%, #000 50%, transparent 90%);`;
    } else if (source === 'diagonal-cross-Bottom-left-fade-grid') {
      css += `background-image: linear-gradient(45deg, transparent 49%, ${fgColor} 49%, ${fgColor} 51%, transparent 51%), linear-gradient(-45deg, transparent 49%, ${fgColor} 49%, ${fgColor} 51%, transparent 51%); background-size: ${40 * scaleFactor}px ${40 * scaleFactor}px; -webkit-mask-image: radial-gradient(ellipse 80% 80% at 100% 100%, #000 50%, transparent 90%); mask-image: radial-gradient(ellipse 80% 80% at 100% 100%, #000 50%, transparent 90%);`;
    } else if (source === 'diagonal-cross-center-fade-grid') {
      css += `background-image: linear-gradient(45deg, transparent 49%, ${fgColor} 49%, ${fgColor} 51%, transparent 51%), linear-gradient(-45deg, transparent 49%, ${fgColor} 49%, ${fgColor} 51%, transparent 51%); background-size: ${40 * scaleFactor}px ${40 * scaleFactor}px; -webkit-mask-image: radial-gradient(ellipse 60% 60% at 50% 50%, #000 30%, transparent 70%); mask-image: radial-gradient(ellipse 60% 60% at 50% 50%, #000 30%, transparent 70%);`;
    } else if (source === 'dashed-grid-light') {
      css += `background-image: linear-gradient(to right, ${fgColor} 1px, transparent 1px), linear-gradient(to bottom, ${fgColor} 1px, transparent 1px); background-size: ${20 * scaleFactor}px ${20 * scaleFactor}px; background-position: 0 0, 0 0; -webkit-mask-image: repeating-linear-gradient( to right, black 0px, black 3px, transparent 3px, transparent 8px ), repeating-linear-gradient( to bottom, black 0px, black 3px, transparent 3px, transparent 8px ); mask-image: repeating-linear-gradient( to right, black 0px, black 3px, transparent 3px, transparent 8px ), repeating-linear-gradient( to bottom, black 0px, black 3px, transparent 3px, transparent 8px ); -webkit-mask-composite: source-in; mask-composite: intersect;`;
    } else if (source === 'dashed-top-fade-grid') {
      css += `background-image: linear-gradient(to right, ${fgColor} 1px, transparent 1px), linear-gradient(to bottom, ${fgColor} 1px, transparent 1px); background-size: ${20 * scaleFactor}px ${20 * scaleFactor}px; background-position: 0 0, 0 0; -webkit-mask-image: repeating-linear-gradient( to right, black 0px, black 3px, transparent 3px, transparent 8px ), repeating-linear-gradient( to bottom, black 0px, black 3px, transparent 3px, transparent 8px ), radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%); mask-image: repeating-linear-gradient( to right, black 0px, black 3px, transparent 3px, transparent 8px ), repeating-linear-gradient( to bottom, black 0px, black 3px, transparent 3px, transparent 8px ), radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%); -webkit-mask-composite: source-in; mask-composite: intersect;`;
    } else if (source === 'dashed-bottom-fade-grid') {
      css += `background-image: linear-gradient(to right, ${fgColor} 1px, transparent 1px), linear-gradient(to bottom, ${fgColor} 1px, transparent 1px); background-size: ${20 * scaleFactor}px ${20 * scaleFactor}px; background-position: 0 0, 0 0; -webkit-mask-image: repeating-linear-gradient( to right, black 0px, black 3px, transparent 3px, transparent 8px ), repeating-linear-gradient( to bottom, black 0px, black 3px, transparent 3px, transparent 8px ), radial-gradient(ellipse 100% 80% at 50% 100%, #000 50%, transparent 90%); mask-image: repeating-linear-gradient( to right, black 0px, black 3px, transparent 3px, transparent 8px ), repeating-linear-gradient( to bottom, black 0px, black 3px, transparent 3px, transparent 8px ), radial-gradient(ellipse 100% 80% at 50% 100%, #000 50%, transparent 90%); -webkit-mask-composite: source-in; mask-composite: intersect;`;
    }
    
      return css;
}
