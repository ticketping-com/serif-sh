<script lang="ts">
  import {
    selectedTheme,
    alignment,
    padding,
    currentFontCSS,
    showBackground,
    showQuoteMarks
  } from '$lib/stores';
  import { quoteText, authorName } from '$lib/stores/quote';

  export let frameRef: HTMLDivElement | null = null;
  export let editable: boolean = true;

  $: theme = $selectedTheme;
  $: bg = theme.background;
  $: bgImage = theme.backgroundImage || null;
  $: bgSize = theme.backgroundSize || 'cover';
  $: textColor = theme.text;
  $: accentColor = theme.accent;
  $: quoteMarkColor = theme.quoteMark;
  $: borderColor = theme.border || 'transparent';
  $: isGradient = bg.includes('gradient');
  $: hasBackgroundImage = !!bgImage && $showBackground;

  $: alignmentClass = {
    'left': 'text-left items-start',
    'center': 'text-center items-center',
    'right': 'text-right items-end',
  }[$alignment];

  function handleQuoteInput(e: Event) {
    const target = e.target as HTMLElement;
    quoteText.set(target.innerText);
  }

  function handleAuthorInput(e: Event) {
    const target = e.target as HTMLElement;
    authorName.set(target.innerText);
  }

  function handleKeyDown(e: KeyboardEvent) {
    // Prevent newlines in author field
    if (e.key === 'Enter' && (e.target as HTMLElement).dataset.field === 'author') {
      e.preventDefault();
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
        : `background-color: ${$showBackground ? bg : 'transparent'}`
    };
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
        <span
          class="text-8xl leading-none font-serif select-none opacity-60 -mb-4"
          style="color: {quoteMarkColor}"
        >"</span>
      {/if}
      <blockquote
        class="text-xl md:text-2xl leading-relaxed italic outline-none min-h-[1.5em]"
        contenteditable={editable}
        on:input={handleQuoteInput}
        on:keydown={handleKeyDown}
        data-placeholder="Enter your quote..."
      >{$quoteText}</blockquote>
      <cite
        class="mt-6 text-base not-italic font-medium outline-none min-h-[1.5em]"
        style="color: {accentColor}"
        contenteditable={editable}
        on:input={handleAuthorInput}
        on:keydown={handleKeyDown}
        data-field="author"
        data-placeholder="Author name"
      >{#if $authorName}— {$authorName}{/if}</cite>
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
          style="color: {quoteMarkColor}"
        >"</span>
      {/if}
      <blockquote
        class="text-lg md:text-xl leading-relaxed pl-4 outline-none min-h-[1.5em]"
        contenteditable={editable}
        on:input={handleQuoteInput}
        on:keydown={handleKeyDown}
        data-placeholder="Enter your quote..."
      >{$quoteText}</blockquote>
      <div class="mt-6 flex items-center gap-3 pl-4">
        <span class="w-8 h-px" style="background-color: {accentColor}"></span>
        <cite
          class="text-sm not-italic font-semibold tracking-wide uppercase outline-none min-h-[1.5em]"
          style="color: {accentColor}"
          contenteditable={editable}
          on:input={handleAuthorInput}
          on:keydown={handleKeyDown}
          data-field="author"
          data-placeholder="AUTHOR"
        >{$authorName}</cite>
      </div>
    </div>
  {/if}

  <!-- Minimal Style -->
  {#if theme.quoteStyle === 'minimal'}
    <div class="relative flex flex-col {alignmentClass} max-w-2xl mx-auto w-full">
      <blockquote
        class="text-xl md:text-2xl lg:text-3xl leading-snug font-normal outline-none min-h-[1.5em]"
        contenteditable={editable}
        on:input={handleQuoteInput}
        on:keydown={handleKeyDown}
        data-placeholder="Enter your quote..."
      >{#if $showQuoteMarks}"{/if}{$quoteText}{#if $showQuoteMarks}"{/if}</blockquote>
      <cite
        class="mt-8 text-sm not-italic tracking-widest uppercase outline-none min-h-[1.5em]"
        style="color: {accentColor}"
        contenteditable={editable}
        on:input={handleAuthorInput}
        on:keydown={handleKeyDown}
        data-field="author"
        data-placeholder="AUTHOR"
      >{$authorName}</cite>
    </div>
  {/if}

  <!-- Decorative Style -->
  {#if theme.quoteStyle === 'decorative'}
    <div
      class="relative flex flex-col {alignmentClass} max-w-2xl mx-auto p-6 w-full"
    >
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
        on:input={handleQuoteInput}
        on:keydown={handleKeyDown}
        data-placeholder="Enter your quote..."
      >{$quoteText}</blockquote>

      <div class="mt-6 flex items-center gap-4 w-full justify-center">
        <span class="h-px flex-1 max-w-12" style="background-color: {borderColor}"></span>
        <cite
          class="text-sm not-italic font-semibold outline-none min-h-[1.5em]"
          style="color: {accentColor}"
          contenteditable={editable}
          on:input={handleAuthorInput}
          on:keydown={handleKeyDown}
          data-field="author"
          data-placeholder="Author"
        >{$authorName}</cite>
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
            style="color: {quoteMarkColor}"
          >"</span>
        {/if}
        <blockquote
          class="text-2xl md:text-3xl lg:text-4xl leading-tight font-medium relative z-10 outline-none min-h-[1.5em]"
          contenteditable={editable}
          on:input={handleQuoteInput}
          on:keydown={handleKeyDown}
          data-placeholder="Enter your quote..."
        >{$quoteText}</blockquote>
      </div>
      <div class="mt-8 pt-4" style="border-top: 2px solid {borderColor}">
        <cite
          class="text-base not-italic font-bold outline-none min-h-[1.5em]"
          contenteditable={editable}
          on:input={handleAuthorInput}
          on:keydown={handleKeyDown}
          data-field="author"
          data-placeholder="Author"
        >{$authorName}</cite>
      </div>
    </div>
  {/if}

  <!-- Modern Style -->
  {#if theme.quoteStyle === 'modern'}
    <div
      class="relative flex flex-col {alignmentClass} max-w-2xl mx-auto w-full"
    >
      <div class="flex gap-4">
        {#if $showQuoteMarks}
          <span
            class="text-5xl leading-none font-bold shrink-0"
            style="color: {quoteMarkColor}"
          >"</span>
        {/if}
        <div class="flex flex-col">
          <blockquote
            class="text-lg md:text-xl leading-relaxed outline-none min-h-[1.5em]"
            contenteditable={editable}
            on:input={handleQuoteInput}
            on:keydown={handleKeyDown}
            data-placeholder="Enter your quote..."
          >{$quoteText}</blockquote>
          <cite
            class="mt-4 text-sm not-italic font-medium flex items-center gap-2 outline-none min-h-[1.5em]"
            style="color: {accentColor}"
            contenteditable={editable}
            on:input={handleAuthorInput}
            on:keydown={handleKeyDown}
            data-field="author"
            data-placeholder="Author"
          >
            <span class="w-6 h-0.5 rounded-full" style="background-color: {quoteMarkColor}"></span>
            {$authorName}
          </cite>
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
</style>
