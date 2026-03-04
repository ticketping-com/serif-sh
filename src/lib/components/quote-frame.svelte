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

  {#if theme.quoteStyle === 'aura' && $showBackground}
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

  <div class="quote-content" style="color: {textColor}">
    {@render quoteContent()}
  </div>
</div>

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
      {#if $showQuoteMarks}
        <svg
          width="40"
          height="29"
          viewBox="0 0 40 29"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="w-10 h-10 mb-8 shrink-0"
        >
          <path
            d="M15.0225 15.7243C12.3947 13.2525 8.31954 12.7186 5.69977 15.0925C6.79979 11.2247 9.74602 7.28017 12.6746 4.45565C15.0949 2.12093 11.4298 -1.59014 9.01429 0.739687C3.12182 6.41975 -3.58761 17.1562 2.24374 25.1187C4.89567 28.7384 10.2253 30.371 14.0833 27.6184C17.8996 24.8951 18.514 19.0093 15.0225 15.7243ZM37.6982 15.7243C35.0704 13.2525 30.9952 12.7186 28.3755 15.0925C29.4755 11.2247 32.4217 7.28017 35.3503 4.45565C37.7706 2.12093 34.1055 -1.59014 31.69 0.739687C25.7975 6.42138 19.0881 17.1578 24.921 25.1187C27.573 28.7384 32.9026 30.371 36.7607 27.6184C40.5753 24.8951 41.1897 19.0093 37.6982 15.7243Z"
            fill={quoteMarkColor}
          />
        </svg>
      {/if}

      <blockquote
        class="text-xl md:text-2xl font-normal italic leading-relaxed outline-none min-h-[1.5em] w-full"
        contenteditable={editable}
        use:editableQuote
        on:keydown={handleKeyDown}
        data-placeholder="Enter your quote..."
      ></blockquote>

      <div class="w-full h-px mt-12 mb-6" style="background-color: {borderColor};"></div>

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
    </div>
  {/if}

  <!-- Breeze theme -->
  {#if theme.quoteStyle === 'breeze'}
    <div
      class="relative z-10 flex flex-col w-full max-w-3xl mx-auto p-4 md:p-8 rounded-xl md:rounded-3xl card-shadow"
      style="background-color: {theme.cardBackground || bg};"
    >
      <div class="relative z-10 flex flex-col min-h-50 {alignmentClass}">
        {#if $showQuoteMarks}
          <svg
            width="35"
            height="28"
            viewBox="0 0 35 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="w-10 h-10 mb-4 md:mb-8 shrink-0"
          >
            <path
              d="M7.45677 12.1032C6.68258 12.1032 5.98968 12.1394 5.36774 12.2065C6.40258 7.97161 8.88645 6.00516 12.5045 4.41935L10.5665 0C6.96387 1.58065 4.60516 3.39097 2.91613 5.87226C0.954839 8.75613 0 12.5458 0 17.4606V19.5845C0 23.6916 0.0141936 27.0168 7.45677 27.0168C14.9135 27.0168 14.9135 23.6787 14.9135 19.56C14.9135 15.4426 14.9613 12.1032 7.45677 12.1032ZM27.0697 12.1032C26.2955 12.1032 25.6026 12.1394 24.9806 12.2065C26.0155 7.97161 28.4994 6.00516 32.1174 4.41935L30.1794 0C26.5768 1.58065 24.2181 3.39097 22.529 5.87226C20.5677 8.75613 19.6129 12.5458 19.6129 17.4606V19.5845C19.6129 23.6916 19.6271 27.0168 27.0697 27.0168C34.5265 27.0168 34.5265 23.6787 34.5265 19.56C34.5265 15.4426 34.5742 12.1032 27.0697 12.1032Z"
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
        class="w-full h-px mt-5 md:mt-10 mb-3 md:mb-6"
        style="background-color: {borderColor};"
      ></div>

      <cite
        class="text-base font-medium uppercase tracking-wider outline-none min-h-[1.5em] mr-4"
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

  <!-- Aura theme -->
  {#if theme.quoteStyle === 'aura'}
    <div
      class="relative z-10 flex flex-col w-full max-w-3xl mx-auto p-4 md:p-8 rounded-xl md:rounded-3xl card-shadow"
      style="background-color: {theme.cardBackground || bg};"
    >
      <div class="relative z-10 flex flex-col min-h-50 {alignmentClass}">
        {#if $showQuoteMarks}
          <svg
            width="35"
            height="28"
            viewBox="0 0 35 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="w-10 h-10 mb-4 md:mb-8 shrink-0"
          >
            <path
              d="M7.45677 12.1032C6.68258 12.1032 5.98968 12.1394 5.36774 12.2065C6.40258 7.97161 8.88645 6.00516 12.5045 4.41935L10.5665 0C6.96387 1.58065 4.60516 3.39097 2.91613 5.87226C0.954839 8.75613 0 12.5458 0 17.4606V19.5845C0 23.6916 0.0141936 27.0168 7.45677 27.0168C14.9135 27.0168 14.9135 23.6787 14.9135 19.56C14.9135 15.4426 14.9613 12.1032 7.45677 12.1032ZM27.0697 12.1032C26.2955 12.1032 25.6026 12.1394 24.9806 12.2065C26.0155 7.97161 28.4994 6.00516 32.1174 4.41935L30.1794 0C26.5768 1.58065 24.2181 3.39097 22.529 5.87226C20.5677 8.75613 19.6129 12.5458 19.6129 17.4606V19.5845C19.6129 23.6916 19.6271 27.0168 27.0697 27.0168C34.5265 27.0168 34.5265 23.6787 34.5265 19.56C34.5265 15.4426 34.5742 12.1032 27.0697 12.1032Z"
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
        class="w-full h-px mt-5 md:mt-10 mb-3 md:mb-6"
        style="background-color: {borderColor};"
      ></div>

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
    </div>
  {/if}

  <!-- Noir theme -->
  {#if theme.quoteStyle === 'noir'}
    <div
      class="relative flex flex-col w-full max-w-2xl mx-auto p-2 md:p-8 {alignmentClass}"
      style="background-color: {theme.background};"
    >
      {#if $showQuoteMarks}
        <svg
          width="40"
          height="29"
          viewBox="0 0 40 29"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="w-10 h-10 mb-8 shrink-0"
        >
          <path
            d="M15.0225 15.7243C12.3947 13.2525 8.31954 12.7186 5.69977 15.0925C6.79979 11.2247 9.74602 7.28017 12.6746 4.45565C15.0949 2.12093 11.4298 -1.59014 9.01429 0.739687C3.12182 6.41975 -3.58761 17.1562 2.24374 25.1187C4.89567 28.7384 10.2253 30.371 14.0833 27.6184C17.8996 24.8951 18.514 19.0093 15.0225 15.7243ZM37.6982 15.7243C35.0704 13.2525 30.9952 12.7186 28.3755 15.0925C29.4755 11.2247 32.4217 7.28017 35.3503 4.45565C37.7706 2.12093 34.1055 -1.59014 31.69 0.739687C25.7975 6.42138 19.0881 17.1578 24.921 25.1187C27.573 28.7384 32.9026 30.371 36.7607 27.6184C40.5753 24.8951 41.1897 19.0093 37.6982 15.7243Z"
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
    </div>
  {/if}

  <!-- Glass theme -->
  {#if theme.quoteStyle === 'glass'}
    <div
      class="relative z-10 flex flex-col w-full max-w-3xl mx-auto p-4 md:p-8 rounded-xl md:rounded-3xl glassmorphism"
    >
      <div class="relative z-10 flex flex-col min-h-50 {alignmentClass}">
        {#if $showQuoteMarks}
          <svg
            width="35"
            height="28"
            viewBox="0 0 35 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="w-10 h-10 mb-4 md:mb-8 shrink-0"
          >
            <path
              d="M7.45677 12.1032C6.68258 12.1032 5.98968 12.1394 5.36774 12.2065C6.40258 7.97161 8.88645 6.00516 12.5045 4.41935L10.5665 0C6.96387 1.58065 4.60516 3.39097 2.91613 5.87226C0.954839 8.75613 0 12.5458 0 17.4606V19.5845C0 23.6916 0.0141936 27.0168 7.45677 27.0168C14.9135 27.0168 14.9135 23.6787 14.9135 19.56C14.9135 15.4426 14.9613 12.1032 7.45677 12.1032ZM27.0697 12.1032C26.2955 12.1032 25.6026 12.1394 24.9806 12.2065C26.0155 7.97161 28.4994 6.00516 32.1174 4.41935L30.1794 0C26.5768 1.58065 24.2181 3.39097 22.529 5.87226C20.5677 8.75613 19.6129 12.5458 19.6129 17.4606V19.5845C19.6129 23.6916 19.6271 27.0168 27.0697 27.0168C34.5265 27.0168 34.5265 23.6787 34.5265 19.56C34.5265 15.4426 34.5742 12.1032 27.0697 12.1032Z"
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
        class="w-full h-px mt-5 md:mt-10 mb-3 md:mb-6"
        style="background-color: {borderColor};"
      ></div>

      <cite
        class="text-base font-medium uppercase tracking-wider outline-none min-h-[1.5em] mr-4"
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

  <!-- Claude terminal theme -->
  {#if theme.quoteStyle === 'claude-code'}
    <div
      class="relative z-10 flex flex-col w-full max-w-3xl mx-auto p-4 rounded-md md:rounded-lg card-shadow"
      style="background-color: {theme.cardBackground || bg}; "
    >
      <div class="flex gap-2 mb-8">
        <div class="w-3.5 h-3.5 rounded-full bg-[#FF5F56]"></div>
        <div class="w-3.5 h-3.5 rounded-full bg-[#FFBD2E]"></div>
        <div class="w-3.5 h-3.5 rounded-full bg-[#27C93F]"></div>
      </div>

      <div class="relative z-10 flex flex-col min-h-50 {alignmentClass}">
        {#if $showQuoteMarks}
          <svg
            width="34"
            height="27"
            viewBox="0 0 34 27"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="w-10 h-10 mb-4 md:mb-8 shrink-0"
          >
            <path
              d="M10.1084 0L0 13.4787V26.9574H13.4774V13.4787H6.73806L13.9587 3.85161L10.1084 0ZM33.6594 3.85161L29.809 0L19.7006 13.4787V26.9574H33.1781V13.4787H26.4387L33.6594 3.85161Z"
              fill={quoteMarkColor}
            />
          </svg>
        {/if}

        <blockquote
          class="text-xl md:text-2xl font-light leading-snug outline-none min-h-[1.5em] w-full"
          contenteditable={editable}
          use:editableQuote
          on:keydown={handleKeyDown}
          data-placeholder="Enter your quote..."
        ></blockquote>
      </div>

      <div class="flex items-center h-8 w-full mt-8">
        <span class="mr-3 font-bold text-lg select-none" style="color: {accentColor}">&gt;</span>
        <cite
          class="text-base font-medium not-italic uppercase tracking-wider outline-none min-h-[1.5em] mr-4"
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
