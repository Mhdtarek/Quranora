<script>
	import { SvelteUIProvider, Container } from '@svelteuidev/core';
  import NavBarContent from "../../components/Navbar.svelte"
  import { fade } from 'svelte/transition';
</script>
<main >
  <SvelteUIProvider withNormalizeCSS withGlobalStyles themeObserver="dark" >
    <Container>
      <div transition:fade>
        <slot/>
      </div>
    </Container>
    <header>
      <NavBarContent>sadsda</NavBarContent>
    </header>
  </SvelteUIProvider>
</main>
<style>
  main {
    height: 100vh;
    position: relative;

  }
  header {
    position: fixed; /* Set div position to relative */
    bottom: 0; /* set the bottom to 0*/
    width: 100vw;
  }
</style>