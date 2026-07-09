<script lang="ts">
  import ColorPickerPanel from './color-picker-panel.svelte';
  import { customBgConfig } from '$lib/stores/custom-bg';

  $: solid = $customBgConfig.solid;
  $: activeColorHex = solid.hex;
  $: activeColorOpacity = solid.opacity;

  function enableCustomBg() {
    if (!$customBgConfig.enabled) {
      customBgConfig.update((c) => {
        c.enabled = true
        return c
      })
    }
  }

  function handleSolidColorChange(hex: string, opacity: number) {
    enableCustomBg()
    customBgConfig.update(c => {
      c.solid.hex = hex
      c.solid.opacity = opacity
      return c
    })
  }
</script>

<div class="p-3 space-y-3 shrink-0 relative">
  <ColorPickerPanel
    hex={activeColorHex}
    opacity={activeColorOpacity}
    showOpacity={true}
    on:change={(e) => handleSolidColorChange(e.detail.hex, e.detail.opacity)}
  />
</div>
