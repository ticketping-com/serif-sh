<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  export let min = 0
  export let max = 200
  export let value = 100

  const dispatch = createEventDispatcher<{ input: number }>()

  $: centerValue = (min + max) / 2
  $: percentage = ((value - min) / (max - min)) * 100

  $: isNegative = value < centerValue
  $: fillWidth = Math.abs(percentage - 50)
  $: fillLeft = isNegative ? percentage : 50

  function handleInput(e: Event) {
    const val = parseFloat((e.target as HTMLInputElement).value)
    value = val
    dispatch('input', val)
  }
</script>

<div class="relative w-full h-4 flex items-center group">
  <input
    type="range"
    {min}
    {max}
    step="1"
    class="absolute inset-0 w-full h-full opacity-0 z-20 cursor-pointer"
    {value}
    on:input={handleInput}
  />

  <!-- Track -->
  <div
    class="absolute w-full h-4 bg-parchment-50 border border-black/10 shadow-inner rounded-full overflow-hidden pointer-events-none"
  >
    {#if value !== centerValue}
      <div
        class="absolute h-full bg-parchment-300 rounded-full"
        style="left: {fillLeft}%; width: {fillWidth}%;"
      ></div>
    {/if}
  </div>

  <!-- Center Anchor Dot -->
  <div
    class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-2 bg-white rounded-full z-0 pointer-events-none shadow-sm border border-black/10"
  ></div>

  <!-- Thumb -->
  <div
    class="absolute top-1/2 -translate-y-1/2 size-4 bg-white border border-black/10 rounded-full shadow z-10 pointer-events-none flex items-center justify-center transition-transform"
    style="left: calc({percentage}% - {(percentage / 100) * 16}px);"
  >
    {#if value !== centerValue}
      <!-- Inner dot -->
      <div class="size-2 bg-parchment-300 rounded-full"></div>
    {/if}
  </div>
</div>
