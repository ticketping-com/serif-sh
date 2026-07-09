<script lang="ts">
  import { activeTextPicker, customQuoteColor, customAuthorColor, selectedTheme } from '$lib/stores'
  import ColorPickerPanel from './color-picker-panel.svelte'
  import CrossIcon from '$lib/components/icons/cross.svelte'

  let popupX = 0
  let popupY = 0
  let lastPickerId: string | null = null
  
  $: if ($activeTextPicker) {
    const id = `${$activeTextPicker.type}-${$activeTextPicker.x}-${$activeTextPicker.y}`
    if (lastPickerId !== id) {
      lastPickerId = id
      popupX = Math.max(20, $activeTextPicker.x - 280)
      popupY = Math.max(20, $activeTextPicker.y - 100)
    }
  } else {
    lastPickerId = null
  }

  let isDragging = false
  let startX = 0
  let startY = 0

  function handleMousedown(e: MouseEvent) {
    if (!(e.target as HTMLElement).closest('.drag-handle')) return
    isDragging = true
    startX = e.clientX
    startY = e.clientY
    window.addEventListener('pointermove', handleMousemove)
    window.addEventListener('pointerup', handleMouseup)
  }

  function handleMousemove(e: MouseEvent) {
    if (!isDragging) return
    const dx = e.clientX - startX
    const dy = e.clientY - startY
    startX = e.clientX
    startY = e.clientY
    popupX += dx
    popupY += dy
  }

  function handleMouseup() {
    isDragging = false
    window.removeEventListener('pointermove', handleMousemove)
    window.removeEventListener('pointerup', handleMouseup)
  }

  function closeColorPicker() {
    activeTextPicker.set(null)
  }
</script>

{#if $activeTextPicker}
  <button
    type="button"
    class="fixed inset-0 w-full h-full cursor-default z-[99]"
    aria-label="Close color picker"
    on:click={closeColorPicker}
  ></button>
  <div
    class="fixed w-[250px] bg-parchment-50 border border-black/10 rounded-xl shadow-2xl p-3 z-[100]"
    style="left: {popupX}px; top: {popupY}px;"
    on:pointerdown={handleMousedown}
    role="presentation"
    on:click|stopPropagation
    on:keydown|stopPropagation
  >
    <div
      class="flex items-center justify-between mb-2 drag-handle cursor-move -mx-3 -mt-3 p-3 pb-2 rounded-t-xl hover:bg-black/5 transition-colors"
    >
      <div class="text-sm text-ink-400 font-semibold pointer-events-none">
        {$activeTextPicker.type === 'quote' ? 'Quote Color' : 'Author Color'}
      </div>
      <button
        class="group relative p-1 rounded hover:bg-parchment-200 transition-colors text-ink-500 hover:text-ink-700"
        on:click={closeColorPicker}
        title="Close picker"
      >
        <CrossIcon
          class="size-5 text-ink-400 group-hover:text-ink-500 transition-colors duration-150"
        />
      </button>
    </div>

    {#if $activeTextPicker.type === 'quote'}
      <ColorPickerPanel
        hex={$customQuoteColor || $selectedTheme.text}
        showOpacity={false}
        on:change={(e) => ($customQuoteColor = e.detail.hex)}
      />
    {:else}
      <ColorPickerPanel
        hex={$customAuthorColor || $selectedTheme.accent || $selectedTheme.text}
        showOpacity={false}
        on:change={(e) => ($customAuthorColor = e.detail.hex)}
      />
    {/if}
  </div>
{/if}
