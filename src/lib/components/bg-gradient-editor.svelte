<script lang="ts">
  import { customBgConfig } from '$lib/stores/custom-bg';
  import ChevronDown from './icons/chevron-down.svelte';
  import SwapIcon from './icons/swap.svelte';
  import RotateIcon from './icons/rotate.svelte';
  import PlusIcon from './icons/plus.svelte';
  import MinusIcon from './icons/minus.svelte';
  import Tooltip from './tooltip.svelte';

  export let showGradientColorPicker = false;

  let showGradientTypeDropdown = false;
  let gradientTrackEl: HTMLDivElement;
  let activeDraggingStopId: string | null = null;

  $: gradient = $customBgConfig.gradient;
  $: stops = [...gradient.stops].sort((a, b) => a.offset - b.offset);

  function enableCustomBg() {
    if (!$customBgConfig.enabled) {
      customBgConfig.update((c) => {
        c.enabled = true
        return c
      })
    }
  }

  function hexToRgba(hex: string, opacity: number) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
  }

  function selectStop(stopId: string) {
    enableCustomBg()
    customBgConfig.update((c) => {
      if (c.type === 'gradient') c.gradient.activeStopId = stopId
      return c
    })
  }

  function swapGradientColors() {
    enableCustomBg()
    customBgConfig.update((c) => {
      const stops = c.gradient.stops
      if (stops.length >= 2) {
        // Swap first and last stop's colors
        const first = stops[0]
        const last = stops[stops.length - 1]
        
        const tempHex = first.hex
        const tempOpacity = first.opacity
        
        first.hex = last.hex
        first.opacity = last.opacity
        
        last.hex = tempHex
        last.opacity = tempOpacity
      }
      return c
    })
  }

  function rotateGradient() {
    enableCustomBg()
    customBgConfig.update((c) => {
      c.gradient.angle = (c.gradient.angle + 45) % 360
      return c
    })
  }

  function handleGradientTrackClick(e: MouseEvent) {
    if (!gradientTrackEl || activeDraggingStopId) return
    const rect = gradientTrackEl.getBoundingClientRect()
    let offset = Math.round(((e.clientX - rect.left) / rect.width) * 100)
    offset = Math.max(0, Math.min(100, offset))

    const newStopId = `stop-${Date.now()}`
    customBgConfig.update((c) => {
      c.gradient.stops.push({ id: newStopId, hex: '#FFFFFF', opacity: 100, offset })
      return c
    })
    selectStop(newStopId)
  }

  function handleStopPointerDown(e: PointerEvent, stopId: string) {
    e.stopPropagation()
    activeDraggingStopId = stopId
    selectStop(stopId)

    const handleMove = (moveEvent: PointerEvent) => {
      if (!activeDraggingStopId || !gradientTrackEl) return
      const rect = gradientTrackEl.getBoundingClientRect()
      let offset = Math.round(((moveEvent.clientX - rect.left) / rect.width) * 100)
      offset = Math.max(0, Math.min(100, offset))

      customBgConfig.update((c) => {
        const stopIdx = c.gradient.stops.findIndex((s) => s.id === activeDraggingStopId)
        if (stopIdx !== -1) {
          c.gradient.stops[stopIdx].offset = offset
        }
        return c
      })
    }

    const handleUp = () => {
      activeDraggingStopId = null
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('pointerup', handleUp)
    }

    window.addEventListener('pointermove', handleMove)
    window.addEventListener('pointerup', handleUp)
  }

  function deleteStop(stopId: string) {
    customBgConfig.update((c) => {
      if (c.gradient.stops.length <= 2) return c
      c.gradient.stops = c.gradient.stops.filter((s) => s.id !== stopId)
      if (c.gradient.activeStopId === stopId) {
        c.gradient.activeStopId = c.gradient.stops[0].id
      }
      return c
    })
  }

  function addStopBtn() {
    const newStopId = `stop-${Date.now()}`
    customBgConfig.update((c) => {
      c.gradient.stops.push({ id: newStopId, hex: '#FFFFFF', opacity: 100, offset: 50 })
      return c
    })
    selectStop(newStopId)
  }
