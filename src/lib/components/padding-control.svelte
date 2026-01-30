<script lang="ts">
  import { padding } from '$lib/stores';
  import { PADDING_PRESETS } from '$lib/themes';
</script>

<div class="flex flex-col gap-1.5">
  <span class="text-[10px] font-medium uppercase tracking-wide opacity-50">Padding</span>
  <div class="flex items-center gap-0.5 h-8 px-0.5 bg-black/3 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg">
    {#each PADDING_PRESETS as preset}
      <button
        class="py-1 px-1.5 text-[11px] font-medium bg-transparent border-none rounded-md cursor-pointer transition-all duration-150 opacity-50 hover:opacity-80 hover:bg-black/6 dark:hover:bg-white/10 [&.active]:opacity-100 [&.active]:bg-black/10 dark:[&.active]:bg-white/15"
        class:active={$padding === preset}
        on:click={() => padding.set(preset)}
      >
        {preset}
      </button>
    {/each}
  </div>
</div>
