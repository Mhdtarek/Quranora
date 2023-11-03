<script>
	import { SvelteUIProvider, Container } from '@svelteuidev/core';
</script>

<svelte:head>
  <link rel="manifest" href="site.webmanifest"> 
</svelte:head>

<SvelteUIProvider withNormalizeCSS withGlobalStyles themeObserver="dark">
  <slot/>
</SvelteUIProvider>