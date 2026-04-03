<script lang="ts">
  import { fade, fly } from 'svelte/transition';

  let {
    message = '',
    type = 'info',
    duration = 3000,
    onClose = () => {}
  }: {
    message?: string
    type?: 'success' | 'error' | 'info'
    duration?: number
    onClose?: () => void
  } = $props()

  // Reset dismiss timer when copy or duration changes (onMount alone left a stale timer).
  $effect(() => {
    // track dependencies explicitly
    const m = message;
    const t = type;
    const d = duration;
    
    if (m) {
      const id = setTimeout(() => {
        onClose();
      }, d);
      return () => clearTimeout(id);
    }
  })
</script>

<div
  class="fixed bottom-4 right-4 z-50"
  in:fly={{ y: 20, duration: 200 }}
  out:fade={{ duration: 150 }}
>
  <div
    class="px-4 py-3 rounded-lg shadow-lg flex items-center gap-3
      {type === 'success' ? 'bg-green-800 text-green-100' : ''}
      {type === 'error' ? 'bg-red-800 text-red-100' : ''}
      {type === 'info'
      ? 'bg-ink-900 text-parchment-50 dark:bg-parchment-100 dark:text-ink-900'
      : ''}"
  >
    {#if type === 'success'}
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>
    {:else if type === 'error'}
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    {:else}
      <svg class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
    {/if}
    <span class="text-sm font-medium">{message}</span>
  </div>
</div>
