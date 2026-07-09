<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { parse, formatHex, converter } from 'culori'
  import ColorInputs from './color-inputs.svelte'

  export let hex: string = '#000000'
  export let opacity: number = 100
  export let showOpacity: boolean = true

  const dispatch = createEventDispatcher<{
    change: { hex: string, opacity: number }
  }>()

  // Internal HSV state
  let h = 0
  let s = 0
  let v = 0

  // Init HSV from hex
  $: {
    const c = parse(hex)
    if (c && c.mode === 'rgb') {
      const hsvConverter = converter('hsv')
      const hsv = hsvConverter(c)
      if (hsv) {
        h = hsv.h || 0
        s = (hsv.s || 0) * 100
        v = (hsv.v || 0) * 100
      }
    }
  }

  function emitChange() {
    const rgbConverter = converter('rgb')
    const rgb = rgbConverter({ mode: 'hsv', h, s: s / 100, v: v / 100 })
    if (rgb) {
      const newHex = formatHex(rgb)
      dispatch('change', { hex: newHex, opacity })
    }
  }

  let colorAreaEl: HTMLDivElement
  let hueSliderEl: HTMLDivElement
  let opacitySliderEl: HTMLDivElement
  let isDraggingColor = false
  let isDraggingHue = false
  let isDraggingOpacity = false

  function updateColor(clientX: number, clientY: number) {
    if (!colorAreaEl) return
    const rect = colorAreaEl.getBoundingClientRect()
    let x = (clientX - rect.left) / rect.width
    let y = (clientY - rect.top) / rect.height
    s = Math.max(0, Math.min(100, x * 100))
    v = Math.max(0, Math.min(100, (1 - y) * 100))
    emitChange()
  }

  function updateHue(clientX: number) {
    if (!hueSliderEl) return
    const rect = hueSliderEl.getBoundingClientRect()
    let x = (clientX - rect.left) / rect.width
    h = Math.max(0, Math.min(360, x * 360))
    emitChange()
  }

  function updateOpacityFromPos(clientX: number) {
    if (!opacitySliderEl) return
    const rect = opacitySliderEl.getBoundingClientRect()
    let x = (clientX - rect.left) / rect.width
    opacity = Math.max(0, Math.min(100, x * 100))
    emitChange()
  }
</script>

<div class="space-y-2 select-none">
  <!-- Color Area -->
  <div
    bind:this={colorAreaEl}
    class="relative w-full h-[200px] rounded-lg cursor-crosshair card-shadow overflow-hidden"
    style="background: linear-gradient(to bottom, transparent, #000), linear-gradient(to right, #fff, hsl({h}, 100%, 50%));"
    on:pointerdown={(e) => { isDraggingColor = true; colorAreaEl.setPointerCapture(e.pointerId); updateColor(e.clientX, e.clientY); }}
    on:pointermove={(e) => { if (isDraggingColor) updateColor(e.clientX, e.clientY); }}
    on:pointerup={(e) => { isDraggingColor = false; colorAreaEl.releasePointerCapture(e.pointerId); }}
  >
    <div
      class="absolute w-4 h-4 rounded-full border-4 border-parchment-100 bg-transparent pointer-events-none card-shadow flex items-center justify-center"
      style="left: calc({s}% - {(s / 100) * 16}px); top: calc({100 - v}% - {((100 - v) / 100) * 16}px);"
    >
      <div class="size-2 rounded-full" style="background-color: {hex};"></div>
    </div>
  </div>

  <div class="flex items-center gap-2 pt-1">
    <div class="flex-1 space-y-2">
      <!-- Hue Slider -->
      <div
        bind:this={hueSliderEl}
        class="relative h-4 rounded-full cursor-pointer card-shadow"
        style="background: linear-gradient(to right, red, yellow, green, cyan, blue, magenta, red);"
        on:pointerdown={(e) => { isDraggingHue = true; hueSliderEl.setPointerCapture(e.pointerId); updateHue(e.clientX); }}
        on:pointermove={(e) => { if (isDraggingHue) updateHue(e.clientX); }}
        on:pointerup={(e) => { isDraggingHue = false; hueSliderEl.releasePointerCapture(e.pointerId); }}
      >
        <div
          class="absolute w-4 h-4 rounded-full border-4 border-parchment-100 bg-transparent pointer-events-none card-shadow flex items-center justify-center"
          style="left: calc({(h / 360) * 100}% - {(h / 360) * 16}px);"
        >
          <div class="size-2 rounded-full" style="background-color: hsl({h}, 100%, 50%);"></div>
        </div>
      </div>

      <!-- Opacity Slider -->
      {#if showOpacity}
        <div
          bind:this={opacitySliderEl}
          class="relative h-4 rounded-full cursor-pointer checkerboard card-shadow overflow-hidden"
          on:pointerdown={(e) => { isDraggingOpacity = true; opacitySliderEl.setPointerCapture(e.pointerId); updateOpacityFromPos(e.clientX); }}
          on:pointermove={(e) => { if (isDraggingOpacity) updateOpacityFromPos(e.clientX); }}
          on:pointerup={(e) => { isDraggingOpacity = false; opacitySliderEl.releasePointerCapture(e.pointerId); }}
        >
          <div class="absolute inset-0 w-full h-full rounded-full" style="background: linear-gradient(to right, transparent, {hex});"></div>
          <div
            class="absolute w-4 h-4 rounded-full border-4 border-parchment-100 bg-transparent pointer-events-none card-shadow flex items-center justify-center"
            style="left: calc({opacity}% - {(opacity / 100) * 16}px);"
          >
            <div class="size-2 rounded-full" style="background-color: {hex}; opacity: {opacity / 100};"></div>
          </div>
        </div>
      {/if}
    </div>
  </div>

  <ColorInputs
    {hex}
    {opacity}
    {showOpacity}
    on:hexChange={(e) => { 
      dispatch('change', { hex: e.detail.hex, opacity });
    }}
    on:opacityChange={(e) => {
      dispatch('change', { hex, opacity: e.detail.opacity });
    }}
  />
</div>
