<script lang="ts">
  import { THEMES } from '$lib/themes';
  import { selectedThemeId } from '$lib/stores';
  import ThemeSelect from './theme-select.svelte';

  const themes = Object.values(THEMES);

  function getThemePreviewBg(theme: typeof THEMES[string]): string {
    if (theme?.backgroundImage) {
      return theme.backgroundImage;
    }
    return theme?.background || '#fdfcf9';
  }

  $: themeOptions = themes.map(theme => ({
    value: theme.id,
    label: theme.name,
    preview: getThemePreviewBg(theme),
  }));

  function handleChange(value: string) {
    selectedThemeId.set(value);
  }
</script>

<ThemeSelect
  value={$selectedThemeId}
  options={themeOptions}
  label="Theme"
  handleValueChange={handleChange}
/>
