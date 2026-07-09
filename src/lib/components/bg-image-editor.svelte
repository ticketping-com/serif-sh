<script lang="ts">
  import { customBgConfig } from '$lib/stores/custom-bg';
  import ChevronDown from './icons/chevron-down.svelte';
  import ResetIcon from './icons/reset.svelte';
  import UploadIcon from './icons/upload.svelte';
  import Tooltip from './tooltip.svelte';
  import BidirectionalSlider from './bidirectional-slider.svelte';

  let showImageFillDropdown = false;
  let fileInputEl: HTMLInputElement;

  function enableCustomBg() {
    if (!$customBgConfig.enabled) {
      customBgConfig.update((c) => {
        c.enabled = true
        return c
      })
    }
  }

  function triggerImageUpload() {
    if (fileInputEl) {
      fileInputEl.click()
    }
  }

  function handleImageFile(e: Event) {
    const input = e.target as HTMLInputElement
    const file = input.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string
      enableCustomBg()
      customBgConfig.update((c) => {
        c.image.url = dataUrl
        return c
      })
    }
    reader.readAsDataURL(file)
  }

  function handleImageSlider(val: number, prop: keyof typeof $customBgConfig.image) {
    enableCustomBg()
    customBgConfig.update((c) => {
      if (prop !== 'url' && prop !== 'fill') {
        c.image[prop] = val
      }
      return c
    })
  }

  function resetImageSettings() {
    customBgConfig.update((c) => {
      c.image.url = ''
      c.image.exposure = 100
      c.image.contrast = 100
      c.image.saturation = 100
      c.image.temperature = 100
      c.image.tint = 100
      c.image.blur = 0
      return c
    })
  }
  
  function getOverlayStyle(temp: number, tint: number) {
    if (temp === 100 && tint === 100) return '';
    
    let tR = 0, tG = 0, tB = 0, tOp = 0;
    if (temp > 100) { tR = 255; tG = 130; tB = 0; tOp = (temp - 100) / 400; }
    else if (temp < 100) { tR = 0; tG = 120; tB = 255; tOp = (100 - temp) / 400; }
    
    let tintR = 0, tintG = 0, tintB = 0, tintOp = 0;
    if (tint > 100) { tintR = 255; tintG = 0; tintB = 255; tintOp = (tint - 100) / 400; }
    else if (tint < 100) { tintR = 0; tintG = 255; tintB = 0; tintOp = (100 - tint) / 400; }
    
    const layers = [];
    if (tOp > 0) layers.push(`linear-gradient(rgba(${tR}, ${tG}, ${tB}, ${tOp}), rgba(${tR}, ${tG}, ${tB}, ${tOp}))`);
    if (tintOp > 0) layers.push(`linear-gradient(rgba(${tintR}, ${tintG}, ${tintB}, ${tintOp}), rgba(${tintR}, ${tintG}, ${tintB}, ${tintOp}))`);
    
    if (layers.length === 0) return '';
    return `background: ${layers.join(', ')}; mix-blend-mode: color;`;
  }
</script>

