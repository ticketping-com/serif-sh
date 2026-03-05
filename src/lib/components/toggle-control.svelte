<script lang="ts">
  import type { Writable } from 'svelte/store'

  export let store: Writable<boolean>
  export let label: string
</script>

<div class="flex flex-col gap-1.5">
  <span class="text-[10px] font-medium uppercase tracking-wide opacity-50 whitespace-nowrap"
    >{label}</span
  >
  <div class="flex items-center h-8">
    <button
      class="relative w-10 h-6 p-0.5 bg-black/8 dark:bg-white/10 border border-black/10 dark:border-white/10 rounded-full cursor-pointer transition-all duration-200 [&.active]:bg-parchment-500 [&.active]:border-parchment-500 dark:[&.active]:bg-parchment-400 dark:[&.active]:border-parchment-400"
      class:active={$store}
      on:click={() => store.update((v) => !v)}
      role="switch"
      aria-checked={$store}
      aria-label="Toggle {label}"
    >
      <span
        class="block size-4.5 bg-white rounded-full transition-transform duration-200 shadow-[0_1px_2px_rgba(0,0,0,0.2)] {$store
          ? 'translate-x-4.5'
          : ''}"
      ></span>
    </button>
  </div>
</div>
