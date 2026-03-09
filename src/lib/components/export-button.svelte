
<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  import {
    exportToPng,
    exportToSvg,
    copyToClipboard,
    isPngClipboardSupported
  } from '$lib/utils/export'
  import { quoteText, authorName } from '$lib/stores/quote'
  import { selectedThemeId, copyShareableUrl } from '$lib/stores'
  import { get } from 'svelte/store'
  import { browser } from '$app/environment'

  export let frameRef: HTMLDivElement | null = null
  export const variant: 'default' | 'navbar' = 'default'

  const dispatch = createEventDispatcher<{
    toast: { message: string; type?: 'success' | 'error' }
  }>()

  let isExporting = false
  let showDropdown = false

  $: clipboardSupported = browser && isPngClipboardSupported()

  function getFilename(): string {
    const author = get(authorName)
    if (author) {
      return `quote-${author.toLowerCase().replace(/\s+/g, '-')}`
    }
    return 'quote-serifsh'
  }

  // Track export in backend
  async function trackExport(exportType: 'png' | 'svg' | 'clipboard' | 'url') {
    try {
      const url = browser ? window.location.href : ''
      await fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url,
          exportType,
          quote: get(quoteText).slice(0, 100), // First 100 chars
          author: get(authorName),
          themeId: get(selectedThemeId),
          timestamp: Date.now()
        })
      })
    } catch (e) {
      // Silently fail - don't block export
      console.error('Failed to track export:', e)
    }
  }

  async function handleExportPng() {
    if (!frameRef || isExporting) return
    isExporting = true
    showDropdown = false

    try {
      dispatch('toast', { message: 'Exporting PNG...' })
      await exportToPng(frameRef, getFilename())
      trackExport('png')
      dispatch('toast', { message: 'PNG exported!', type: 'success' })
    } catch (error) {
      console.error('Export failed:', error)
      dispatch('toast', { message: 'Export failed', type: 'error' })
    } finally {
      isExporting = false
    }
  }

  async function handleExportSvg() {
    if (!frameRef || isExporting) return
    isExporting = true
    showDropdown = false

    try {
      dispatch('toast', { message: 'Exporting SVG...' })
      await exportToSvg(frameRef, getFilename())
      trackExport('svg')
      dispatch('toast', { message: 'SVG exported!', type: 'success' })
    } catch (error) {
      console.error('Export failed:', error)
      dispatch('toast', { message: 'Export failed', type: 'error' })
    } finally {
      isExporting = false
    }
  }

  async function handleCopyToClipboard() {
    if (!frameRef || isExporting) return
    isExporting = true
    showDropdown = false

    try {
      dispatch('toast', { message: 'Copying to clipboard...' })
      await copyToClipboard(frameRef)
      trackExport('clipboard')
      dispatch('toast', { message: 'Copied to clipboard!', type: 'success' })
    } catch (error) {
      console.error('Copy failed:', error)
      dispatch('toast', { message: 'Copy failed', type: 'error' })
    } finally {
      isExporting = false
    }
  }

  async function handleCopyUrl() {
    showDropdown = false

    try {
      const url = copyShareableUrl()
      await navigator.clipboard.writeText(url)
      trackExport('url')
      dispatch('toast', { message: 'URL copied to clipboard!', type: 'success' })
    } catch (error) {
      console.error('Copy URL failed:', error)
      dispatch('toast', { message: 'Failed to copy URL', type: 'error' })
    }
  }

  function handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement
    if (!target.closest('.export-dropdown')) {
      showDropdown = false
    }
  }
</script>

<svelte:window on:click={handleClickOutside} />

<div class="relative export-dropdown">
  <button
    class="inline-flex items-center h-[30px] rounded-lg overflow-hidden text-sm font-medium bg-parchment-200/50 hover:bg-parchment-200 transition-opacity duration-150 disabled:opacity-50 cursor-pointer shadow-custom"
    on:click|stopPropagation={() => (showDropdown = !showDropdown)}
    disabled={isExporting}
    aria-label="Export options"
    aria-expanded={showDropdown}
  >
    <span class="flex items-center gap-1.5 px-3 h-full">
      {#if isExporting}
        <svg class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="3"
          />
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      {:else}
        <svg
          class="w-3.5 h-3.5 opacity-80"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          viewBox="0 0 24 24"
        >
          <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      {/if}
      <span>{isExporting ? 'Exporting…' : 'Export'}</span>
    </span>
    <span class="w-px h-[30px] bg-parchment-300 shrink-0"></span>
    <span class="flex items-center px-2 h-full">
      <svg
        class="w-3 h-3 opacity-70 transition-transform duration-150 {showDropdown
          ? 'rotate-180'
          : ''}"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        viewBox="0 0 24 24"
      >
        <path d="M19 9l-7 7-7-7" />
      </svg>
    </span>
  </button>

  {#snippet menuIcon(children: import('svelte').Snippet)}
    <svg
      class="w-4 h-4 opacity-50 group-hover:opacity-100 shrink-0 transition-opacity duration-150"
      fill="none"
      stroke="currentColor"
      stroke-width="1.75"
      stroke-linecap="round"
      stroke-linejoin="round"
      viewBox="0 0 24 24"
    >{@render children()}</svg>
  {/snippet}

  {#if showDropdown}
    {@const itemClass = "group w-full px-2 py-1.5 text-left text-[13px] text-ink-800 hover:text-ink-950 hover:bg-parchment-100 rounded-lg h-9 flex items-center gap-2 transition-colors duration-150"}
    <div
      class="export-dropdown--open absolute right-0 top-full mt-1.5 w-48 p-1 rounded-xl z-50
        bg-parchment-50 border border-black/10 shadow-xs"
    >
      <button class={itemClass} on:click={handleExportPng}>
        {@render menuIcon(pngIcon)}
        Save as PNG
      </button>
      <button class={itemClass} on:click={handleExportSvg}>
        {@render menuIcon(svgIcon)}
        Save as SVG
      </button>
      {#if clipboardSupported}
        <button class={itemClass} on:click={handleCopyToClipboard}>
          {@render menuIcon(copyIcon)}
          Copy Image
        </button>
      {/if}
      <div class="my-1 -mx-1 h-px bg-black/10"></div>
      <button class={itemClass} on:click={handleCopyUrl}>
        {@render menuIcon(linkIcon)}
        Copy URL
      </button>
    </div>
  {/if}

  {#snippet pngIcon()}
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <path d="M21 15l-5-5L5 21" />
  {/snippet}

  {#snippet svgIcon()}
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  {/snippet}

  {#snippet copyIcon()}
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
  {/snippet}

  {#snippet linkIcon()}
    <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
  {/snippet}
</div>
