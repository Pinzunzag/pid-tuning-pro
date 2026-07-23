<script>
  import Faceplate from '$lib/components/Faceplate.svelte';
  import { createSimulation } from '$lib/stores/simulation.svelte.js';

  const sim = createSimulation();
</script>

<main>
  <h1>🎛️ PID Tuning Pro — Live Simulation</h1>

  <div class="layout">
    <Faceplate 
      tag="LIC-101" 
      description="Tank Level Controller" 
      sp={sim.sp} pv={sim.pv} op={sim.op} 
      unit="%" mode={sim.mode} 
    />

    <div class="panel">
      <h3>Simulation Controls</h3>
      <div class="row">
        <button onclick={sim.start} disabled={sim.running}>▶ Start</button>
        <button onclick={sim.stop} disabled={!sim.running}>⏸ Stop</button>
        <button onclick={sim.reset}>↺ Reset</button>
      </div>

      <label>Mode:
        <select bind:value={sim.mode}>
          <option>AUTO</option>
          <option>MAN</option>
        </select>
      </label>

      <label>SP: {sim.sp.toFixed(1)}
        <input type="range" min="0" max="100" step="0.5" bind:value={sim.sp} />
      </label>

      {#if sim.mode === 'MAN'}
        <label>CV (manual): {sim.op.toFixed(1)}
          <input type="range" min="0" max="100" step="0.5" bind:value={sim.op} />
        </label>
      {/if}

      <h3>Tuning</h3>
      <label>Kp: {sim.kp.toFixed(2)}
        <input type="range" min="0" max="5" step="0.05" bind:value={sim.kp} />
      </label>
      <label>Ti (s): {sim.ti.toFixed(1)}
        <input type="range" min="1" max="60" step="0.5" bind:value={sim.ti} />
      </label>
      <label>Td (s): {sim.td.toFixed(2)}
        <input type="range" min="0" max="10" step="0.1" bind:value={sim.td} />
      </label>
    </div>
  </div>
</main>

<style>
  main {
    padding: 20px;
    background: #1a1a1a;
    min-height: 100vh;
    color: #e6e6e6;
    font-family: system-ui, sans-serif;
  }
  h1 { color: #42a5f5; }
  .layout {
    display: grid;
    grid-template-columns: 320px 1fr;
    gap: 20px;
    margin-top: 20px;
  }
  .panel {
    background: #252525;
    border: 1px solid #444;
    border-radius: 6px;
    padding: 16px;
    max-width: 500px;
  }
  .panel h3 { color: #8bd18b; margin: 12px 0 8px; }
  .row { display: flex; gap: 8px; margin-bottom: 12px; }
  button {
    background: #0277bd; color: white; border: none;
    padding: 8px 14px; border-radius: 4px; cursor: pointer;
    font-weight: bold;
  }
  button:disabled { background: #555; cursor: not-allowed; }
  label {
    display: block; margin: 8px 0; font-size: 13px;
    color: #ccc;
  }
  input[type="range"] { width: 100%; margin-top: 4px; }
  select {
    background: #111; color: #fff; border: 1px solid #444;
    padding: 4px 8px; margin-left: 8px;
  }
</style>