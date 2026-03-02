<script lang="ts">
  import { THEMES } from '$lib/themes'
  import { selectedThemeId } from '$lib/stores'
  import ThemeSelect from './theme-select.svelte'

  const themes = Object.values(THEMES)

  function getThemePreviewBg(theme: (typeof THEMES)[string]): string {
    if (theme?.backgroundImage) {
      return theme.backgroundImage
    }
    return theme?.background || '#fdfcf9'
  }

  //Group the brand themes
  const groupedOptions = []
  const brandSeen = new Set()

  themes.forEach((theme) => {
    const isBrand = theme.id.includes('vercel') || theme.id.includes('peerlist')

    if (isBrand) {
      const baseId = theme.id.split('-')[0]
      if (!brandSeen.has(baseId)) {
        brandSeen.add(baseId)
        groupedOptions.push({
          value: baseId,
          label: baseId.charAt(0).toUpperCase() + baseId.slice(1),
          preview: getThemePreviewBg(theme)
        })
      }
    } else {
      groupedOptions.push({
        value: theme.id,
        label: theme.name,
        preview: getThemePreviewBg(theme)
      })
    }
  })

  $: currentValue =
    $selectedThemeId.includes('vercel') || $selectedThemeId.includes('peerlist')
      ? $selectedThemeId.split('-')[0]
      : $selectedThemeId

  function handleChange(value: string) {
    if (value === 'vercel') {
      selectedThemeId.set('vercel-dark')
    } else if (value === 'peerlist') {
      selectedThemeId.set('peerlist-dark')
    } else {
      selectedThemeId.set(value)
    }
  }
</script>

<ThemeSelect
  value={currentValue}
  options={groupedOptions}
  label="Theme"
  handleValueChange={handleChange}
/>
