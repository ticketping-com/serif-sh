<script lang="ts">
  import { THEMES } from '$lib/themes';
  import { selectedThemeId, darkMode } from '$lib/stores';
  import ThemeSelect from './theme-select.svelte';

  const themes = Object.values(THEMES);

  function getThemePreviewBg(theme: typeof THEMES[string]): string {
    const isDark = $darkMode;
    if (theme?.backgroundImage) {
      const bgImage = isDark ? theme.backgroundImage.dark : theme.backgroundImage.light;
      return bgImage || '';
    }
    return isDark ? (theme?.background?.dark || '#1c1917') : (theme?.background?.light || '#fdfcf9');
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
