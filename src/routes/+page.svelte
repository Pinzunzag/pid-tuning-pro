<script>
  import Faceplate from '$lib/components/Faceplate.svelte';
  
  let sp = 50;
  let pv = 50.24;
  let op = 52.1;
</script>

<h1>PID Tuning Pro — Faceplate Demo</h1>

<Faceplate 
  tag="LIC-101"
  description="Level Controller — Tank level regulation"
  {sp}
  {pv}
  {op}
  unit="%"
  mode="AUTO"
/>

<div style="margin-top: 20px;">
  <label>PV: <input type="number" bind:value={pv} step="0.5" /></label>
  <label>OP: <input type="number" bind:value={op} step="1" /></label>
</div>

<style>
  h1 {
    color: #4fc3f7;
    font-family: Consolas, monospace;
  }
  :global(body) {
    background: #1a1a1a;
    color: #e6e6e6;
    font-family: Consolas, monospace;
  }
</style>