<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { fly } from 'svelte/transition'
  import ColorPickerPanel from './color-picker-panel.svelte'
  import CrossIcon from '$lib/components/icons/cross.svelte'

  export let activeStop: { hex: string; opacity: number }

  const dispatch = createEventDispatcher<{
    close: void
    change: { hex: string; opacity: number }
  }>()

  let popupRightOffset = 290
  let popupTopOffset = 150
  let isDraggingPopup = false
  let popupDragStartX = 0
  let popupDragStartY = 0

  function handlePopupPointerDown(e: PointerEvent) {
    if (e.target instanceof HTMLElement && e.target.closest('button, input')) return
    isDraggingPopup = true
    popupDragStartX = e.clientX
    popupDragStartY = e.clientY
    if (e.target instanceof Element) e.target.setPointerCapture(e.pointerId)
  }

  function handlePopupPointerMove(e: PointerEvent) {
    if (!isDraggingPopup) return
    const dx = e.clientX - popupDragStartX
    const dy = e.clientY - popupDragStartY

    popupRightOffset -= dx
    popupTopOffset += dy

    popupDragStartX = e.clientX
    popupDragStartY = e.clientY
  }

  function handlePopupPointerUp(e: PointerEvent) {
    isDraggingPopup = false
    if (e.target instanceof Element && e.target.hasPointerCapture(e.pointerId)) {
      e.target.releasePointerCapture(e.pointerId)
    }
  }

  function close() {
    dispatch('close')
  }
</script>

<!-- Background overlay for the popup to catch clicks outside -->
<button
  type="button"
  class="fixed inset-0 w-full h-full cursor-default z-[45]"
  aria-label="Close color picker"
  on:click={close}
></button>

<div
  class="fixed w-[250px] bg-parchment-50 border border-black/10 rounded-xl shadow-2xl p-3 z-50 flex flex-col font-sans select-none"
  style="right: {popupRightOffset}px; top: {popupTopOffset}px;"
  transition:fly={{ x: 20, duration: 200 }}
  role="presentation"
  on:click|stopPropagation
  on:keydown|stopPropagation
>
  <div
    class="flex items-center justify-between mb-2 cursor-move -mx-3 -mt-3 p-3 pb-2 rounded-t-xl hover:bg-black/5 transition-colors"
    role="presentation"
    on:pointerdown={handlePopupPointerDown}
    on:pointermove={handlePopupPointerMove}
    on:pointerup={handlePopupPointerUp}
  >
    <div class="text-sm text-ink-400 font-semibold pointer-events-none">Stop Color</div>
    <button
      class="group relative p-1 rounded hover:bg-parchment-200 transition-colors text-ink-500 hover:text-ink-700 shrink-0"
      on:click={close}
      aria-label="Close color picker"
    >
      <CrossIcon
        class="size-5 text-ink-400 group-hover:text-ink-500 transition-colors duration-150"
      />
    </button>
  </div>

  <div class="space-y-2 relative">
    <ColorPickerPanel
      hex={activeStop.hex}
      opacity={activeStop.opacity}
      showOpacity={true}
      on:change={(e) => dispatch('change', e.detail)}
    />
  </div>
</div>
