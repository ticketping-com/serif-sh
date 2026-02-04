<script lang="ts">
  import QuoteFrame from '$lib/components/quote-frame.svelte';
  import ThemeSelector from '$lib/components/theme-selector.svelte';
  import AlignmentControl from '$lib/components/alignment-control.svelte';
  import PaddingControl from '$lib/components/padding-control.svelte';
  import FontSelector from '$lib/components/font-selector.svelte';
  import ToggleControl from '$lib/components/toggle-control.svelte';
  import ExportButton from '$lib/components/export-button.svelte';
  import Toast from '$lib/components/toast.svelte';
  import ResizableFrame from '$lib/components/resizable-frame.svelte';
  import SerifshLogo from '$lib/components/icons/serifsh-logo.svelte';
  import { showQuoteMarks } from '$lib/stores';

  let frameRef: HTMLDivElement | null = null;
  let toast: { message: string; type?: 'success' | 'error' } | null = null;

  function handleToast(event: CustomEvent<{ message: string; type?: 'success' | 'error' }>) {
    toast = event.detail;
  }

  function clearToast() {
    toast = null;
  }
</script>

<svelte:head>
  <title>Serifsh — Beautiful Quote Snapshots</title>
  <meta name="description" content="Create beautiful, shareable images of your favorite quotes. Choose from elegant serif-styled themes." />
</svelte:head>

<div class="grid w-full min-h-screen grid-rows-[auto_1fr_auto]">
  <!-- Header -->
  <header class="">
    <div class="mx-auto py-3 px-4 flex items-center justify-between">
      <div class="flex flex-row gap-3">
        <h1 class="sr-only">serif.sh</h1>
        <div class="flex items-center h-6 [&>svg]:h-full [&>svg]:w-auto">
          <SerifshLogo />
        </div>
        <!-- <div class="text-sm opacity-50 pt-2">by</div>
        <a href="https://ticketping.com" class="flex flex-row items-center gap-1.5 no-underline text-inherit" aria-label="Ticketping" target="_blank">
          <div class="border border-black/10 dark:border-white/10 rounded-full flex items-center justify-center [&>svg]:w-7 [&>svg]:h-7">
            <TicketpingLogoMark ariaLabel="Ticketping logo" />
          </div>
          <div class="pb-px [&>svg]:h-5 [&>svg]:w-auto pt-1.5">
            <TicketpingWordmark />
            <span class="sr-only">Ticketping</span>
          </div>
        </a> -->
      </div>
      <ExportButton {frameRef} variant="navbar" on:toast={handleToast} />
    </div>
  </header>

  <!-- Main content - Frame area -->
  <main class="flex items-center justify-center p-4 pt-8 pb-[120px]">
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
    <div class="flex items-center gap-4 md:gap-6 py-3 md:py-4 px-4 md:px-6 bg-white/95 border border-black/10 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.15)] backdrop-blur-xl pointer-events-auto overflow-visible max-w-full">
      <ThemeSelector />
      <FontSelector />
      <AlignmentControl />
      <PaddingControl />
      <ToggleControl
        store={showQuoteMarks}
        label="Quotes"
      />
    </div>
  </div>
</div>

{#if toast}
  <Toast
    message={toast.message}
    type={toast.type || 'info'}
    onClose={clearToast}
  />
{/if}