<div class="p-3 space-y-3 shrink-0">
  <div class="flex items-center justify-between">
    <div class="relative w-[90px]">
      <button
        class="w-full flex items-center justify-between px-2 h-6 bg-white border border-black/10 rounded-md text-ink-700 text-xs font-medium hover:bg-parchment-100 transition-colors cursor-pointer"
        on:click|stopPropagation={() => (showImageFillDropdown = !showImageFillDropdown)}
      >
        <span class="capitalize">{$customBgConfig.image.fill}</span>
        <ChevronDown class="size-3.5 text-ink-400 transition-transform duration-150 {showImageFillDropdown ? 'rotate-180' : ''}" />
      </button>

      {#if showImageFillDropdown}
        <div class="absolute top-full mt-1.5 left-0 w-full p-1 bg-parchment-50 border border-black/10 rounded-xl shadow-xl z-50 overflow-hidden">
          {#each ['fill', 'fit', 'stretch', 'tile'] as fillType}
            <button
              class="w-full text-left px-2 py-1.5 text-xs font-medium rounded-lg transition-colors capitalize {$customBgConfig.image.fill === fillType ? 'bg-parchment-200 text-ink-900' : 'text-ink-600 hover:text-ink-700 hover:bg-parchment-200'}"
              on:click={() => {
                enableCustomBg()
                customBgConfig.update((c) => {
                  c.image.fill = fillType as any
                  return c
                })
                showImageFillDropdown = false
              }}
            >
              {fillType}
            </button>
          {/each}
        </div>
      {/if}
    </div>

    <div class="flex items-center gap-1">
      <button
        class="group relative p-1 rounded hover:bg-parchment-200 transition-colors text-ink-500 hover:text-ink-700"
        on:click={resetImageSettings}
      >
        <ResetIcon class="size-4 text-ink-400 group-hover:text-ink-500 transition-colors duration-150" />
        <Tooltip positionClass="left-1/2 -translate-x-3/4">Reset settings
        </Tooltip>
      </button>
    </div>
  </div>

  <div class="relative w-full h-[250px] rounded-lg checkerboard bg-white border border-black/10 overflow-hidden flex items-center justify-center flex-col shadow-inner">
    {#if $customBgConfig.image.url}
      <img
        src={$customBgConfig.image.url}
        alt="Background preview"
        class="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style="filter: brightness({$customBgConfig.image.exposure}%) contrast({$customBgConfig.image.contrast}%) saturate({$customBgConfig.image.saturation}%) blur({$customBgConfig.image.blur / 10}px);"
      />
      
      {#if $customBgConfig.image.temperature !== 100 || $customBgConfig.image.tint !== 100}
        <div
          class="absolute inset-0 pointer-events-none"
          style={getOverlayStyle($customBgConfig.image.temperature, $customBgConfig.image.tint)}
        ></div>
      {/if}
    {/if}

    <div class="relative z-10 flex flex-col items-center gap-2 w-full px-4">
      <button class="px-3 py-1.5 bg-ink-950 hover:bg-ink-900 text-ink-400 group-hover:text-ink-500 font-medium rounded-md shadow-md flex items-center gap-1.5 transition-all text-xs cursor-pointer" on:click={triggerImageUpload}>
        <UploadIcon class="size-4 transition-colors duration-150" />
        <span>Upload from computer</span>
      </button>
      <input type="file" bind:this={fileInputEl} on:change={handleImageFile} accept="image/*" class="hidden" />
    </div>
  </div>

  <div class="space-y-3 pt-1 text-xs">
    <div class="grid grid-cols-[80px_1fr] items-center">
      <span class="text-ink-500 font-semibold text-sm">Exposure</span>
      <BidirectionalSlider min={0} max={200} value={$customBgConfig.image.exposure} on:input={(e) => handleImageSlider(e.detail, 'exposure')} />
    </div>
    <div class="grid grid-cols-[80px_1fr] items-center">
      <span class="text-ink-500 font-semibold text-sm">Contrast</span>
      <BidirectionalSlider min={0} max={200} value={$customBgConfig.image.contrast} on:input={(e) => handleImageSlider(e.detail, 'contrast')} />
    </div>
    <div class="grid grid-cols-[80px_1fr] items-center">
      <span class="text-ink-500 font-semibold text-sm">Saturation</span>
      <BidirectionalSlider min={0} max={200} value={$customBgConfig.image.saturation} on:input={(e) => handleImageSlider(e.detail, 'saturation')} />
    </div>
    <div class="grid grid-cols-[80px_1fr] items-center">
      <span class="text-ink-500 font-semibold text-sm">Temp..</span>
      <BidirectionalSlider min={0} max={200} value={$customBgConfig.image.temperature} on:input={(e) => handleImageSlider(e.detail, 'temperature')} />
    </div>
    <div class="grid grid-cols-[80px_1fr] items-center">
      <span class="text-ink-500 font-semibold text-sm">Tint</span>
      <BidirectionalSlider min={0} max={200} value={$customBgConfig.image.tint} on:input={(e) => handleImageSlider(e.detail, 'tint')} />
    </div>
    <div class="grid grid-cols-[80px_1fr] items-center">
      <span class="text-ink-500 font-semibold text-sm">Blur</span>
      <div class="relative w-full h-4 flex items-center group">
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          class="absolute inset-0 w-full h-full opacity-0 z-20 cursor-pointer"
          value={$customBgConfig.image.blur}
          on:input={(e) => handleImageSlider(parseFloat(e.currentTarget.value), 'blur')}
        />
        <div class="absolute w-full h-4 bg-parchment-50 border border-black/10 shadow-inner rounded-full overflow-hidden pointer-events-none">
          {#if $customBgConfig.image.blur > 0}
            <div class="absolute h-full bg-parchment-300 rounded-full" style="left: 0%; width: {$customBgConfig.image.blur}%;"></div>
          {/if}
        </div>
        <div class="absolute top-1/2 -translate-y-1/2 size-4 bg-white border border-black/10 rounded-full shadow z-10 pointer-events-none flex items-center justify-center transition-transform" style="left: calc({$customBgConfig.image.blur}% - {($customBgConfig.image.blur / 100) * 16}px);"></div>
      </div>
    </div>
  </div>
</div>
