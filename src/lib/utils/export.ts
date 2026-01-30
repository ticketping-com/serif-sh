import { toPng, toSvg, toBlob } from 'html-to-image';

const imageFilter = (node: HTMLElement) => {
  return !node.dataset?.ignoreInExport;
};

const defaultOptions = {
  filter: imageFilter,
  pixelRatio: 2,
  skipAutoScale: true,
};

export async function exportToPng(node: HTMLElement, filename: string = 'quote'): Promise<void> {
  // Double render to fix occasional issues
  await toPng(node, defaultOptions);
  const dataUrl = await toPng(node, defaultOptions);

  const link = document.createElement('a');
  link.download = `${filename}.png`;
  link.href = dataUrl;
  link.click();
}

export async function exportToSvg(node: HTMLElement, filename: string = 'quote'): Promise<void> {
  const dataUrl = await toSvg(node, defaultOptions);

  const link = document.createElement('a');
  link.download = `${filename}.svg`;
  link.href = dataUrl;
  link.click();
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
