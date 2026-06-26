<script lang="ts">
  import {
    selectedTheme,
    selectedFontId,
    alignment,
    padding,
    currentFontCSS,
    authorFontCSS,
    showBackground,
    showQuoteMarks,
    showBrandLogo,
    showXVerifiedBadge
  } from '$lib/stores'
  import { quoteText, authorName, hasUserEdited } from '$lib/stores/quote'
  import type { QuoteStyle } from '$lib/themes'
  import VercelWordmark from './icons/vercel-wordmark.svelte'
  import PeerlistWordMark from './icons/peerlist-wordmark.svelte'
  import XLogoMark from './icons/x-logo-mark.svelte'
  import XVerifiedBadge from './icons/x-verified-badge.svelte'
  import QuoteBrutalist from './icons/quote-brutalist.svelte'
  import QuoteStartup from './icons/quote-startup.svelte'
  import QuoteChirp from './icons/quote-chirp.svelte'
  import QuoteEditorial from './icons/quote-editorial.svelte'
  import QuoteBreeze from './icons/quote-breeze.svelte'
  import QuoteClaude from './icons/quote-claude.svelte'
  import QuoteParchment from './icons/quote-parchment.svelte'

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

  $: justifyClass = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end'
  }[$alignment]

  /** X brand themes use `.quote-card.style-x` */
  $: frameFontFamily =
    theme.brand === 'x' && !$selectedFontId ? '' : `font-family: ${$currentFontCSS};`

  $: authorFontInline =
    $authorFontCSS && (theme.brand !== 'x' || $selectedFontId)
      ? ` font-family: ${$authorFontCSS}`
      : ''

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter' && (e.target as HTMLElement).dataset.field === 'author') {
      e.preventDefault()
    }
  }

  let quoteWasFocused = false

  function handleQuoteMouseDown(e: MouseEvent) {
    quoteWasFocused = document.activeElement === e.currentTarget
  }

  function handleQuoteMouseUp(e: MouseEvent) {
    if (quoteWasFocused) return
    const el = e.currentTarget as HTMLElement
    const sel = window.getSelection()
    if (!sel) return
    const range = document.createRange()
    range.selectNodeContents(el)
    sel.removeAllRanges()
    sel.addRange(range)
  }

  // Use actions instead of reactive text inside contenteditable to prevent cursor resets.
  // Svelte's reactive {$store} inside contenteditable re-renders the text node on every
  // keystroke, which destroys the cursor position.
  // Unified action for contenteditable stores
  function editableStore(node: HTMLElement, store: { subscribe: Function; set: Function }) {
    function onInput() {
      hasUserEdited.set(true)
      store.set(node.innerText)
    }

    function onPaste(e: ClipboardEvent) {
      e.preventDefault()
      const text = e.clipboardData?.getData('text/plain') ?? ''
      const selection = window.getSelection()
      if (!selection?.rangeCount) return
      const range = selection.getRangeAt(0)
      range.deleteContents()
      range.insertNode(document.createTextNode(text))
      range.collapse(false)
      selection.removeAllRanges()
      selection.addRange(range)
      store.set(node.innerText)
    }

    const unsub = store.subscribe((val: string) => {
      if (document.activeElement !== node) {
        node.textContent = val
      }
    })

    node.addEventListener('input', onInput)
    node.addEventListener('paste', onPaste)

    return {
      destroy() {
        unsub()
        node.removeEventListener('input', onInput)
        node.removeEventListener('paste', onPaste)
      }
    }
  }
</script>

<div
  bind:this={frameRef}
  class="quote-frame quote-card"
  class:style-x={theme.brand === 'x'}
  style="
    padding: {$padding}px;
    {hasBackgroundImage
    ? `background-color: ${bg}; background-image: ${bgImage}; background-size: ${bgSize}; background-position: center;`
    : isGradient
      ? `background: ${$showBackground ? bg : 'transparent'}`
      : `background-color: ${$showBackground ? bg : 'transparent'}`};
    {frameFontFamily}
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

