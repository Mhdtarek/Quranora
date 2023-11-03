<script>
	import { SvelteUIProvider, Container } from '@svelteuidev/core';
</script>

<SvelteUIProvider withNormalizeCSS withGlobalStyles themeObserver="dark">
  <slot/>
</SvelteUIProvider>