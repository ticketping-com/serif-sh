<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { parse, formatHex, formatRgb, formatHsl, converter } from 'culori'
  import ChevronDown from '$lib/components/icons/chevron-down.svelte'

  export let hex: string = '#000000'
  export let opacity: number = 100
  export let showOpacity: boolean = true

  const dispatch = createEventDispatcher<{
    hexChange: { hex: string }
    opacityChange: { opacity: number }
  }>()

  type ColorFormat = 'HEX' | 'RGB' | 'HSL' | 'OKLCH'
  const FORMATS: ColorFormat[] = ['HEX', 'RGB', 'HSL', 'OKLCH']
  let format: ColorFormat = 'HEX'
  let showDropdown = false
  
  // converters
  const toOklch = converter('oklch')
  const toHsl = converter('hsl')
  const toRgb = converter('rgb')

  // Generate the display string based on current format
  $: displayValue = getDisplayValue(hex, format)

  function getDisplayValue(h: string, f: typeof format): string {
    const c = parse(h)
    if (!c) return h
    
    if (f === 'HEX') return h.replace('#', '').toUpperCase()
    if (f === 'RGB') {
      const rgb = toRgb(c)
      if (!rgb) return ''
      return `${Math.round(rgb.r * 255)}, ${Math.round(rgb.g * 255)}, ${Math.round(rgb.b * 255)}`
    }
    if (f === 'HSL') {
      const hsl = toHsl(c)
      if (!hsl) return ''
      const hVal = hsl.h ? Math.round(hsl.h) : 0
      return `${hVal}, ${Math.round(hsl.s * 100)}%, ${Math.round(hsl.l * 100)}%`
    }
    if (f === 'OKLCH') {
      const oklch = toOklch(c)
      if (!oklch) return ''
      const l = Math.round(oklch.l * 100)
      const chroma = oklch.c ? oklch.c.toFixed(3) : 0
      const hVal = oklch.h ? Math.round(oklch.h) : 0
      return `${l}%, ${chroma}, ${hVal}`
    }
    return h
  }

  function handleInputComplete(e: Event) {
    const val = (e.target as HTMLInputElement).value
    
    let parsedColor
    if (format === 'HEX') {
      parsedColor = parse(val.startsWith('#') ? val : `#${val}`)
    } else if (format === 'RGB') {
      parsedColor = parse(`rgb(${val})`)
    } else if (format === 'HSL') {
      const parts = val.split(',').map(s => s.trim())
      const s = parts[1] && !parts[1].endsWith('%') ? `${parts[1]}%` : parts[1]
      const l = parts[2] && !parts[2].endsWith('%') ? `${parts[2]}%` : parts[2]
      parsedColor = parse(`hsl(${parts[0]}, ${s}, ${l})`)
    } else if (format === 'OKLCH') {
      const parts = val.split(',').map(s => s.trim())
      const l = parts[0] && !parts[0].endsWith('%') ? `${parts[0]}%` : parts[0]
      parsedColor = parse(`oklch(${l} ${parts[1]} ${parts[2]})`)
    }

    if (parsedColor) {
      const newHex = formatHex(parsedColor)
      if (newHex) {
        dispatch('hexChange', { hex: newHex })
      }
    } else {
      (e.target as HTMLInputElement).value = displayValue
    }
  }

  function handleOpacityInput(e: Event) {
    let val = parseInt((e.target as HTMLInputElement).value, 10)
    if (isNaN(val)) return
    val = Math.max(0, Math.min(100, val))
    dispatch('opacityChange', { opacity: val })
  }

  function handleClickOutside(event: MouseEvent) {
    if (!showDropdown) return
    const path = event.composedPath()
    const clickedInside = path.some(
      (node) => node instanceof Element && node.closest('.format-dropdown-container')
    )
    if (!clickedInside) {
      showDropdown = false
    }
  }
</script>

<svelte:window on:click={handleClickOutside} />

<div class="grid grid-cols-[80px_1fr] gap-1.5 pt-1 text-xs">
  <!-- Format Dropdown For Colors -->
  <div class="relative format-dropdown-container">
    <button
      class="w-full flex items-center justify-between px-2 h-7 bg-white border border-black/10 rounded-md text-ink-600 text-xs font-medium hover:bg-parchment-100 transition-colors cursor-pointer"
      on:click|stopPropagation={() => (showDropdown = !showDropdown)}
    >
      <span class="capitalize">{format}</span>
      <ChevronDown
        class="size-4 text-ink-400 transition-transform duration-150 {showDropdown ? 'rotate-180' : ''}"
      />
    </button>
    
    {#if showDropdown}
      <div
        class="absolute bottom-full mb-1.5 left-0 w-32 p-1 bg-parchment-50 border border-black/10 rounded-xl shadow-xl z-50 overflow-hidden"
      >
        {#each FORMATS as f}
          <button
            class="w-full text-left px-2 py-1.5 text-xs font-medium rounded-lg transition-colors {format === f ? 'bg-parchment-200 text-ink-900' : 'text-ink-600 hover:text-ink-700 hover:bg-parchment-200'}"
            on:click={() => {
              format = f;
              showDropdown = false;
            }}
          >
            {f}
          </button>
        {/each}
      </div>
    {/if}
  </div>

  <!-- United Input Box -->
  <div class="flex items-stretch bg-white border border-black/10 rounded-md focus-within:border-parchment-400 overflow-hidden h-7">
    <input
      type="text"
      class="flex-1 px-2 text-ink-900 font-mono text-center focus:outline-none text-xs bg-transparent min-w-0"
      value={displayValue}
      on:change={handleInputComplete}
    />
    
    {#if showOpacity}
      <!-- Separator -->
      <div class="w-px bg-black/10 my-1"></div>
      
      <!-- Opacity Controller -->
      <div class="relative flex items-center w-[40px] shrink-0">
        <input
          class="w-full pr-4 pl-1 text-ink-900 text-center focus:outline-none bg-transparent min-w-0 text-xs font-mono"
          value={opacity}
          on:input={handleOpacityInput}
        />
        <span class="absolute right-2 text-xs font-mono text-ink-400 font-semibold select-none pointer-events-none">%</span>
      </div>
    {/if}
  </div>
</div>
