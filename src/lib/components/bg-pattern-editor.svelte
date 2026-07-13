<script lang="ts">
  import { fade } from 'svelte/transition';
  import { customBgConfig, customBgStyle, getPatternCSS } from '$lib/stores/custom-bg';
  import { selectedTheme } from '$lib/stores/settings';
  import SquareCursorIcon from './icons/square-cursor.svelte';
  import EyeIcon from './icons/eye.svelte';
  import BidirectionalSlider from './bidirectional-slider.svelte';

  let showPatternSelector = false;

  const patternsList = [
    { id: 'dots', name: 'Polka Dots' },
    { id: 'grid', name: 'Grid' },
    { id: 'blueprint', name: 'Blueprint Grid' },
    { id: 'top-fade-grid', name: 'Top Fade Grid' },
    { id: 'bottom-fade-grid', name: 'Bottom Fade Grid' },
    { id: 'diagonal-fade-grid-left', name: 'Diagonal Fade Grid Left' },
    { id: 'diagonal-fade-grid-right', name: 'Diagonal Fade Grid Right' },
    { id: 'diagonal-fade-bottom-grid-Left', name: 'Diagonal Fade Bottom Grid Left' },
    { id: 'diagonal-fade-bottom-grid-right', name: 'Diagonal Fade Bottom Grid Right' },
    { id: 'diagonal-fade-center-grid', name: 'Diagonal Fade Center Grid' },
    { id: 'diagonal-cross-grid', name: 'Diagonal Cross Grid' },
    { id: 'diagonal-cross-grid-top', name: 'Diagonal Cross Grid Top' },
    { id: 'diagonal-cross-grid-bottom', name: 'Diagonal Cross Grid Bottom' },
    { id: 'diagonal-cross-top-right-fade-grid', name: 'Diagonal Cross Top Right Fade Grid' },
    { id: 'diagonal-cross-top-left-fade-grid', name: 'Diagonal Cross Top Left Fade Grid' },
    { id: 'diagonal-cross-Bottom-right-fade-grid', name: 'Diagonal Cross Bottom Right Fade Grid' },
    { id: 'diagonal-cross-Bottom-left-fade-grid', name: 'Diagonal Cross Bottom Left Fade Grid' },
    { id: 'diagonal-cross-center-fade-grid', name: 'Diagonal Cross Center Fade Grid' },
    { id: 'dashed-grid-light', name: 'Dashed Grid Light' },
    { id: 'dashed-top-fade-grid', name: 'Dashed Top Fade Grid' },
    { id: 'dashed-bottom-fade-grid', name: 'Dashed Bottom Fade Grid' }
  ] as const;

  function enableCustomBg() {
    if (!$customBgConfig.enabled) {
      customBgConfig.update((c) => {
        c.enabled = true
        return c
      })
    }
  }

  function setPattern(source: typeof $customBgConfig.pattern.source) {
    enableCustomBg()
    customBgConfig.update((c) => {
      c.pattern.source = source
      c.pattern.scale = 100
      c.pattern.enabled = true
      return c
    })
    showPatternSelector = false
  }

  function handlePatternScaleInput(val: number) {
    enableCustomBg()
    customBgConfig.update((c) => {
      c.pattern.scale = Math.max(10, Math.min(300, val))
      c.pattern.enabled = true
      return c
    })
  }
</script>

<div class="p-3 space-y-3 shrink-0">
  <div class="relative w-full h-[300px] rounded-lg overflow-hidden flex items-center justify-center flex-col card-shadow" style="background: {$selectedTheme.backgroundImage || $selectedTheme.background};">
    <div class="absolute inset-0 opacity-50" style="{$customBgStyle}"></div>
    <div class="relative z-10 flex flex-col items-center">
      <button class="px-3 py-1.5 bg-ink-950 hover:bg-ink-900 text-ink-400 group-hover:text-ink-500 font-medium rounded-md shadow-md flex items-center gap-1.5 transition-all text-xs cursor-pointer" on:click={() => (showPatternSelector = !showPatternSelector)}>
        <SquareCursorIcon class="size-4 transition-colors duration-150" />
        <span>Select source...</span>
      </button>
    </div>

    {#if showPatternSelector}
      <div class="absolute inset-0 bg-white/95 border border-black/10 rounded-lg p-2 overflow-y-auto scrollbar-none flex flex-col gap-2 z-50 shadow-xl" transition:fade={{ duration: 100 }}>
        <div class="text-sm text-ink-900 font-semibold text-center mx-4 mb-1 px-1 sticky top-0 bg-parchment-50/50 backdrop-blur z-20 py-1 rounded-md card-shadow">
          SVG Patterns
        </div>
        <div class="flex flex-col gap-4 p-4">
          {#each patternsList as pattern}
            <button
              class="group relative overflow-hidden text-left h-49 rounded-lg transition-colors flex items-center justify-center p-4 {$customBgConfig.pattern.source === pattern.id ? 'ring-2 ring-ink-300 shadow-custom' : 'card-shadow'}"
              style={$customBgConfig.enabled ? $customBgStyle : `background: ${$selectedTheme.backgroundImage || $selectedTheme.background}`}
              on:click={() => setPattern(pattern.id)}
            >
              <div class="absolute inset-0 z-0 pointer-events-none" style="{getPatternCSS(pattern.id, 'rgba(0,0,0,0.15)', 'rgba(0,0,0,0.06)', 0.6)} background-repeat: repeat;"></div>
              <div class="relative z-10 flex flex-col items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                <span class="text-center text-base text-ink-900 font-semibold select-none">{pattern.name}</span>
                <span class="px-6 py-1.5 bg-ink-950 hover:bg-ink-900 text-white font-medium rounded-md shadow-md flex items-center gap-1.5 transition-all text-xs cursor-pointer">
                  <EyeIcon class="size-4 transition-colors duration-150" />
                  <span>Preview</span>
                </span>
              </div>
            </button>
          {/each}
        </div>
      </div>
    {/if}
  </div>

  <div class="space-y-3 pt-1 text-xs">
    <div class="grid grid-cols-[80px_1fr] items-center">
      <span class="text-ink-500 font-semibold text-sm">Scale</span>
      <BidirectionalSlider min={0} max={200} value={$customBgConfig.pattern.scale} on:input={(e) => handlePatternScaleInput(e.detail)} />
    </div>
  </div>
</div>