{#snippet editableQuote(extraClass = '')}
  <blockquote
    class="{extraClass} outline-none min-h-[1.5em] w-full"
    contenteditable={editable}
    use:editableStore={quoteText}
    on:keydown={handleKeyDown}
    on:mousedown={handleQuoteMouseDown}
    on:mouseup={handleQuoteMouseUp}
    data-placeholder="Enter your quote..."
  ></blockquote>
{/snippet}

{#snippet editableAuthor(extraClass = '', fieldColor = accentColor)}
  <cite
    class="{extraClass} outline-none min-h-[1.5em] not-italic whitespace-nowrap"
    style="color: {fieldColor};{authorFontInline}"
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
    {:else if type === 'chirp'}
      <QuoteChirp color={quoteMarkColor} size={40} class="mb-4 shrink-0" />
    {:else if type === 'editorial' || type === 'noir'}
      <QuoteEditorial color={quoteMarkColor} size={40} class="mb-8 shrink-0" />
    {:else if type === 'breeze' || type === 'aura' || type === 'glass' || type === 'paper'}
      <QuoteBreeze color={quoteMarkColor} size={40} class="mb-4 md:mb-8 shrink-0" />
    {:else if type === 'parchment'}
      <QuoteParchment color={quoteMarkColor} size={40} class="mb-4 shrink-0" />
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
          {@render editableQuote('text-xl md:text-2xl font-medium leading-snug')}
        </div>

        <div
          class="relative z-10 flex items-center {justifyClass} px-10 min-h-14 py-4 mt-auto"
          style="border-top: 1px solid {borderColor};"
        >
          {@render editableAuthor('text-sm font-semibold uppercase tracking-widest')}

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
      {@render editableQuote('text-xl md:text-3xl font-normal leading-relaxed')}

      <div class="w-full h-px mt-8 mb-6" style="background-color: {borderColor};"></div>

      <div class="flex items-center {justifyClass} h-8 w-full">
        {@render editableAuthor('text-sm font-medium uppercase tracking-wider mr-4')}

        {#if $showBrandLogo}
          <span class="mr-4 text-sm font-light opacity-50" style="color: {accentColor}">|</span>
          <PeerlistWordMark color={textColor} size={60} />
        {/if}
      </div>
    </div>
  {/if}

  <!-- Chirp themes -->
  {#if theme.quoteStyle === 'chirp'}
    <div
      class="relative flex flex-col w-full max-w-2xl mx-auto p-2 md:p-8 {alignmentClass}"
      style="background-color: {theme.background};"
    >
      {@render quoteIcon('chirp')}
      {@render editableQuote('text-xl md:text-2xl font-normal leading-normal tracking-normal')}

      <div class="w-full h-px mt-8 mb-6" style="background-color: {borderColor};"></div>

      <div class="flex items-center {justifyClass} h-8 w-full gap-1">
        <div class="flex min-w-0 items-center gap-1 mr-2">
          {@render editableAuthor('text-sm font-medium uppercase tracking-wider')}
          {#if $showXVerifiedBadge}
            <XVerifiedBadge color={quoteMarkColor} size={18} />
          {/if}
        </div>

        {#if $showBrandLogo}
          <span class="mr-2 text-sm font-light opacity-50" style="color: {accentColor}">|</span>
          <XLogoMark color={textColor} size={14} />
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
      {@render editableQuote('text-xl md:text-2xl font-normal italic leading-relaxed')}

      <div class="w-full h-px mt-8 mb-6" style="background-color: {borderColor};"></div>

      {@render editableAuthor('text-sm font-medium uppercase tracking-wider mr-4')}
    </div>
  {/if}

  <!-- Breeze theme -->
  {#if theme.quoteStyle === 'breeze'}
    <div
      class="relative z-10 flex flex-col w-full max-w-3xl mx-auto p-4 md:p-8 rounded-xl md:rounded-3xl card-shadow {alignmentClass}"
      style="background-color: {theme.cardBackground || bg};"
    >
      <div class="relative z-10 flex flex-col min-h-50">
        {@render quoteIcon('breeze')}
        {@render editableQuote('text-xl md:text-2xl lg:text-3xl font-medium leading-snug')}
      </div>

      <div
        class="w-full h-px mt-5 md:mt-10 mb-3 md:mb-6"
        style="background-color: {borderColor};"
      ></div>

      {@render editableAuthor('text-base font-medium uppercase tracking-wider mr-4')}
    </div>
  {/if}

  <!-- Aura theme -->
  {#if theme.quoteStyle === 'aura'}
    {@render auraOverlay()}
    <div
      class="relative z-10 flex flex-col w-full max-w-3xl mx-auto p-4 md:p-8 rounded-xl md:rounded-3xl card-shadow {alignmentClass}"
      style="background-color: {theme.cardBackground || bg};"
    >
      <div class="relative z-10 flex flex-col min-h-50">
        {@render quoteIcon('aura')}
        {@render editableQuote('text-xl md:text-2xl lg:text-3xl font-medium leading-snug')}
      </div>

      <div
        class="w-full h-px mt-5 md:mt-10 mb-3 md:mb-6"
        style="background-color: {borderColor};"
      ></div>

      {@render editableAuthor('text-sm font-semibold uppercase tracking-widest')}
    </div>
  {/if}

  <!-- Paper theme -->
  {#if theme.quoteStyle === 'paper'}
    <div class="relative flex flex-col w-full max-w-2xl mx-auto p-2 md:p-8 {alignmentClass}">
      {@render quoteIcon('paper')}
      {@render editableQuote('text-xl md:text-3xl font-medium italic leading-relaxed')}

      <div class="w-full h-px mt-8 mb-6" style="background-color: {borderColor};"></div>

      {@render editableAuthor('text-base font-medium uppercase tracking-wider mr-4')}
    </div>
  {/if}

  <!-- Parchment theme -->
  {#if theme.quoteStyle === 'parchment'}
    <div class="relative flex flex-col w-full max-w-2xl mx-auto p-2 md:p-8 {alignmentClass}">
      {@render quoteIcon('parchment')}
      {@render editableQuote('text-xl md:text-4xl font-medium leading-relaxed')}

      <div class="w-full mt-8 mb-6">
        <svg
          width="609"
          height="40"
          viewBox="0 0 609 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M581.5 8.36475C578.333 8.69808 570.8 10.1647 566 13.3647M584.5 24.3647C582 22.5314 575.7 18.6647 570.5 17.8647C574.167 18.3647 581.8 19.1647 583 18.3647M554 15.3647C560.333 10.8647 576.4 1.66475 590 0.864746C589 1.86328 585 2.86475 583 4.86475C586 4.03141 598 2.86328 600.5 4.36475C597.833 4.36475 592 4.96475 590 7.36475C592.333 7.19808 597.7 7.16475 600.5 8.36475C594.5 9.03141 581 10.8647 575 12.8647C580.167 11.8647 591.3 10.0647 594.5 10.8647C593.833 11.5314 591 13.2647 585 14.8647C588.167 14.1981 600 13.3633 601 14.8647C599 14.5314 594.1 14.6647 590.5 17.8647C592 18.3647 596.4 19.0647 602 17.8647C601.333 18.5314 598.9 19.9647 594.5 20.3647C595 20.8647 600 21.8633 602 22.8647C596.5 23.3633 592.2 23.2647 587 20.8647C591.667 23.0314 602.1 27.4647 606.5 27.8647C605.667 28.3647 602.3 28.7647 595.5 26.3647C595.5 26.8647 600.6 30.1633 605 31.3633C611 32.9996 602.4 30.5647 596 29.3647C596.167 30.0314 597.1 31.8647 599.5 33.8647C598.833 33.8647 596.8 33.2647 594 30.8647C593.667 31.3647 593.8 33.0647 597 35.8647C596.167 35.6981 593.4 34.4647 589 30.8647C590.2 34.8647 593 38.0314 594 38.3647C592.167 36.8647 587.3 31.9647 584.5 30.3647C583.167 29.1981 579.1 26.4647 573.5 24.8647C573 25.0314 574.5 25.8647 575 29.3647C572 27.6981 562.5 22.2647 554.5 19.8647L554 15.3647Z"
            stroke="#7F4B2F"
            stroke-width="1.5"
          />
          <path
            d="M0.5 17.8647C0.5 16.2647 1.16667 15.8647 1.5 15.8647H548V19.3647C366 19.5314 1.9 19.8647 1.5 19.8647C1 19.8647 0.5 19.8647 0.5 17.8647ZM0.5 17.8647C165.833 17.8647 497 17.7647 499 17.3647C501.5 16.8647 504.5 16.3647 505.5 16.3647"
            stroke="#7F4B2F"
          />
          <path d="M1 16.8647L501.5 16.3647" stroke="#7F4B2F" />
          <path d="M548 17.3633L550.5 14.3633" stroke="#7F4B2F" />
          <path d="M548 19.3633L552.5 14.3633" stroke="#7F4B2F" />
          <path d="M549 20.8633L553.5 15.8633" stroke="#7F4B2F" />
          <path d="M551 21.3633L554 17.8633" stroke="#7F4B2F" />
          <path
            d="M551 14.3647C548.6 14.3647 548 15.6981 548 16.3647V19.3647C548 19.8647 549 21.3647 551 21.3647C551.996 21.3647 552.785 21.1066 553.319 20.8313C553.791 20.5884 554 20.0668 554 19.5363V16.3647C554 15.6981 553.4 14.3647 551 14.3647Z"
            stroke="#7F4B2F"
          />
        </svg>
      </div>

      {@render editableAuthor('text-lg font-semibold uppercase tracking-wider')}
    </div>
  {/if}

  <!-- Noir theme -->
  {#if theme.quoteStyle === 'noir'}
    <div
      class="relative flex flex-col w-full max-w-2xl mx-auto p-2 md:p-8 {alignmentClass}"
      style="background-color: {theme.background};"
    >
      {@render quoteIcon('noir')}
      {@render editableQuote('text-xl md:text-2xl font-normal leading-relaxed')}

      <div class="w-full h-px mt-8 mb-6" style="background-color: {borderColor};"></div>

      {@render editableAuthor('text-sm font-medium uppercase tracking-wider mr-4')}
    </div>
  {/if}

  <!-- Glass theme -->
  {#if theme.quoteStyle === 'glass'}
    <div
      class="relative z-10 flex flex-col w-full max-w-3xl mx-auto p-4 md:p-8 rounded-xl md:rounded-3xl glassmorphism {alignmentClass}"
    >
      <div class="relative z-10 flex flex-col min-h-50">
        {@render quoteIcon('glass')}
        {@render editableQuote('text-xl md:text-2xl lg:text-3xl font-medium leading-snug')}
      </div>

      <div
        class="w-full h-px mt-5 md:mt-10 mb-3 md:mb-6"
        style="background-color: {borderColor};"
      ></div>

      {@render editableAuthor('text-base font-medium uppercase tracking-wider mr-4')}
    </div>
  {/if}

  <!-- Claude terminal theme -->
  {#if theme.quoteStyle === 'claude-code'}
    <div
      class="relative z-10 flex flex-col w-full max-w-3xl mx-auto rounded-md md:rounded-lg card-shadow overflow-hidden"
      style="background-color: {theme.cardBackground || bg};"
    >
      <!-- Terminal title bar -->
      <div
        class="flex items-center gap-2 px-4 h-9 shrink-0"
        style="background-color: #2d2d2d;"
        aria-hidden="true"
      >
        <div class="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
        <div class="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
        <div class="w-3 h-3 rounded-full bg-[#27C93F]"></div>
      </div>

      <!-- Terminal body -->
      <div class="flex flex-col p-4 md:p-6">
        <div class="relative z-10 flex flex-col min-h-50 {alignmentClass}">
          {@render quoteIcon('claude-code')}
          {@render editableQuote('text-xl md:text-2xl font-light leading-snug')}
        </div>

        <div class="w-full h-[0.5px] mt-6 mb-3" style="background-color: {borderColor};"></div>
        <div class="flex items-center h-8 w-full">
          <span class="mr-3 font-bold text-lg select-none" style="color: {accentColor}">&gt;</span>
          {@render editableAuthor('text-base font-medium uppercase tracking-wider mr-4')}
        </div>
        <div class="w-full h-[0.5px] mt-3" style="background-color: {borderColor};"></div>
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
    transition: padding 0.4s cubic-bezier(0.16, 1, 0.3, 1);
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
