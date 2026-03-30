import { toPng, toSvg, toBlob } from 'html-to-image';

const imageFilter = (node: HTMLElement) => {
  return !node.dataset?.ignoreInExport;
};

// Embedding fonts is required for self-hosted faces (Instrument Serif / Peerlist). skipFonts
// disables all @font-face inlining and was reverted after it broke exports.
const defaultOptions = {
  filter: imageFilter,
  pixelRatio: 2,
  skipAutoScale: true,
};

function triggerDownload(href: string, filename: string) {
  const link = document.createElement('a');
  link.download = filename;
  link.href = href;
  link.rel = 'noopener';
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  requestAnimationFrame(() => {
    link.remove();
  });
}

export async function exportToPng(node: HTMLElement, filename: string = 'quote'): Promise<void> {
  // Double render to fix occasional issues
  await toPng(node, defaultOptions);
  const dataUrl = await toPng(node, defaultOptions);

  triggerDownload(dataUrl, `${filename}.png`);
}

export async function exportToSvg(node: HTMLElement, filename: string = 'quote'): Promise<void> {
  const dataUrl = await toSvg(node, defaultOptions);

  triggerDownload(dataUrl, `${filename}.svg`);
}

export async function copyToClipboard(node: HTMLElement): Promise<void> {
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
