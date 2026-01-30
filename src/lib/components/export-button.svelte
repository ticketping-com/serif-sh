<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { exportToPng, exportToSvg, copyToClipboard, isPngClipboardSupported } from '$lib/utils/export';
  import { quoteText, authorName } from '$lib/stores/quote';
  import { selectedThemeId, darkMode, alignment, padding, currentFont, copyShareableUrl } from '$lib/stores';
  import { get } from 'svelte/store';
  import { browser } from '$app/environment';

  export let frameRef: HTMLDivElement | null = null;
  export let variant: 'default' | 'navbar' = 'default';

  const dispatch = createEventDispatcher<{
    toast: { message: string; type?: 'success' | 'error' };
  }>();

  let isExporting = false;
  let showDropdown = false;

  $: clipboardSupported = browser && isPngClipboardSupported();

  function getFilename(): string {
    const author = get(authorName);
    if (author) {
      return `quote-${author.toLowerCase().replace(/\s+/g, '-')}`;
    }
    return 'quote-serifsh';
  }

  // Track export in backend
  async function trackExport(exportType: 'png' | 'svg' | 'clipboard' | 'url') {
    try {
      const url = browser ? window.location.href : '';
      await fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url,
          exportType,
          quote: get(quoteText).slice(0, 100), // First 100 chars
          author: get(authorName),
          themeId: get(selectedThemeId),
          darkMode: get(darkMode),
          timestamp: Date.now(),
        }),
      });
    } catch (e) {
      // Silently fail - don't block export
      console.error('Failed to track export:', e);
    }
  }

  async function handleExportPng() {
    if (!frameRef || isExporting) return;
    isExporting = true;
    showDropdown = false;

    try {
      dispatch('toast', { message: 'Exporting PNG...' });
      await exportToPng(frameRef, getFilename());
      trackExport('png');
      dispatch('toast', { message: 'PNG exported!', type: 'success' });
    } catch (error) {
      console.error('Export failed:', error);
      dispatch('toast', { message: 'Export failed', type: 'error' });
    } finally {
      isExporting = false;
    }
  }

  async function handleExportSvg() {
    if (!frameRef || isExporting) return;
    isExporting = true;
    showDropdown = false;

    try {
      dispatch('toast', { message: 'Exporting SVG...' });
      await exportToSvg(frameRef, getFilename());
      trackExport('svg');
      dispatch('toast', { message: 'SVG exported!', type: 'success' });
    } catch (error) {
      console.error('Export failed:', error);
      dispatch('toast', { message: 'Export failed', type: 'error' });
    } finally {
      isExporting = false;
    }
  }

  async function handleCopyToClipboard() {
    if (!frameRef || isExporting) return;
    isExporting = true;
    showDropdown = false;

    try {
      dispatch('toast', { message: 'Copying to clipboard...' });
      await copyToClipboard(frameRef);
      trackExport('clipboard');
      dispatch('toast', { message: 'Copied to clipboard!', type: 'success' });
    } catch (error) {
      console.error('Copy failed:', error);
      dispatch('toast', { message: 'Copy failed', type: 'error' });
    } finally {
      isExporting = false;
    }
  }

  async function handleCopyUrl() {
    showDropdown = false;

    try {
      const url = copyShareableUrl();
      await navigator.clipboard.writeText(url);
      trackExport('url');
      dispatch('toast', { message: 'URL copied to clipboard!', type: 'success' });
    } catch (error) {
      console.error('Copy URL failed:', error);
      dispatch('toast', { message: 'Failed to copy URL', type: 'error' });
    }
  }

  function handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.export-dropdown')) {
      showDropdown = false;
    }
  }
</script>

<svelte:window on:click={handleClickOutside} />

<div class="relative export-dropdown">
  <button
    class="flex items-center gap-2 h-8 px-3 bg-parchment-100/80 dark:bg-white/10 border border-parchment-300/50 dark:border-white/10 rounded-lg cursor-pointer transition-all duration-150 hover:bg-parchment-200/80 dark:hover:bg-white/15 text-sm font-medium"
    on:click|stopPropagation={() => showDropdown = !showDropdown}
    disabled={isExporting}
    aria-label="Export options"
  >
    <svg class="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
    <span>Export</span>
    <svg class="w-3.5 h-3.5 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
    </svg>
  </button>

  {#if showDropdown}
    <div
      class="absolute right-0 top-full mt-1 w-44 py-1.5 rounded-xl shadow-lg z-50 backdrop-blur-xl
        bg-white/95 dark:bg-zinc-900/95 border border-black/10 dark:border-white/10"
    >
      <button
        class="w-full px-3 py-2 text-left text-[13px] hover:bg-black/5 dark:hover:bg-white/10
          flex items-center gap-2.5 transition-colors"
        on:click={handleExportPng}
      >
        <svg class="w-4 h-4 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Save as PNG
      </button>
      <button
        class="w-full px-3 py-2 text-left text-[13px] hover:bg-black/5 dark:hover:bg-white/10
          flex items-center gap-2.5 transition-colors"
        on:click={handleExportSvg}
      >
        <svg class="w-4 h-4 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
        Save as SVG
      </button>
      {#if clipboardSupported}
        <button
          class="w-full px-3 py-2 text-left text-[13px] hover:bg-black/5 dark:hover:bg-white/10
            flex items-center gap-2.5 transition-colors"
          on:click={handleCopyToClipboard}
        >
          <svg class="w-4 h-4 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
          </svg>
          Copy Image
        </button>
      {/if}
      <div class="my-1 mx-2 border-t border-black/10 dark:border-white/10"></div>
      <button
        class="w-full px-3 py-2 text-left text-[13px] hover:bg-black/5 dark:hover:bg-white/10
          flex items-center gap-2.5 transition-colors"
        on:click={handleCopyUrl}
      >
        <svg class="w-4 h-4 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
        Copy URL
      </button>
    </div>
  {/if}
</div>
