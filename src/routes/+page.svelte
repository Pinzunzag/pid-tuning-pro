<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>
<script>
  import Faceplate from '$lib/components/Faceplate.svelte';
  
  let sp = 50, pv = 50.24, op = 52.1;
</script>

<Faceplate 
  tag="LIC-101" 
  description="Level Controller — Tank level regulation"
  {sp} {pv} {op} 
  unit="%" 
  mode="AUTO" 
/>