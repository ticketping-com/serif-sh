<script lang="ts">
  import { fly, crossfade } from 'svelte/transition'
  import { quintOut } from 'svelte/easing'

  const [send, receive] = crossfade({
    duration: 300,
    easing: quintOut,
  });
  import {
    customBgConfig,
    customBgPanelOpen,
    rgbToHsv,
    rgbToHex,
    hexToRgb
  } from '$lib/stores/custom-bg'
  import { selectedThemeId, selectedTheme } from '$lib/stores'
  import { THEMES } from '$lib/themes'
  import { PRESETS } from '$lib/preset-libraries'
  import SolidColorIcon from '$lib/components/icons/solid-color.svelte'
  import GradientColorIcon from '$lib/components/icons/gradient-color.svelte'
  import GridIcon from '$lib/components/icons/grid.svelte'
  import ImageIcon from '$lib/components/icons/image.svelte'
  import ResetIcon from '$lib/components/icons/reset.svelte'
  import CrossIcon from '$lib/components/icons/cross.svelte'
  import GradientColorPopup from '$lib/components/gradient-color-popup.svelte'
  import EyeIcon from '$lib/components/icons/eye.svelte'
  import Tooltip from '$lib/components/tooltip.svelte'

  import BgSolidEditor from '$lib/components/bg-solid-editor.svelte'
  import BgGradientEditor from '$lib/components/bg-gradient-editor.svelte'
  import BgPatternEditor from '$lib/components/bg-pattern-editor.svelte'
  import BgImageEditor from '$lib/components/bg-image-editor.svelte'

  $: if ($customBgPanelOpen && !$customBgConfig.enabled) {
    initializeFromTheme($selectedTheme)
  }

  function initializeFromTheme(theme: any) {
    if (!theme) return

    customBgConfig.update((c) => {
      // Check if there is a linear or radial gradient in backgroundImage
      if (theme.backgroundImage && theme.backgroundImage.includes('gradient')) {
        const parsed = parseGradientString(theme.backgroundImage)
        if (parsed) {
          c.type = 'gradient'
          c.gradient.type = parsed.type
          c.gradient.angle = parsed.angle
          c.gradient.stops = parsed.stops
          c.gradient.activeStopId = parsed.stops[0].id

          // Sync solid color picker hue/sat/val to the first stop
          const firstStop = parsed.stops[0]
          const rgb = hexToRgb(firstStop.hex)
          if (rgb) {
            const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b)
            c.solid.h = hsv.h
            c.solid.s = hsv.s
            c.solid.v = hsv.v
            c.solid.hex = firstStop.hex
            c.solid.opacity = firstStop.opacity
          }
        }
        c.image.url = '' // Clear previous theme's image URL since this is a gradient theme
      }
      // Check if it has a background image URL
      else if (theme.backgroundImage && theme.backgroundImage.includes('url')) {
        const match = theme.backgroundImage.match(/url\(['"]?(.*?)['"]?\)/)
        c.type = 'image'
        c.image.url = match ? match[1] : ''
        c.image.fill = 'fill'
        c.image.exposure = 100
        c.image.contrast = 100
        c.image.saturation = 100
        c.image.temperature = 100
      }
      // Fallback to solid color
      else {
        c.type = 'solid'
        const hexColor = theme.background || '#FFFFFF'
        c.solid.hex = hexColor

        const rgb = hexToRgb(hexColor)
        if (rgb) {
          const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b)
          c.solid.h = hsv.h
          c.solid.s = hsv.s
          c.solid.v = hsv.v
        }
        c.solid.opacity = 100
        c.image.url = '' // Clear previous theme's image URL since this is a solid color theme
      }

      c.enabled = true
      return c
    })
  }

  function parseGradientString(gradientStr: string) {
    const match = gradientStr.match(/(linear|radial)-gradient\((.*)\)/i)
    if (!match) return null

    const type = match[1].toLowerCase() === 'linear' ? ('linear' as const) : ('radial' as const)
    const inside = match[2]

    // Split by commas, avoiding splitting inside rgb/rgba parentheses
    const parts: string[] = []
    let currentPart = ''
    let parenDepth = 0
    for (let i = 0; i < inside.length; i++) {
      const char = inside[i]
      if (char === '(') parenDepth++
      else if (char === ')') parenDepth--

      if (char === ',' && parenDepth === 0) {
        parts.push(currentPart.trim())
        currentPart = ''
      } else {
        currentPart += char
      }
    }
    if (currentPart.trim()) {
      parts.push(currentPart.trim())
    }

    let angle = 90
    let colorParts = parts

    if (parts[0] && !parts[0].includes('#') && !parts[0].includes('rgb') && !parts[0].includes('hsl') && !parts[0].match(/^[a-zA-Z]+$/)) {
      const anglePart = parts[0]
      colorParts = parts.slice(1)

      if (anglePart.includes('deg')) {
        angle = parseInt(anglePart, 10) || 90
      } else {
        if (anglePart.includes('bottom')) angle = 180
        else if (anglePart.includes('top')) angle = 0
        else if (anglePart.includes('right')) angle = 90
        else if (anglePart.includes('left')) angle = 270
      }
    }

    const stops = colorParts.map((part, index) => {
      let offset = Math.round((index / (colorParts.length - 1)) * 100)
      let colorStr = part

      const offsetMatch = part.match(/\s+(\d+)%$/)
      if (offsetMatch) {
        offset = parseInt(offsetMatch[1], 10)
        colorStr = part.replace(/\s+\d+%$/, '')
      }

      let hex = '#FFFFFF'
      let opacity = 100

      if (colorStr.trim().startsWith('rgba')) {
        const rgbaMatch = colorStr.match(
          /rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d.]+)\s*\)/
        )
        if (rgbaMatch) {
          const r = parseInt(rgbaMatch[1], 10)
          const g = parseInt(rgbaMatch[2], 10)
          const b = parseInt(rgbaMatch[3], 10)
          opacity = Math.round(parseFloat(rgbaMatch[4]) * 100)
          hex = rgbToHex(r, g, b)
        }
      } else if (colorStr.trim().startsWith('rgb')) {
        const rgbMatch = colorStr.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/)
        if (rgbMatch) {
          const r = parseInt(rgbMatch[1], 10)
          const g = parseInt(rgbMatch[2], 10)
          const b = parseInt(rgbMatch[3], 10)
          hex = rgbToHex(r, g, b)
        }
      } else if (colorStr.trim().startsWith('#')) {
        hex = colorStr.trim().toUpperCase()
      }

      return {
        id: `stop-${Date.now()}-${index}`,
        offset,
        hex,
        opacity
      }
    })

    return {
      type,
      angle,
      stops
    }
  }

  let activeTab: 'custom' | 'libraries' = 'custom'

  // Predefined theme collections for Libraries tab
  const themesList = Object.values(THEMES)
  let showFormatDropdown = false
  let showGradientColorPicker = false

  const btnClass = "group relative p-1.5 rounded-md flex-1 flex justify-center hover:bg-parchment-50"
  const iconClass = "relative z-10 size-5 text-ink-400 group-hover:text-ink-500 transition-colors duration-150"

  // Gradient state shortcut values
  $: gradient = $customBgConfig.gradient
  $: stops = [...gradient.stops].sort((a, b) => a.offset - b.offset)
  $: activeStop = stops.find((s) => s.id === gradient.activeStopId) || stops[0]


  // Enable custom background when editing values
  function enableCustomBg() {
    if (!$customBgConfig.enabled) {
      customBgConfig.update((c) => {
        c.enabled = true
        return c
      })
    }
  }

  // Set background type
  let activeCustomMode: 'solid' | 'gradient' | 'pattern' | 'image' | 'preset' = 'solid';
  $: {
    if ($customBgConfig.pattern.enabled || $customBgConfig.type === 'preset') {
      activeCustomMode = 'pattern';
    } else {
      activeCustomMode = $customBgConfig.type;
    }
  }

  function setBgType(type: 'solid' | 'gradient' | 'pattern' | 'image') {
    enableCustomBg()
    customBgConfig.update((c) => {
      if (type === 'pattern') {
        c.pattern.enabled = true
      } else {
        c.type = type
        c.pattern.enabled = false
      }
      return c
    })
  }

  // Common change handler for gradient stops
  function handleGradientColorChange(hex: string, opacity: number) {
    enableCustomBg()
    customBgConfig.update(c => {
      const stopIdx = c.gradient.stops.findIndex(st => st.id === c.gradient.activeStopId)
      if (stopIdx !== -1) {
        c.gradient.stops[stopIdx].hex = hex
        c.gradient.stops[stopIdx].opacity = opacity
      }
      // Also sync solid.hex / hsv so switching back to solid retains this color
      c.solid.hex = hex
      const rgb = hexToRgb(hex)
      if (rgb) {
        const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b)
        c.solid.h = hsv.h
        c.solid.s = hsv.s
        c.solid.v = hsv.v
      }
      return c
    })
  }

  // Selecting a theme from libraries
  function selectLibraryTheme(themeId: string) {
    selectedThemeId.set(themeId)
    customBgConfig.update((c) => {
      c.enabled = false
      return c
    })
  }

  // Clean custom backgrounds
  function resetCustomBg() {
    customBgConfig.update((c) => {
      c.enabled = false
      return c
    })
  }
