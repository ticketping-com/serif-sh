<script lang="ts">
  import '../app.css';
  import { darkMode } from '$lib/stores';
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';

  onMount(() => {
    // Sync store with initial state (already applied by blocking script in app.html)
    if (browser) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const stored = localStorage.getItem('serifsh_darkMode');

      if (stored !== null) {
        darkMode.set(stored === 'true');
      } else {
        darkMode.set(prefersDark);
      }

      // Save preference changes and sync to html element
      darkMode.subscribe(value => {
        localStorage.setItem('serifsh_darkMode', String(value));
        document.documentElement.classList.toggle('dark', value);
      });
    }
  });
</script>

<slot />
