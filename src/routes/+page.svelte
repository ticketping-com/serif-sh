<script lang="ts">
  import { get } from 'svelte/store'
  import QuoteFrame from '$lib/components/quote-frame.svelte'
  import ThemeSelector from '$lib/components/theme-selector.svelte'
  import AlignmentControl from '$lib/components/alignment-control.svelte'
  import PaddingControl from '$lib/components/padding-control.svelte'
  import FontSelector from '$lib/components/font-selector.svelte'
  import ToggleControl from '$lib/components/toggle-control.svelte'
  import ExportButton from '$lib/components/export-button.svelte'
  import Toast from '$lib/components/toast.svelte'
  import ResizableFrame from '$lib/components/resizable-frame.svelte'
  import AboutModal from '$lib/components/about-modal.svelte'
  import SerifshLogo from '$lib/components/icons/serifsh-logo.svelte'
  import { showQuoteMarks, selectedThemeId, showBrandLogo } from '$lib/stores'

  let aboutOpen = false

  let frameRef: HTMLDivElement | null = null
  let toast: { message: string; type?: 'success' | 'error' } | null = null

  function handleToast(event: CustomEvent<{ message: string; type?: 'success' | 'error' }>) {
    toast = event.detail
  }

  function clearToast() {
    toast = null
  }

  //Pseudo-Store for Light/Dark toggling
  // but it actually just rewrites the selectedThemeId!
  const isDarkMode = {
    subscribe: (cb: (value: boolean) => void) => {
      return selectedThemeId.subscribe((id) => cb(id.endsWith('-dark')))
    },
    update: (fn: (value: boolean) => boolean) => {
      const current = get(selectedThemeId)
      const nextDark = fn(current.endsWith('-dark'))
      const base = current.split('-')[0]
      selectedThemeId.set(`${base}-${nextDark ? 'dark' : 'light'}`)
    },
    set: (value: boolean) => {
      const current = get(selectedThemeId)
      const base = current.split('-')[0]
      selectedThemeId.set(`${base}-${value ? 'dark' : 'light'}`)
    }
  }

  $: isBrandTheme = $selectedThemeId.includes('vercel') || $selectedThemeId.includes('peerlist')
</script>

<svelte:head>
  <title>Serifsh — Beautiful Quote Snapshots</title>
  <meta
    name="description"
    content="Create beautiful, shareable images of your favorite quotes. Choose from elegant serif-styled themes."
  />
</svelte:head>

<div class="grid w-full min-h-screen grid-rows-[auto_1fr_auto]">
  <!-- Header -->
  <header class="">
    <div class="mx-auto py-3 px-4 flex items-center justify-between">
      <div class="flex flex-row gap-3 items-center">
        <h1 class="sr-only">serif.sh</h1>
        <div class="flex items-center h-6 [&>svg]:h-full [&>svg]:w-auto">
          <SerifshLogo />
        </div>
      </div>
      <div class="flex items-center gap-2">
        <button
          class="flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-800 transition-colors cursor-pointer px-2 py-1 rounded-lg hover:bg-parchment-200"
          on:click={() => (aboutOpen = true)}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 16v-4"/>
            <path d="M12 8h.01"/>
          </svg>
          About
        </button>
        <ExportButton {frameRef} variant="navbar" on:toast={handleToast} />
      </div>
    </div>
  </header>

  <!-- Main content - Frame area -->
  <main class="flex items-center justify-center p-4 pt-8 pb-30">
    <div class="flex flex-col items-center w-full">
      <ResizableFrame>
        {#snippet children()}
          <div class="overflow-hidden bg-black/20">
            <QuoteFrame bind:frameRef editable={true} />
          </div>
        {/snippet}
      </ResizableFrame>
    </div>
  </main>

  <!-- Bottom Controls Bar -->
  <div class="fixed bottom-0 left-0 right-0 z-50 flex justify-center px-4 pb-4 pointer-events-none">
    <div
      class="flex items-center gap-4 md:gap-6 py-3 md:py-4 px-4 md:px-6 bg-white/95 border border-black/10 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.15)] backdrop-blur-xl pointer-events-auto overflow-visible max-w-full"
    >
      <ThemeSelector />
      <FontSelector />
      <AlignmentControl />
      <PaddingControl />
      <ToggleControl store={showQuoteMarks} label="Quotes" />

      {#if isBrandTheme}
        <div class="w-px h-8 bg-black/10 mx-1"></div>

        <ToggleControl store={isDarkMode} label="Dark Mode" />
        <ToggleControl store={showBrandLogo} label="Logo" />
      {/if}
    </div>
  </div>
</div>

{#if toast}
  <Toast message={toast.message} type={toast.type || 'info'} onClose={clearToast} />
{/if}

<AboutModal bind:open={aboutOpen} />
