<script lang="ts">
  import TicketpingLogoMark from './icons/ticketping-logo-mark.svelte'
  import TicketpingWordmark from './icons/ticketping-wordmark.svelte'

  export let open = false

  function close() {
    open = false
  }

  function handleBackdropClick(e: MouseEvent) {
    if (e.target === e.currentTarget) close()
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') close()
  }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if open}
  <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
  <div
    class="fixed inset-0 z-200 flex items-center justify-center p-4"
    on:click={handleBackdropClick}
  >
    <div class="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>

    <div
      class="modal relative w-full max-w-md rounded-2xl border border-parchment-300 bg-parchment-50 text-ink-900 shadow-2xl overflow-hidden"
    >
      <button
        class="absolute top-4 right-4 flex h-7 w-7 items-center justify-center rounded-lg text-ink-400 transition hover:bg-parchment-200 hover:text-ink-800"
        on:click={close}
        aria-label="Close"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 1L13 13M1 13L13 1"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
          />
        </svg>
      </button>

      <div class="p-6 pb-5">
        <h2 class="text-base font-semibold mb-3">About</h2>
        <div class="space-y-3 text-sm leading-relaxed text-ink-600">
          <p>serif.sh is a tool to create beautiful, shareable images of your favorite quotes.</p>
          <p>
            Pick a theme from a range of styles and backgrounds, customize the font, alignment, and
            padding.
          </p>
          <p>
            When you're ready, click export to save the image as a PNG, SVG or copy it to your
            clipboard.
          </p>
          <p>
            If you have any questions or feedback, write to us on <a
              href="https://x.com/ticketpingcom"
              target="_blank"
              rel="noopener noreferrer"
              class="underline text-ink-800 hover:text-ink-900 transition-colors">X</a
            >
            or
            <a
              href="mailto:ravi@ticketping.com"
              class="underline text-ink-800 hover:text-ink-900 transition-colors">email us</a
            >.
          </p>
        </div>
      </div>

      <div class="flex items-center justify-between border-t border-parchment-200 px-6 py-4">
        <a
          href="https://ticketping.com"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-2 no-underline text-ink-400 transition hover:text-ink-700"
        >
          <div class="flex items-center justify-center [&>svg]:w-6 [&>svg]:h-6">
            <TicketpingLogoMark ariaLabel="Ticketping logo" />
          </div>
          <span class="text-xs">Made by Ticketping</span>
        </a>

        <a
          href="https://x.com/ticketpingcom"
          target="_blank"
          rel="noopener noreferrer"
          class="flex h-7 w-7 items-center justify-center rounded-lg text-ink-400 transition hover:bg-parchment-200 hover:text-ink-800"
          aria-label="Follow on X"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
            />
          </svg>
        </a>
      </div>
    </div>
  </div>
{/if}

<style>
  .modal {
    animation: modal-in 0.2s ease-out;
  }

  @keyframes modal-in {
    from {
      opacity: 0;
      transform: scale(0.95) translateY(8px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
</style>
