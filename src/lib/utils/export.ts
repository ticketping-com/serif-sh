import { toSvg, toBlob } from 'html-to-image';

const imageFilter = (node: HTMLElement) => {
  return !node.dataset?.ignoreInExport;
};

// Embedding fonts is required for self-hosted faces (Instrument Serif / Peerlist). skipFonts
// disables all @font-face inlining and was reverted after it broke exports.
const defaultOptions = {
  filter: imageFilter,
  pixelRatio: 2,
  skipAutoScale: true,
  // Optimization: use cache to avoid re-calculating styles if possible
  cacheBust: false,
};

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = filename;
  link.href = url;
  link.rel = 'noopener';
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  
  // Clean-up to prevent memory leaks
  setTimeout(() => {
    if (link.parentNode) {
      document.body.removeChild(link);
    }
    URL.revokeObjectURL(url);
  }, 200);
}

export async function exportToPng(node: HTMLElement, filename: string = 'quote'): Promise<void> {
  // Wait for fonts to be ready (Lightweight & Reliable)
  if (typeof document !== 'undefined') {
    await document.fonts.ready;
  }
  
  const blob = await toBlob(node, defaultOptions);
  
  if (!blob) {
    throw new Error('Failed to create image blob');
  }

  triggerDownload(blob, `${filename}.png`);
}

export async function exportToSvg(node: HTMLElement, filename: string = 'quote'): Promise<void> {
  if (typeof document !== 'undefined') {
    await document.fonts.ready;
  }
  
  const dataUrl = await toSvg(node, defaultOptions);
  
  const response = await fetch(dataUrl);
  const blob = await response.blob();

  triggerDownload(blob, `${filename}.svg`);
}

export async function copyToClipboard(node: HTMLElement): Promise<void> {
  if (typeof document !== 'undefined') {
    await document.fonts.ready;
  }
  const blob = await toBlob(node, defaultOptions);

  if (!blob) {
    throw new Error('Failed to create image blob');
  }

  const clipboardItem = new ClipboardItem({
    'image/png': blob,
  });

  await navigator.clipboard.write([clipboardItem]);
}

export function isPngClipboardSupported(): boolean {
  return typeof ClipboardItem !== 'undefined' && typeof navigator.clipboard?.write === 'function';
}

/**
 * Exports the node at exact target dimensions by temporarily padding it 
 * to match the target aspect ratio, ensuring no content is clipped and 
 * text does not reflow.
 */
export async function exportToPlatformSize(
  node: HTMLElement,
  filename: string = 'quote',
  targetW: number,
  targetH: number
): Promise<void> {
  if (typeof document !== 'undefined') {
    await document.fonts.ready;
  }

  const currW = node.offsetWidth;
  const currH = node.offsetHeight;
  
  if (!currW || !currH) throw new Error('Element has no dimensions');

  const targetR = targetW / targetH;
  const currR = currW / currH;

  let newW = currW;
  let newH = currH;

  if (currR > targetR) {
    newH = currW / targetR;
  } else {
    newW = currH * targetR;
  }

  // Save original inline styles
  const originalFrameStyle = node.getAttribute('style') || '';
  const quoteContent = node.querySelector('.quote-content') as HTMLElement;
  const originalContentStyle = quoteContent?.getAttribute('style') || '';

  try {
    if (quoteContent) {
      quoteContent.style.width = quoteContent.offsetWidth + 'px';
      quoteContent.style.height = quoteContent.offsetHeight + 'px';
      quoteContent.style.maxWidth = 'none';
      quoteContent.style.flex = 'none';
    }

    // Apply the padded dimensions to the frame
    node.style.width = newW + 'px';
    node.style.height = newH + 'px';
    node.style.display = 'flex';
    node.style.alignItems = 'center';
    node.style.justifyContent = 'center';
    node.style.transition = 'none';

    const pixelRatio = targetW / newW;

    const blob = await toBlob(node, {
      ...defaultOptions,
      pixelRatio,
      cacheBust: true, // Must bypass cache since we modified DOM styles
    });

    if (!blob) throw new Error('Failed to create image blob');
    triggerDownload(blob, `${filename}.png`);

  } finally {
    // Always restore the original DOM state
    node.setAttribute('style', originalFrameStyle);
    if (quoteContent) {
      quoteContent.setAttribute('style', originalContentStyle);
    }
  }
}
