<script lang="ts">
  import { get } from 'svelte/store'
  import { quintOut, quintIn } from 'svelte/easing'

  function slideX(
    node: Element,
    {
      duration = 250,
      easing: easingFn = quintOut
    }: { duration?: number; easing?: (t: number) => number } = {}
  ) {
    const width = node.getBoundingClientRect().width
    return {
      duration,
      easing: easingFn,
      css: (t: number) => `
        max-width: ${t * width}px;
        opacity: ${t};
        overflow: hidden;
        filter: blur(${(1 - t) * 6}px);
      `
    }
  }
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
  import SerifshLogoMark from '$lib/components/icons/serifsh-logo-mark.svelte'
  import SerifshWordmark from '$lib/components/icons/serifsh-wordmark.svelte'
  import { showQuoteMarks, selectedThemeId, showBrandLogo, showXVerifiedBadge } from '$lib/stores'
  import TicketpingLogoMark from '$lib/components/icons/ticketping-logo-mark.svelte'
  import TicketpingWordmark from '$lib/components/icons/ticketping-wordmark.svelte'

  let aboutOpen = false

  let frameRef: HTMLDivElement | null = null
  let toast: { message: string; type?: 'success' | 'error' } | null = null

  $: toastProps = toast
    ? { message: toast.message, type: (toast.type ?? 'info') as 'success' | 'error' | 'info' }
    : null

  function handleToast(detail: { message: string; type?: 'success' | 'error' }) {
    toast = detail
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

  $: isBrandTheme =
    $selectedThemeId.includes('vercel') ||
    $selectedThemeId.includes('peerlist') ||
    $selectedThemeId.includes('x')
</script>

<svelte:head>
  <title>serif.sh — Beautiful Quote Snapshots</title>
  <meta
    name="description"
    content="Create beautiful, shareable images of your favorite quotes. Choose from elegant serif-styled themes."
  />
</svelte:head>

<div class="grid w-full min-h-screen grid-rows-[auto_1fr_auto]">
  <!-- Header -->
  <header
    class="bg-parchment-50/10 border-b border-b-white/10 backdrop-filter backdrop-blur-sm shadow-sm h-[50px] px-4 py-2 z-20 w-full sticky top-0"
  >
    <div class="mx-auto flex items-center justify-between">
      <div class="flex flex-row gap-3 items-center">
        <h1 class="sr-only">serif.sh</h1>
        <div
          class="inline-flex shrink-0 items-center justify-center whitespace-nowrap h-[30px] gap-2 px-3 pl-1 pr-2 py-1"
        >
          <SerifshLogoMark class="h-6 w-6" />
          <SerifshWordmark class="h-4 w-auto -translate-y-[2px]" />
        </div>
        <div class="-ml-2 flex items-center relative z-10 gap-[4px]">
          <span class="text-sm opacity-50">by </span>
          <a
            href="https://ticketping.com"
            class="inline-flex shrink-0 items-center justify-center whitespace-nowrap overflow-hidden h-[30px] gap-1.5 no-underline text-inherit px-3 pl-[8px]"
            aria-label="Ticketping"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div class="border border-black/10 rounded-full flex items-center justify-center">
              <TicketpingLogoMark class="w-5 h-5" />
            </div>
            <TicketpingWordmark class="hidden sm:block h-4 w-auto mt-px pt-px" />
          </a>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <button
          class="flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-ink-800 transition-all duration-150 cursor-pointer px-3 h-[30px] rounded-lg hover:bg-parchment-200 hover:shadow-custom"
          on:click={() => (aboutOpen = true)}
        >
          <svg
            aria-hidden="true"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.75"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
          </svg>
          <span class="hidden sm:inline">About</span>
        </button>
        <ExportButton {frameRef} variant="navbar" onToast={handleToast} />
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
  <div
    class="fixed bottom-0 left-0 right-0 z-50 flex justify-center px-2 pb-2 sm:px-4 sm:pb-4 pointer-events-none"
  >
    <div
      class="flex items-center gap-2 sm:gap-4 md:gap-6 py-3 md:py-4 px-3 sm:px-4 md:px-6 bg-white rounded-2xl border-shadow hover:border-shadow-hover transition-shadow duration-150 pointer-events-auto overflow-x-auto md:overflow-visible scrollbar-none max-w-full"
    >
      <ThemeSelector />
      <FontSelector />
      <AlignmentControl />
      <PaddingControl />
      <ToggleControl store={showQuoteMarks} label="Quotes" />

      {#if isBrandTheme}
        <div
          class="flex items-center gap-2 sm:gap-4 md:gap-6"
          in:slideX={{ duration: 250, easing: quintOut }}
          out:slideX={{ duration: 200, easing: quintIn }}
        >
          <div class="w-px h-12 bg-black/10 rounded-full shrink-0"></div>
          <ToggleControl store={showBrandLogo} label="Logo" />
          {#if $selectedThemeId.includes('x')}
            <ToggleControl store={showXVerifiedBadge} label="Verified" />
          {/if}
          <ToggleControl store={isDarkMode} label="Dark Mode" />
        </div>
      {/if}
    </div>
  </div>
</div>

{#if toastProps}
  <Toast message={toastProps.message} type={toastProps.type} onClose={clearToast} />
{/if}

<AboutModal bind:open={aboutOpen} />
