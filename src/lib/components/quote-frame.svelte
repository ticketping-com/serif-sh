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

        <div class="relative z-10 flex flex-col pt-2 px-2 pb-2 md:pt-10 md:px-10 md:pb-8 min-h-50 {alignmentClass}">
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
            class="text-xl md:text-2xl lg:text-3xl  font-medium leading-snug outline-none min-h-[1.5em] w-full"
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
            <div class="flex items-center gap-2 select-none">
              <svg
                width="61"
                height="12"
                viewBox="0 0 61 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_61_129)">
                  <path
                    d="M13.9238 12L6.9624 0L0.000946045 12H13.9238ZM20.9452 11.4537L26.763 0.545458H24.2466L20.2334 8.46741L16.2201 0.545458H13.7037L19.5215 11.4537H20.9452ZM60.5931 0.545458V11.4537H58.5098V0.545458H60.5931ZM48.9965 7.38231C48.9965 6.5322 49.1756 5.78448 49.5337 5.13921C49.8918 4.49393 50.3909 3.99715 51.0312 3.64892C51.6712 3.30067 52.42 3.12655 53.2773 3.12655C54.0367 3.12655 54.7203 3.29042 55.328 3.61818C55.9354 3.94595 56.4183 4.43248 56.7764 5.07775C57.1345 5.72303 57.3189 6.51171 57.3298 7.44378V7.92005H51.1939C51.2372 8.59606 51.4379 9.12868 51.796 9.51789C52.1651 9.89686 52.6586 10.0863 53.2773 10.0863C53.6677 10.0863 54.0258 9.98393 54.3513 9.77908C54.6768 9.57422 54.921 9.29767 55.0837 8.94942L57.2159 9.10306C56.9554 9.87125 56.4672 10.4858 55.751 10.9467C55.0348 11.4076 54.2102 11.6381 53.2773 11.6381C52.42 11.6381 51.6712 11.464 51.0312 11.1157C50.3909 10.7675 49.8918 10.2707 49.5337 9.62543C49.1756 8.98015 48.9965 8.23244 48.9965 7.38231ZM55.1813 6.61412C55.1054 5.94835 54.8938 5.46185 54.5466 5.15458C54.1995 4.83706 53.7762 4.67829 53.2773 4.67829C52.7022 4.67829 52.2356 4.84728 51.8775 5.18529C51.5194 5.5233 51.2968 5.99958 51.2102 6.61412H55.1813ZM45.4821 5.15458C45.8292 5.43111 46.0462 5.81522 46.133 6.30685L48.2815 6.19932C48.2054 5.57451 47.9831 5.03167 47.6143 4.57075C47.2452 4.10984 46.7677 3.75646 46.1819 3.51065C45.6069 3.25458 44.9722 3.12655 44.2777 3.12655C43.4204 3.12655 42.6719 3.30067 42.0316 3.64892C41.3913 3.99715 40.8924 4.49393 40.5343 5.13921C40.1762 5.78448 39.9972 6.5322 39.9972 7.38231C39.9972 8.23244 40.1762 8.98015 40.5343 9.62543C40.8924 10.2707 41.3913 10.7675 42.0316 11.1157C42.6719 11.464 43.4204 11.6381 44.2777 11.6381C44.9938 11.6381 45.6448 11.5101 46.2308 11.254C46.8166 10.9877 47.2941 10.6138 47.6629 10.1324C48.032 9.65105 48.2543 9.08769 48.3302 8.44242L46.1656 8.35025C46.0897 8.89308 45.8781 9.31304 45.531 9.61006C45.1836 9.89686 44.7659 10.0403 44.2777 10.0403C43.605 10.0403 43.0842 9.80979 42.7152 9.34888C42.3464 8.88796 42.1618 8.23244 42.1618 7.38231C42.1618 6.5322 42.3464 5.87668 42.7152 5.41576C43.0842 4.95485 43.605 4.72438 44.2777 4.72438C44.7442 4.72438 45.1456 4.86778 45.4821 5.15458ZM34.9137 3.31055H36.8522L36.9083 4.87775C37.0459 4.43414 37.2373 4.08965 37.4824 3.84427C37.8377 3.48845 38.3332 3.31055 38.9686 3.31055H39.7602V4.98798H38.9525C38.5001 4.98798 38.1285 5.04898 37.8377 5.17096C37.5576 5.29297 37.3423 5.48612 37.1916 5.75045C37.0515 6.01477 36.9816 6.35026 36.9816 6.7569V11.4537H34.9137V3.31055ZM25.9716 5.13921C25.6135 5.78448 25.4345 6.5322 25.4345 7.38231C25.4345 8.23244 25.6135 8.98015 25.9716 9.62543C26.3297 10.2707 26.8286 10.7675 27.4689 11.1157C28.1092 11.464 28.8577 11.6381 29.715 11.6381C30.6481 11.6381 31.4728 11.4076 32.1889 10.9467C32.9049 10.4858 33.3933 9.87125 33.6536 9.10306L31.5214 8.94942C31.3587 9.29767 31.1147 9.57422 30.7892 9.77908C30.4637 9.98393 30.1056 10.0863 29.715 10.0863C29.0966 10.0863 28.6028 9.89686 28.234 9.51789C27.8759 9.12868 27.6752 8.59606 27.6316 7.92005H33.7675V7.44378C33.7568 6.51171 33.5724 5.72303 33.2143 5.07775C32.8562 4.43248 32.3733 3.94595 31.7657 3.61818C31.158 3.29042 30.4744 3.12655 29.715 3.12655C28.8577 3.12655 28.1092 3.30067 27.4689 3.64892C26.8286 3.99715 26.3297 4.49393 25.9716 5.13921ZM30.9845 5.15458C31.3317 5.46185 31.5433 5.94835 31.6192 6.61412H27.6479C27.7348 5.99958 27.9571 5.5233 28.3152 5.18529C28.6733 4.84728 29.1399 4.67829 29.715 4.67829C30.2141 4.67829 30.6372 4.83706 30.9845 5.15458Z"
                    fill={textColor}
                  />
                </g>
                <defs>
                  <clipPath id="clip0_61_129">
                    <rect width="61" height="12" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
          {/if}
        </div>
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