</script>

<div class="p-3 space-y-3 shrink-0">
  <div class="flex items-center justify-between">
    <div class="relative w-[90px]">
      <button
        class="w-full flex items-center justify-between px-2 h-6 bg-white border border-black/10 rounded-md text-ink-700 text-xs font-medium hover:bg-parchment-100 transition-colors cursor-pointer"
        on:click|stopPropagation={() => (showGradientTypeDropdown = !showGradientTypeDropdown)}
      >
        <span class="capitalize">{gradient.type}</span>
        <ChevronDown class="size-3.5 text-ink-400 transition-transform duration-150 {showGradientTypeDropdown ? 'rotate-180' : ''}" />
      </button>

      {#if showGradientTypeDropdown}
        <div class="absolute top-full mt-1.5 left-0 w-full p-1 bg-parchment-50 border border-black/10 rounded-xl shadow-xl z-50 overflow-hidden">
          {#each ['linear', 'radial'] as t}
            <button
              class="w-full text-left px-2 py-1.5 text-xs font-medium rounded-lg transition-colors capitalize {gradient.type === t ? 'bg-parchment-200 text-ink-900' : 'text-ink-600 hover:text-ink-700 hover:bg-parchment-200'}"
              on:click={() => {
                enableCustomBg()
                customBgConfig.update((c) => {
                  if (c.type === 'gradient') c.gradient.type = t as 'linear' | 'radial'
                  return c
                })
                showGradientTypeDropdown = false
              }}
            >
              {t}
            </button>
          {/each}
        </div>
      {/if}
    </div>

    <div class="flex items-center gap-1">
      <button class="group relative p-1 rounded hover:bg-parchment-200 transition-colors text-ink-500 hover:text-ink-700" on:click={swapGradientColors}>
        <SwapIcon class="size-4 text-ink-400 group-hover:text-ink-500 transition-colors duration-150" />
        <Tooltip positionClass="left-1/2 -translate-x-1/2">Flip gradient</Tooltip>
      </button>
      <button class="group relative p-1 rounded hover:bg-parchment-200 transition-colors" disabled={gradient.type === 'radial'} on:click={rotateGradient} class:opacity-40={gradient.type === 'radial'}>
        <RotateIcon class="size-4 text-ink-400 group-hover:text-ink-500 transition-colors duration-150" />
        <Tooltip positionClass="left-1/2 -translate-x-3/4">Rotate gradient</Tooltip>
      </button>
    </div>
  </div>

  <div
    bind:this={gradientTrackEl}
    class="relative w-full h-10 rounded-lg cursor-copy card-shadow my-6 flex items-center"
    style="background: linear-gradient(to right, {stops.map((s) => `${hexToRgba(s.hex, s.opacity)} ${s.offset}%`).join(', ')});"
    on:click={handleGradientTrackClick}
    role="button"
    tabindex="-1"
    on:keydown={(e) => e.key === 'Enter' && addStopBtn()}
  >
    {#each stops as stop (stop.id)}
      <div
        class="absolute top-1/2 -translate-y-[130%] cursor-pointer z-20 group"
        style="left: calc({stop.offset}% - {(stop.offset / 100) * 24}px);"
        on:pointerdown={(e) => {
          handleStopPointerDown(e, stop.id)
          showGradientColorPicker = true
        }}
        role="slider"
        aria-label="Gradient stop position"
        aria-valuenow={stop.offset}
        aria-valuemin="0"
        aria-valuemax="100"
        tabindex="-1"
      >
        <div class="size-6 p-1 rounded-md flex items-center justify-center relative transition-transform {stop.id === gradient.activeStopId ? 'bg-parchment-300' : 'bg-parchment-200'}">
          <div class="w-full h-full rounded-xs border border-black/10 shadow-sm shrink-0" style="background-color: {stop.hex}; opacity: {stop.opacity / 100};"></div>
          <div class="absolute -bottom-[3px] left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 -z-10 transition-colors {stop.id === gradient.activeStopId ? 'bg-parchment-300' : 'bg-parchment-200'}"></div>
        </div>
      </div>
    {/each}
  </div>

  <div class="flex items-center justify-between pt-2 border-t border-black/10 text-xs">
    <span class="text-ink-900 font-semibold text-xs">Stops</span>
    <button class="group relative p-1 rounded hover:bg-parchment-200 transition-colors" on:click={addStopBtn}>
      <PlusIcon class="size-4 text-ink-400 group-hover:text-ink-500 transition-colors duration-150" />
      <Tooltip positionClass="left-1/2 -translate-x-2/3">Add stop</Tooltip>
    </button>
  </div>

  <div class="-mx-3">
    {#each stops as stop (stop.id)}
      <div class="flex items-center gap-1.5 py-1.5 px-3 transition-colors {stop.id === gradient.activeStopId ? 'bg-parchment-200/50 shadow-[0_1px_2px_rgba(0,0,0,0.03)] border-y border-black/5' : 'border-y border-transparent hover:bg-parchment-100/30'}">
        <div class="relative w-[50px] shrink-0 flex items-center h-[28px] bg-parchment-50 border border-black/10 rounded-md transition-colors">
          <input
            min="0"
            max="100"
            class="w-full pr-4 pl-1.5 bg-transparent text-ink-900 text-center focus:outline-none text-xs"
            value={stop.offset}
            on:change={(e) => {
              enableCustomBg()
              const offsetVal = Math.max(0, Math.min(100, parseInt((e.target as HTMLInputElement).value, 10) || 0))
              customBgConfig.update((c) => {
                const st = c.gradient.stops.find((s) => s.id === stop.id)
                if (st) st.offset = offsetVal
                return c
              })
            }}
          />
          <span class="absolute right-1.5 text-[9px] text-ink-400 font-semibold pointer-events-none">%</span>
        </div>

        <div
          class="flex-1 flex items-center gap-2 p-1 rounded-md border transition-all text-xs h-[28px] cursor-pointer bg-white border-black/10 hover:border-black/20"
          on:click={() => selectStop(stop.id)}
          role="button"
          tabindex="0"
          on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && selectStop(stop.id)}
        >
          <button
            class="group relative size-[18px] rounded-sm border border-black/10 shadow-sm shrink-0"
            style="background-color: {stop.hex}; opacity: {stop.opacity / 100};"
            on:click|stopPropagation={() => {
              if (gradient.activeStopId !== stop.id) selectStop(stop.id)
              showGradientColorPicker = true
            }}
          >
            <Tooltip positionClass="left-1/2 -translate-x-1/2">Edit color</Tooltip>
          </button>
          <span class="font-mono text-ink-900 uppercase flex-1 leading-none">{stop.hex.replace('#', '')}</span>
          <div class="w-px h-3.5 bg-black/10 shrink-0"></div>
          <span class="w-8 text-right font-mono text-ink-500 pr-1.5 leading-none">{stop.opacity}%</span>
        </div>

        <button
          class="group relative p-1 rounded hover:bg-parchment-200 transition-colors shrink-0"
          on:click|stopPropagation={() => deleteStop(stop.id)}
          disabled={stops.length <= 2}
          class:opacity-30={stops.length <= 2}
        >
          <MinusIcon class="size-4 text-ink-400 group-hover:text-ink-500 transition-colors duration-150" />
          <Tooltip positionClass="left-1/2 -translate-x-2/3">Remove</Tooltip>
        </button>
      </div>
    {/each}
  </div>
</div>
