<script lang="ts">
  import '../app.css';
  import { afterNavigate } from '$app/navigation';
  import { page } from '$app/state';

  afterNavigate(() => {
    const gtag = (window as any).gtag;
    if (typeof gtag === 'function') {
      gtag('config', 'G-1J0S11JS4J', { page_path: page.url.pathname });
    }
  });
</script>

<slot />
