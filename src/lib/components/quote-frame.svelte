<script lang="ts">
  import {
    selectedTheme,
    alignment,
    padding,
    currentFontCSS,
    showBackground,
    showQuoteMarks,
    showBrandLogo
  } from '$lib/stores'
  import { quoteText, authorName } from '$lib/stores/quote'
  import type { QuoteStyle } from '$lib/themes'
  import VercelWordmark from './icons/vercel-wordmark.svelte'
  import PeerlistWordMark from './icons/peerlist-wordmark.svelte'
  import QuoteBrutalist from './icons/quote-brutalist.svelte'
  import QuoteStartup from './icons/quote-startup.svelte'
  import QuoteEditorial from './icons/quote-editorial.svelte'
  import QuoteBreeze from './icons/quote-breeze.svelte'
  import QuoteClaude from './icons/quote-claude.svelte'

  export let frameRef: HTMLDivElement | null = null
  export let editable: boolean = true

  $: theme = $selectedTheme
  $: bg = theme.background
  $: bgImage = theme.backgroundImage || null
  $: bgSize = theme.backgroundSize || 'cover'
  $: textColor = theme.text
  $: accentColor = theme.accent
  $: quoteMarkColor = theme.quoteMark
  $: borderColor = theme.border || 'transparent'
  $: isGradient = bg.includes('gradient')
  $: hasBackgroundImage = !!bgImage && $showBackground

  $: alignmentClass = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end'
  }[$alignment]

  function handleKeyDown(e: KeyboardEvent) {
    // Prevent newlines in author field
    if (e.key === 'Enter' && (e.target as HTMLElement).dataset.field === 'author') {
      e.preventDefault()
    }
  }

  // Use actions instead of reactive text inside contenteditable to prevent cursor resets.
  // Svelte's reactive {$store} inside contenteditable re-renders the text node on every
  // keystroke, which destroys the cursor position.
  // Unified action for contenteditable stores
  function editableStore(node: HTMLElement, store: { subscribe: Function, set: Function }) {
    function onInput() {
      store.set(node.innerText)
    }

    const unsub = store.subscribe((val: string) => {
      if (document.activeElement !== node) {
        node.textContent = val
      }
    })

    node.addEventListener('input', onInput)

    return {
      destroy() {
        unsub()
        node.removeEventListener('input', onInput)
      }
    }
  }
</script>

<div
  bind:this={frameRef}
  class="quote-frame"
  style="
    padding: {$padding}px;
    {hasBackgroundImage
    ? `background-color: ${bg}; background-image: ${bgImage}; background-size: ${bgSize}; background-position: center;`
    : isGradient
      ? `background: ${$showBackground ? bg : 'transparent'}`
      : `background-color: ${$showBackground ? bg : 'transparent'}`};
    font-family: {$currentFontCSS};
  "
