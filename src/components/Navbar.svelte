<script lang="ts">
	import { Group, Text, Anchor, Card } from '@svelteuidev/core';
  export const ssr = false
  export const csr = false
  export const prerender = true;


</script>
<Card>

  <Group override={{ height: '100%', px: 20 }} position="apart">
    <div>
    </div>
    <div>
      <a href="/app" data-sveltekit-preload-code="eager">
        <Text>Home</Text>
      </a>
    </div>
    <div>
      <a href="/app/settings" data-sveltekit-preload-code="eager">
        <Text>Settings</Text>
      </a>
    </div>
    <div></div>
  </Group>
</Card>