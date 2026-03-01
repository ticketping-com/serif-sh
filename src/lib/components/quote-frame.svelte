<script lang="ts">
  import {
    selectedTheme,
    alignment,
    padding,
    currentFontCSS,
    showBackground,
    showQuoteMarks
  } from '$lib/stores'
  import { quoteText, authorName } from '$lib/stores/quote'
  import VercelWordmark from './icons/vercel-wordmark.svelte'
  import PeerlistWordMark from './icons/peerlist-wordmark.svelte'

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
  function editableQuote(node: HTMLElement) {
    function onInput() {
      quoteText.set(node.innerText)
    }

    const unsub = quoteText.subscribe((val) => {
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

  function editableAuthor(node: HTMLElement) {
    function onInput() {
      authorName.set(node.innerText)
    }

    const unsub = authorName.subscribe((val) => {
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

{#snippet quoteContent()}
  <!-- Classic Style -->
  {#if theme.quoteStyle === 'classic'}
    <div class="relative flex flex-col {alignmentClass} max-w-2xl mx-auto w-full">
      {#if $showQuoteMarks}
        <svg
          class="w-16 h-16 select-none opacity-60 mb-4"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          fill={quoteMarkColor}
        >
          <path
            d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 0 1-3.5 3.5 3.87 3.87 0 0 1-2.748-1.179m10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 0 1-3.5 3.5 3.87 3.87 0 0 1-2.748-1.179"
          />
        </svg>
      {/if}
      <blockquote
        class="text-xl md:text-2xl leading-relaxed italic outline-none min-h-[1.5em]"
        contenteditable={editable}
        use:editableQuote
        on:keydown={handleKeyDown}
        data-placeholder="Enter your quote..."
      ></blockquote>
      <div class="mt-6 text-base not-italic font-medium" style="color: {accentColor}">
        {#if $authorName}<span class="select-none pointer-events-none">— </span>{/if}<cite
          class="outline-none min-h-[1.5em] inline"
          contenteditable={editable}
          use:editableAuthor
          on:keydown={handleKeyDown}
          data-field="author"
          data-placeholder="Author name"
          role="textbox"
          tabindex="0"
        ></cite>
      </div>
    </div>
  {/if}

  <!-- Goodreads Style -->
  {#if theme.quoteStyle === 'goodreads'}
    <div
      class="relative flex flex-col {alignmentClass} max-w-2xl mx-auto p-8 rounded-sm w-full"
      style="
        border-left: 4px solid {borderColor};
        background-color: rgba(0,0,0,0.02);
      "
    >
      {#if $showQuoteMarks}
        <span
          class="text-6xl leading-none font-serif select-none absolute -top-2 -left-1 opacity-40"
          style="color: {quoteMarkColor}">"</span
        >
      {/if}
      <blockquote
        class="text-lg md:text-xl leading-relaxed pl-4 outline-none min-h-[1.5em]"
        contenteditable={editable}
        use:editableQuote
        on:keydown={handleKeyDown}
        data-placeholder="Enter your quote..."
      ></blockquote>
      <div class="mt-6 flex items-center gap-3 pl-4">
        <span class="w-8 h-px" style="background-color: {accentColor}"></span>
        <cite
          class="text-sm not-italic font-semibold tracking-wide uppercase outline-none min-h-[1.5em]"
          style="color: {accentColor}"
          contenteditable={editable}
          use:editableAuthor
          on:keydown={handleKeyDown}
          data-field="author"
          data-placeholder="AUTHOR"
          role="textbox"
          tabindex="0"
        ></cite>
      </div>
    </div>
  {/if}

  <!-- Minimal Style -->
  {#if theme.quoteStyle === 'minimal'}
    <div class="relative flex flex-col {alignmentClass} max-w-2xl mx-auto w-full">
      <blockquote
        class="text-xl md:text-2xl lg:text-3xl leading-snug font-normal outline-none min-h-[1.5em] {$showQuoteMarks
          ? 'inline-marks'
          : ''}"
        contenteditable={editable}
        use:editableQuote
        on:keydown={handleKeyDown}
        data-placeholder="Enter your quote..."
      ></blockquote>
      <cite
        class="mt-8 text-sm not-italic tracking-widest uppercase outline-none min-h-[1.5em]"
        style="color: {accentColor}"
        contenteditable={editable}
        use:editableAuthor
        on:keydown={handleKeyDown}
        data-field="author"
        data-placeholder="AUTHOR"
        role="textbox"
        tabindex="0"
      ></cite>
    </div>
  {/if}

  <!-- Decorative Style -->
  {#if theme.quoteStyle === 'decorative'}
    <div class="relative flex flex-col {alignmentClass} max-w-2xl mx-auto p-6 w-full">
      <!-- Top decorative element -->
      <div class="flex items-center gap-4 mb-6 w-full justify-center">
        <span class="h-px flex-1 max-w-16" style="background-color: {borderColor}"></span>
        {#if $showQuoteMarks}
          <span class="text-4xl font-serif" style="color: {quoteMarkColor}">❝</span>
        {/if}
        <span class="h-px flex-1 max-w-16" style="background-color: {borderColor}"></span>
      </div>

      <blockquote
        class="text-xl md:text-2xl leading-relaxed italic outline-none min-h-[1.5em]"
        contenteditable={editable}
        use:editableQuote
        on:keydown={handleKeyDown}
        data-placeholder="Enter your quote..."
      ></blockquote>

      <div class="mt-6 flex items-center gap-4 w-full justify-center">
        <span class="h-px flex-1 max-w-12" style="background-color: {borderColor}"></span>
        <cite
          class="text-sm not-italic font-semibold outline-none min-h-[1.5em]"
          style="color: {accentColor}"
          contenteditable={editable}
          use:editableAuthor
          on:keydown={handleKeyDown}
          data-field="author"
          data-placeholder="Author"
          role="textbox"
          tabindex="0"
        ></cite>
        <span class="h-px flex-1 max-w-12" style="background-color: {borderColor}"></span>
      </div>

      <!-- Bottom decorative element -->
      {#if $showQuoteMarks}
        <div class="flex items-center gap-4 mt-6 w-full justify-center">
          <span class="h-px flex-1 max-w-16" style="background-color: {borderColor}"></span>
          <span class="text-4xl font-serif rotate-180" style="color: {quoteMarkColor}">❝</span>
          <span class="h-px flex-1 max-w-16" style="background-color: {borderColor}"></span>
        </div>
      {/if}
    </div>
  {/if}

  <!-- Editorial Style -->
  {#if theme.quoteStyle === 'editorial'}
    <div class="relative flex flex-col {alignmentClass} max-w-2xl mx-auto w-full">
      <div class="relative">
        {#if $showQuoteMarks}
          <span
            class="text-9xl leading-none font-serif select-none absolute -top-8 -left-6 opacity-20"
            style="color: {quoteMarkColor}">"</span
          >
        {/if}
        <blockquote
          class="text-2xl md:text-3xl lg:text-4xl leading-tight font-medium relative z-10 outline-none min-h-[1.5em]"
          contenteditable={editable}
          use:editableQuote
          on:keydown={handleKeyDown}
          data-placeholder="Enter your quote..."
        ></blockquote>
      </div>
      <div class="mt-8 pt-4" style="border-top: 2px solid {borderColor}">
        <cite
          class="text-base not-italic font-bold outline-none min-h-[1.5em]"
          contenteditable={editable}
          use:editableAuthor
          on:keydown={handleKeyDown}
          data-field="author"
          data-placeholder="Author"
          role="textbox"
          tabindex="0"
        ></cite>
      </div>
    </div>
  {/if}

  <!-- Modern Style -->
  {#if theme.quoteStyle === 'modern'}
    <div class="relative flex flex-col {alignmentClass} max-w-2xl mx-auto w-full">
      <div class="flex gap-4">
        {#if $showQuoteMarks}
          <span class="text-5xl leading-none font-bold shrink-0" style="color: {quoteMarkColor}"
            >"</span
          >
        {/if}
        <div class="flex flex-col">
          <blockquote
            class="text-lg md:text-xl leading-relaxed outline-none min-h-[1.5em]"
            contenteditable={editable}
            use:editableQuote
            on:keydown={handleKeyDown}
            data-placeholder="Enter your quote..."
          ></blockquote>
          <div
            class="mt-4 text-sm not-italic font-medium flex items-center gap-2"
            style="color: {accentColor}"
          >
            <span class="w-6 h-0.5 rounded-full shrink-0" style="background-color: {quoteMarkColor}"
            ></span>
            <cite
              class="outline-none min-h-[1.5em]"
              contenteditable={editable}
              use:editableAuthor
              on:keydown={handleKeyDown}
              data-field="author"
              data-placeholder="Author"
              role="textbox"
              tabindex="0"
            ></cite>
          </div>
        </div>
      </div>
    </div>
  {/if}

  <!-- Elegant Style -->
  {#if theme.quoteStyle === 'elegant'}
    <div class="relative flex flex-col {alignmentClass} max-w-2xl mx-auto w-full">
      {#if $showQuoteMarks}
        <span
          class="leading-none font-serif select-none -mb-12"
          style="color: {quoteMarkColor}; font-size: 10rem;">&ldquo;</span
        >
      {/if}
      <blockquote
        class="text-2xl md:text-3xl leading-relaxed outline-none min-h-[1.5em]"
        contenteditable={editable}
        use:editableQuote
        on:keydown={handleKeyDown}
        data-placeholder="Enter your quote..."
      ></blockquote>
      <span class="block w-12 h-px mt-10 mb-6" style="background-color: {borderColor}"></span>
      <cite
        class="text-sm not-italic font-normal tracking-[0.25em] uppercase outline-none min-h-[1.5em] font-sans"
        style="color: {accentColor}"
        contenteditable={editable}
        use:editableAuthor
        on:keydown={handleKeyDown}
        data-field="author"
        data-placeholder="AUTHOR NAME"
        role="textbox"
        tabindex="0"
      ></cite>
    </div>
  {/if}

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
          {#if $showQuoteMarks}
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="mb-8 size-10"
            >
              <path
                d="M9.11227 7.04386L2.58066 20.1084V33.1729H15.6452V20.1084H9.11227L15.6452 7.04386H9.11227ZM37.4194 6.82709H30.8878L24.3549 19.8916V32.9561H37.4194V19.8916H30.8878L37.4194 6.82709Z"
                fill={quoteMarkColor}
              />
            </svg>
          {/if}

          <blockquote
            class="text-xl md:text-2xl lg:text-3xl font-medium leading-snug outline-none min-h-[1.5em] w-full"
            contenteditable={editable}
            use:editableQuote
            on:keydown={handleKeyDown}
            data-placeholder="Enter your quote..."
          ></blockquote>
        </div>

        <div
          class="relative z-10 flex items-center px-10 h-14 mt-auto"
          style="border-top: 1px solid {borderColor};"
        >
          <cite
            class="text-sm font-semibold uppercase tracking-widest outline-none min-h-[1.5em] not-italic"
            style="color: {accentColor}"
            contenteditable={editable}
            use:editableAuthor
            on:keydown={handleKeyDown}
            data-field="author"
            data-placeholder="AUTHOR"
            role="textbox"
            tabindex="0"
          ></cite>

          {#if theme.id.includes('vercel')}
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
      {#if $showQuoteMarks}
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="w-10 h-10 mb-8 shrink-0"
        >
          <path
            d="M6.15166 10.4866C8.48999 7.95163 12.0283 6.66663 16.6667 6.66663H18.3333V11.365L16.9933 11.6333C14.71 12.09 13.1217 12.9883 12.2717 14.3066C11.8281 15.0168 11.5766 15.83 11.5417 16.6666H16.6667C17.1087 16.6666 17.5326 16.8422 17.8452 17.1548C18.1577 17.4673 18.3333 17.8913 18.3333 18.3333V30C18.3333 31.8383 16.8383 33.3333 15 33.3333H4.99999C4.55796 33.3333 4.13404 33.1577 3.82148 32.8451C3.50892 32.5326 3.33333 32.1087 3.33333 31.6666V23.3333L3.33833 18.4683C3.32333 18.2833 3.00666 13.9 6.15166 10.4866ZM33.3333 33.3333H23.3333C22.8913 33.3333 22.4674 33.1577 22.1548 32.8451C21.8423 32.5326 21.6667 32.1087 21.6667 31.6666V23.3333L21.6717 18.4683C21.6567 18.2833 21.34 13.9 24.485 10.4866C26.8233 7.95163 30.3617 6.66663 35 6.66663H36.6667V11.365L35.3267 11.6333C33.0433 12.09 31.455 12.9883 30.605 14.3066C30.1615 15.0168 29.9099 15.83 29.875 16.6666H35C35.442 16.6666 35.8659 16.8422 36.1785 17.1548C36.4911 17.4673 36.6667 17.8913 36.6667 18.3333V30C36.6667 31.8383 35.1717 33.3333 33.3333 33.3333Z"
            fill={quoteMarkColor}
          />
        </svg>
      {/if}

      <blockquote
        class="text-xl md:text-2xl font-normal leading-relaxed outline-none min-h-[1.5em] w-full"
        contenteditable={editable}
        use:editableQuote
        on:keydown={handleKeyDown}
        data-placeholder="Enter your quote..."
      ></blockquote>

      <div class="w-full h-px mt-12 mb-6" style="background-color: {borderColor};"></div>

      <div class="flex items-center h-8 w-full">
        <cite
          class="text-sm font-medium uppercase tracking-wider outline-none min-h-[1.5em] not-italic mr-4"
          style="color: {accentColor}"
          contenteditable={editable}
          use:editableAuthor
          on:keydown={handleKeyDown}
          data-field="author"
          data-placeholder="AUTHOR"
          role="textbox"
          tabindex="0"
        ></cite>

        {#if theme.id.includes('peerlist')}
          <span class="mr-4 text-sm font-light opacity-50" style="color: {accentColor}">|</span>
          <PeerlistWordMark color={textColor} size={60} />
        {/if}
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