>
  {#if !$showBackground}
    <div class="transparent-pattern absolute inset-0" data-ignore-in-export></div>
  {/if}

  <div class="quote-content" style="color: {textColor}">
    {@render quoteContent()}
  </div>
</div>

{#snippet auraOverlay()}
  {#if $showBackground}
    <div class="absolute inset-0 z-0 pointer-events-none">
      <div class="absolute inset-0 bg-white/50"></div>
      <div
        class="absolute inset-0 bg-[linear-gradient(to_bottom,#A259FF_0%,#A259FF_65%,rgba(255,255,255,0.65)_100%)] opacity-60"
      ></div>
      <div
        class="absolute inset-0 bg-[linear-gradient(to_bottom,#FF8726_0%,rgba(255,255,255,0.65)_100%)] opacity-60"
      ></div>
      <div
        class="absolute inset-0 bg-[radial-gradient(circle_300px_at_50%_-15%,transparent_20%,white_70%,transparent_85%,white_100%)] opacity-50 mix-blend-soft-light"
      ></div>
    </div>
  {/if}
{/snippet}

{#snippet editableQuote(extraClass = "")}
  <blockquote
    class="{extraClass} outline-none min-h-[1.5em] w-full"
    contenteditable={editable}
    use:editableStore={quoteText}
    on:keydown={handleKeyDown}
    data-placeholder="Enter your quote..."
  ></blockquote>
{/snippet}

{#snippet editableAuthor(extraClass = "", fieldColor = accentColor)}
  <cite
    class="{extraClass} outline-none min-h-[1.5em] not-italic"
    style="color: {fieldColor}"
    contenteditable={editable}
    use:editableStore={authorName}
    on:keydown={handleKeyDown}
    data-field="author"
    data-placeholder="AUTHOR"
    role="textbox"
    tabindex="0"
  ></cite>
{/snippet}

{#snippet quoteIcon(type: QuoteStyle)}
  {#if $showQuoteMarks}
    {#if type === 'brutalist'}
      <QuoteBrutalist color={quoteMarkColor} size={40} class="mb-8" />
    {:else if type === 'startup'}
      <QuoteStartup color={quoteMarkColor} size={40} class="mb-8 shrink-0" />
    {:else if type === 'editorial' || type === 'noir'}
      <QuoteEditorial color={quoteMarkColor} size={40} class="mb-8 shrink-0" />
    {:else if type === 'breeze' || type === 'aura' || type === 'glass'}
      <QuoteBreeze color={quoteMarkColor} size={40} class="mb-4 md:mb-8 shrink-0" />
    {:else if type === 'claude-code'}
      <QuoteClaude color={quoteMarkColor} size={40} class="mb-4 md:mb-8 shrink-0" />
    {/if}
  {/if}
{/snippet}

{#snippet quoteContent()}
  <!-- Brutalist themes -->
  {#if theme.quoteStyle === 'brutalist'}
    <div
      class="relative z-10 flex w-full max-w-3xl mx-auto shadow-2xl p-4 md:p-8"
      style="background-color: {theme.cardBackground || bg};"
    >
      <div class="relative flex flex-col w-full" style="border: 1px solid {borderColor};">
        <div class="absolute w-4 h-4 -top-2 -left-2 pointer-events-none">
          <div
            class="absolute top-1/2 left-0 w-full h-[0.5px] -translate-y-1/2"
            style="background-color: {accentColor};"
          ></div>
          <div
            class="absolute left-1/2 top-0 h-full w-[0.5px] -translate-x-1/2"
            style="background-color: {accentColor};"
          ></div>
        </div>

        <div class="absolute w-4 h-4 -bottom-2 -right-2 pointer-events-none">
          <div
            class="absolute top-1/2 left-0 w-full h-[0.5px] -translate-y-1/2"
            style="background-color: {accentColor};"
          ></div>
          <div
            class="absolute left-1/2 top-0 h-full w-[0.5px] -translate-x-1/2"
            style="background-color: {accentColor};"
          ></div>
        </div>

        <div
          class="relative z-10 flex flex-col pt-2 px-2 pb-2 md:pt-10 md:px-10 md:pb-8 min-h-50 {alignmentClass}"
        >
          {@render quoteIcon('brutalist')}
          {@render editableQuote("text-xl md:text-2xl lg:text-3xl font-medium leading-snug")}
        </div>

        <div
          class="relative z-10 flex items-center px-10 min-h-14 py-4 mt-auto"
          style="border-top: 1px solid {borderColor};"
        >
          {@render editableAuthor("text-sm font-semibold uppercase tracking-widest")}

          {#if $showBrandLogo}
            <span class="mx-3 text-lg opacity-40 font-light" style="color: {accentColor}">|</span>
            <VercelWordmark color={textColor} size={60} />
          {/if}
        </div>
      </div>
    </div>
  {/if}

  <!-- Startup themes -->
  {#if theme.quoteStyle === 'startup'}
    <div
      class="relative flex flex-col w-full max-w-2xl mx-auto p-2 md:p-8 {alignmentClass}"
      style="background-color: {theme.background};"
    >
      {@render quoteIcon('startup')}
      {@render editableQuote("text-xl md:text-2xl font-normal leading-relaxed")}

      <div class="w-full h-px mt-8 mb-6" style="background-color: {borderColor};"></div>

      <div class="flex items-center h-8 w-full">
        {@render editableAuthor("text-sm font-medium uppercase tracking-wider mr-4")}

        {#if $showBrandLogo}
          <span class="mr-4 text-sm font-light opacity-50" style="color: {accentColor}">|</span>
          <PeerlistWordMark color={textColor} size={60} />
        {/if}
      </div>
    </div>
  {/if}

  <!-- Editorial theme -->
  {#if theme.quoteStyle === 'editorial'}
    <div
      class="relative flex flex-col w-full max-w-2xl mx-auto p-2 md:p-8 {alignmentClass}"
      style="background-color: {theme.background};"
    >
      {@render quoteIcon('editorial')}
      {@render editableQuote("text-xl md:text-2xl font-normal italic leading-relaxed")}

      <div class="w-full h-px mt-8 mb-6" style="background-color: {borderColor};"></div>

      {@render editableAuthor("text-sm font-medium uppercase tracking-wider mr-4")}
    </div>
  {/if}

  <!-- Breeze theme -->
  {#if theme.quoteStyle === 'breeze'}
    <div
      class="relative z-10 flex flex-col w-full max-w-3xl mx-auto p-4 md:p-8 rounded-xl md:rounded-3xl card-shadow"
      style="background-color: {theme.cardBackground || bg};"
    >
      <div class="relative z-10 flex flex-col min-h-50 {alignmentClass}">
        {@render quoteIcon('breeze')}
        {@render editableQuote("text-xl md:text-2xl lg:text-3xl font-medium leading-snug")}
      </div>

      <div
        class="w-full h-px mt-5 md:mt-10 mb-3 md:mb-6"
        style="background-color: {borderColor};"
      ></div>

      {@render editableAuthor("text-base font-medium uppercase tracking-wider mr-4")}
    </div>
  {/if}

  <!-- Aura theme -->
  {#if theme.quoteStyle === 'aura'}
    {@render auraOverlay()}
    <div
      class="relative z-10 flex flex-col w-full max-w-3xl mx-auto p-4 md:p-8 rounded-xl md:rounded-3xl card-shadow"
      style="background-color: {theme.cardBackground || bg};"
    >
      <div class="relative z-10 flex flex-col min-h-50 {alignmentClass}">
        {@render quoteIcon('aura')}
        {@render editableQuote("text-xl md:text-2xl lg:text-3xl font-medium leading-snug")}
      </div>

      <div
        class="w-full h-px mt-5 md:mt-10 mb-3 md:mb-6"
        style="background-color: {borderColor};"
      ></div>

      {@render editableAuthor("text-sm font-semibold uppercase tracking-widest")}
    </div>
  {/if}

  <!-- Noir theme -->
  {#if theme.quoteStyle === 'noir'}
    <div
      class="relative flex flex-col w-full max-w-2xl mx-auto p-2 md:p-8 {alignmentClass}"
      style="background-color: {theme.background};"
    >
      {@render quoteIcon('noir')}
      {@render editableQuote("text-xl md:text-2xl font-normal leading-relaxed")}

      <div class="w-full h-px mt-8 mb-6" style="background-color: {borderColor};"></div>

      {@render editableAuthor("text-sm font-medium uppercase tracking-wider mr-4")}
    </div>
  {/if}

  <!-- Glass theme -->
  {#if theme.quoteStyle === 'glass'}
    <div
      class="relative z-10 flex flex-col w-full max-w-3xl mx-auto p-4 md:p-8 rounded-xl md:rounded-3xl glassmorphism"
    >
      <div class="relative z-10 flex flex-col min-h-50 {alignmentClass}">
        {@render quoteIcon('glass')}
        {@render editableQuote("text-xl md:text-2xl lg:text-3xl font-medium leading-snug")}
      </div>

      <div
        class="w-full h-px mt-5 md:mt-10 mb-3 md:mb-6"
        style="background-color: {borderColor};"
      ></div>

      {@render editableAuthor("text-base font-medium uppercase tracking-wider mr-4")}
    </div>
  {/if}

  <!-- Claude terminal theme -->
  {#if theme.quoteStyle === 'claude-code'}
    <div
      class="relative z-10 flex flex-col w-full max-w-3xl mx-auto p-4 rounded-md md:rounded-lg card-shadow"
      style="background-color: {theme.cardBackground || bg}; "
    >
      <div class="flex gap-2 mb-8" aria-hidden="true">
        <div class="w-3.5 h-3.5 rounded-full bg-[#FF5F56]"></div>
        <div class="w-3.5 h-3.5 rounded-full bg-[#FFBD2E]"></div>
        <div class="w-3.5 h-3.5 rounded-full bg-[#27C93F]"></div>
      </div>

      <div class="relative z-10 flex flex-col min-h-50 {alignmentClass}">
        {@render quoteIcon('claude-code')}
        {@render editableQuote("text-xl md:text-2xl font-light leading-snug")}
      </div>

      <div class="flex items-center h-8 w-full mt-8">
        <span class="mr-3 font-bold text-lg select-none" style="color: {accentColor}">&gt;</span>
        {@render editableAuthor("text-base font-medium uppercase tracking-wider mr-4")}
      </div>
    </div>
  {/if}
{/snippet}


<style>
  .quote-frame {
    min-width: 400px;
    min-height: 200px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .quote-content {
    width: 100%;
  }

  [contenteditable]:empty:before {
    content: attr(data-placeholder);
    opacity: 0.4;
    pointer-events: none;
  }

  [contenteditable]:focus {
    outline: none;
  }

  [contenteditable] {
    cursor: text;
  }

  :global(.inline-marks::before) {
    content: '\201C';
  }

  :global(.inline-marks::after) {
    content: '\201D';
  }
</style>
