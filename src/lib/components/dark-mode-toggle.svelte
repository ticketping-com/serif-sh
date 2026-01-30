<script lang="ts">
  import { darkMode } from '$lib/stores';
  import { browser } from '$app/environment';

  function toggle() {
    darkMode.update(v => {
      const newValue = !v;
      if (browser) {
        document.body.classList.toggle('dark', newValue);
      }
      return newValue;
    });
  }

  // Initialize body class on mount
  $: if (browser) {
    document.body.classList.toggle('dark', $darkMode);
  }
</script>

<button
  class="flex items-center justify-center w-8 h-8 bg-parchment-100/80 dark:bg-white/10 border border-parchment-300/50 dark:border-white/10 rounded-lg cursor-pointer transition-all duration-150 hover:bg-parchment-200/80 dark:hover:bg-white/15"
  on:click={toggle}
  aria-label={$darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
>
  {#if $darkMode}
    <!-- Sun icon -->
    <svg class="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  {:else}
    <!-- Moon icon -->
    <svg class="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  {/if}
</button>
