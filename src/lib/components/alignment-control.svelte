<script lang="ts">
  import { alignment } from '$lib/stores';
  import type { Alignment } from '$lib/themes';

  const alignments: { id: Alignment; label: string }[] = [
    { id: 'left', label: 'Align left' },
    { id: 'center', label: 'Align center' },
    { id: 'right', label: 'Align right' },
  ];
</script>

<div class="flex flex-col gap-1.5">
  <span class="text-[10px] font-medium uppercase tracking-wide opacity-50">Align</span>
  <div class="flex items-center gap-0.5 h-8 px-0.5 bg-black/3 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg">
    {#each alignments as align}
      <button
        class="flex items-center justify-center py-1 px-1.5 bg-transparent border-none rounded-md cursor-pointer transition-all duration-150 opacity-50 hover:opacity-80 hover:bg-black/6 dark:hover:bg-white/10 [&.active]:opacity-100 [&.active]:bg-black/10 dark:[&.active]:bg-white/15 [&>svg]:w-4 [&>svg]:h-4"
        class:active={$alignment === align.id}
        on:click={() => alignment.set(align.id)}
        title={align.label}
        aria-label={align.label}
      >
        {#if align.id === 'left'}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="15" y2="12"/>
            <line x1="3" y1="18" x2="18" y2="18"/>
          </svg>
        {:else if align.id === 'center'}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="6" y1="12" x2="18" y2="12"/>
            <line x1="4" y1="18" x2="20" y2="18"/>
          </svg>
        {:else}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="9" y1="12" x2="21" y2="12"/>
            <line x1="6" y1="18" x2="21" y2="18"/>
          </svg>
        {/if}
      </button>
    {/each}
  </div>
</div>