</script>



{#if $customBgPanelOpen}
  <!-- Gradient Color Picker Popup (placed outside sidebar to avoid clipping/transform issues) -->
  {#if activeCustomMode === 'gradient' && showGradientColorPicker}
    <GradientColorPopup 
      {activeStop}
      on:close={() => (showGradientColorPicker = false)}
      on:change={(e) => handleGradientColorChange(e.detail.hex, e.detail.opacity)}
    />
  {/if}

  <div
    class="fixed right-0 top-[50px] bottom-0 z-40 w-[280px] bg-parchment-50 text-ink-700 border-l border-black/10 shadow-[-10px_0_30px_rgba(0,0,0,0.02),-1px_0_3px_rgba(0,0,0,0.02)] flex flex-col font-sans select-none overflow-hidden"
    transition:fly={{ x: 280, duration: 300 }}
  >
    <!-- Top Header / Navigation Tabs -->
    <div
      class="flex items-center justify-between px-3 pt-2.5 pb-2 shrink-0"
    >
      <div class="flex gap-1 bg-parchment-200/50 p-1 rounded-lg w-fit shadow-custom">
        <button
          class="relative px-3 py-1 text-xs font-semibold rounded-md transition-colors {activeTab === 'custom'
            ? 'text-ink-900'
            : 'text-ink-400 hover:text-ink-600'}"
          on:click={() => {
            activeTab = 'custom'
            if ($customBgConfig.type === 'preset' && !$customBgConfig.pattern.enabled) {
              customBgConfig.update(c => {
                c.pattern.enabled = true
                return c
              })
            }
          }}
        >
          {#if activeTab === 'custom'}
            <div
              class="absolute inset-0 bg-white shadow-sm rounded-md"
              in:receive={{ key: 'nav-tab' }}
              out:send={{ key: 'nav-tab' }}
            ></div>
          {/if}
          <span class="relative z-10">Custom</span>
        </button>
        <button
          class="relative px-3 py-1 text-xs font-semibold rounded-md transition-colors {activeTab === 'libraries'
            ? 'text-ink-900'
            : 'text-ink-400 hover:text-ink-600'}"
          on:click={() => (activeTab = 'libraries')}
        >
          {#if activeTab === 'libraries'}
            <div
              class="absolute inset-0 bg-white shadow-sm rounded-md"
              in:receive={{ key: 'nav-tab' }}
              out:send={{ key: 'nav-tab' }}
            ></div>
          {/if}
          <span class="relative z-10">Libraries</span>
        </button>
      </div>

      <button
        class="group relative p-1 rounded hover:bg-parchment-200 transition-colors text-ink-500 hover:text-ink-700"
        on:click={() => customBgPanelOpen.set(false)}
        aria-label="Close panel"
      >
        <CrossIcon
          class="size-4 text-ink-400 group-hover:text-ink-500 transition-colors duration-150"
        />
      </button>
    </div>

    <!-- Active Content Area -->
    <div class="flex-1 flex flex-col overflow-y-auto overflow-x-hidden custom-scrollbar">
      {#if activeTab === 'custom'}
        <!-- Toolbar for Fill Types -->
        <div class="flex items-center px-3 pt-3">
          {#if $customBgConfig.type === 'preset'}
            <div class="flex w-full items-center justify-between bg-parchment-200/50 p-1 rounded-lg gap-1 border border-black/5">
              <button class="{btnClass} text-ink-900" on:click={() => { customBgConfig.update(c => { c.pattern.enabled = !c.pattern.enabled; return c; }); }}>
                {#if $customBgConfig.pattern.enabled}
                  <div class="absolute inset-0 bg-parchment-50 shadow-sm rounded-md" in:receive={{ key: 'bg-toolbar' }} out:send={{ key: 'bg-toolbar' }}></div>
                {/if}
                <GridIcon class={iconClass} />
                <Tooltip positionClass="left-1/2 -translate-x-1/2">Grid Overlay</Tooltip>
              </button>
              <button 
                class="{btnClass} text-ink-500 hover:text-ink-900 transition-colors"
                on:click={() => {
                  customBgConfig.update(c => {
                    c.type = 'solid';
                    c.preset.id = '';
                    c.pattern.enabled = false;
                    return c;
                  });
                }}
              >
                <span class="text-xs font-semibold">Reset</span>
              </button>
            </div>
          {:else}
            <div
              class="flex w-full items-center justify-between bg-parchment-200/50 p-1 rounded-lg gap-1 border border-black/5"
            >
              <!-- Solid Color Button -->
            <button
              class="{btnClass} {activeCustomMode === 'solid'
                ? 'text-ink-900'
                : 'text-ink-400'}"
              on:click={() => setBgType('solid')}
            >
              {#if activeCustomMode === 'solid'}
                <div
                  class="absolute inset-0 bg-parchment-50 shadow-sm rounded-md"
                  in:receive={{ key: 'bg-toolbar' }}
                  out:send={{ key: 'bg-toolbar' }}
                ></div>
              {/if}
              <SolidColorIcon
                class={iconClass}
              />
              <Tooltip positionClass="left-1/2 -translate-x-1/2">Solid
              </Tooltip>
            </button>

            <!-- Gradient Button -->
            <button
              class="{btnClass} {activeCustomMode === 'gradient'
                ? 'text-ink-900'
                : 'text-ink-400'}"
              on:click={() => setBgType('gradient')}
            >
              {#if activeCustomMode === 'gradient'}
                <div
                  class="absolute inset-0 bg-parchment-50 shadow-sm rounded-md"
                  in:receive={{ key: 'bg-toolbar' }}
                  out:send={{ key: 'bg-toolbar' }}
                ></div>
              {/if}
              <GradientColorIcon
                class={iconClass}
              />
              <Tooltip positionClass="left-1/2 -translate-x-1/2">Gradient
              </Tooltip>
            </button>

            <!-- Pattern (Grid) Button -->
            <button
              class="{btnClass} {activeCustomMode === 'pattern'
                ? 'text-ink-900'
                : 'text-ink-400'}"
              on:click={() => setBgType('pattern')}
            >
              {#if activeCustomMode === 'pattern'}
                <div
                  class="absolute inset-0 bg-parchment-50 shadow-sm rounded-md"
                  in:receive={{ key: 'bg-toolbar' }}
                  out:send={{ key: 'bg-toolbar' }}
                ></div>
              {/if}
              <GridIcon
                class={iconClass}
              />
              <Tooltip positionClass="left-1/2 -translate-x-1/2">Grid
              </Tooltip>
            </button>

            <!-- Image Button -->
            <button
              class="{btnClass} {activeCustomMode === 'image'
                ? 'text-ink-900'
                : 'text-ink-400'}"
              on:click={() => setBgType('image')}
            >
              {#if activeCustomMode === 'image'}
                <div
                  class="absolute inset-0 bg-parchment-50 shadow-sm rounded-md"
                  in:receive={{ key: 'bg-toolbar' }}
                  out:send={{ key: 'bg-toolbar' }}
                ></div>
              {/if}
              <ImageIcon
                class={iconClass}
              />
              <Tooltip positionClass="left-1/2 -translate-x-1/2">Image
              </Tooltip>
            </button>
          </div>
          {/if}
        </div>

        <!-- Solid State Content -->
        {#if activeCustomMode === 'solid'}
          <BgSolidEditor />
        {/if}

        <!-- Gradient State Content -->
        {#if activeCustomMode === 'gradient'}
          <BgGradientEditor bind:showGradientColorPicker />
        {/if}

        <!-- Pattern State Content -->
        {#if activeCustomMode === 'pattern'}
          <BgPatternEditor />
        {/if}

        <!-- Image State Content -->
        {#if activeCustomMode === 'image'}
          <BgImageEditor />
        {/if}

        <!-- Reset Button -->
        <div class="px-3 pb-3 pt-1">
          <button
            class="group w-full py-2 rounded-md flex items-center justify-center gap-1.5 transition-all {$customBgConfig.enabled
              ? 'text-red-500 hover:text-red-600 hover:bg-red-50 shadow-sm border border-red-100'
              : 'text-ink-300 hover:text-ink-400 hover:bg-parchment-100 border border-transparent'}"
            on:click={resetCustomBg}
          >
            <ResetIcon class="size-5 transition-colors duration-150" />
            <span class="text-sm font-semibold">Reset Custom Background</span>
          </button>
        </div>
      {:else}
        <!-- Libraries Tab: Lists Predefined Themes -->
        <div class="relative w-full h-full flex flex-col mt-2">
          <!-- Added absolute inset-0 to match parent preview area, flex-col for single column -->
          <div class="absolute inset-0 bg-white/95 overflow-y-auto scrollbar-none flex flex-col gap-2">
            <div class="text-sm text-ink-900 font-semibold text-center mx-4 mb-1 px-1 sticky top-0 bg-parchment-50/50 backdrop-blur z-20 py-1 rounded-md card-shadow">
              Preset Libraries
            </div>
            <div class="flex flex-col gap-4 p-4">
              {#each PRESETS as pattern}
                <button
                  class="group relative overflow-hidden text-left h-49 rounded-lg transition-colors flex items-center justify-center p-4 bg-parchment-50 {$customBgConfig.enabled && $customBgConfig.type === 'preset' && $customBgConfig.preset.id === pattern.id
                    ? 'ring-2 ring-ink-300 shadow-custom'
                    : 'card-shadow'}"
                  on:click={() => {
                    customBgConfig.update(c => ({
                      ...c,
                      enabled: true,
                      type: 'preset',
                      preset: { id: pattern.id }
                    }))
                  }}
                >
                  <!-- Pattern Preview -->
                  <div
                    class="absolute inset-0 z-0 pointer-events-none"
                    style={
                      Object.entries(pattern.style || {})
                        .map(([k, v]) => `${k.replace(/([A-Z])/g, "-$1").toLowerCase()}: ${v}`)
                        .join('; ')
                    }
                  ></div>

                  <!-- Hover Content -->
                  <div
                    class="relative z-10 flex flex-col items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                  >
                    <span
                      class="text-base text-ink-900 font-semibold select-none text-center leading-tight px-2 py-1 bg-parchment-50/90 backdrop-blur-sm rounded"
                    >
                      {pattern.name}
                    </span>
                    <span
                      class="flex items-center gap-1.5 px-6 py-1.5 bg-ink-900 text-white rounded-md text-xs font-medium shadow-sm"
                    >
                      <EyeIcon class="size-3.5" />
                      Preview
                    </span>
                  </div>
                </button>
              {/each}
            </div>
          </div>
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  /* Custom Scrollbar Styles for Figma dark vibe */
  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: var(--color-parchment-300) transparent;
  }
  .custom-scrollbar::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: var(--color-parchment-300);
    border-radius: 9999px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: var(--color-parchment-400);
  }

  /* Checkerboard CSS background (Light parchment-based grid) */
  .checkerboard {
    background-color: #ffffff;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3E%3Crect width='4' height='4' fill='%23fafafa'/%3E%3Crect x='4' y='4' width='4' height='4' fill='%23fafafa'/%3E%3Crect x='4' width='4' height='4' fill='%23eceae4'/%3E%3Crect y='4' width='4' height='4' fill='%23eceae4'/%3E%3C/svg%3E");
    background-size: 8px 8px;
  }

  /* Range input formatting override */
  input[type='range'] {
    -webkit-appearance: none;
    appearance: none;
  }
  input[type='range']::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 11px;
    width: 11px;
    border-radius: 50%;
    background: #ffffff;
    border: 1px solid rgba(0, 0, 0, 0.15);
    cursor: pointer;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
    transition: transform 0.1s;
  }
  input[type='range']::-webkit-slider-thumb:hover {
    transform: scale(1.2);
  }
  input[type='range']:focus {
    outline: none;
  }

  /* Chrome/Safari number input arrow styling hide */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
</style>
