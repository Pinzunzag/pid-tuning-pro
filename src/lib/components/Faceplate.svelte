<script>
  /**
   * Faceplate SCADA-style para visualizar un lazo de control.
   *
   * @typedef {Object} FaceplateProps
   * @property {string} [tag]         - Etiqueta del tag (ej. "LIC-101")
   * @property {string} [description] - Descripción del lazo
   * @property {number} [sp]          - Setpoint
   * @property {number} [pv]          - Process Variable
   * @property {number} [op]          - Output del controlador (0-100 %)
   * @property {string} [unit]        - Unidades de ingeniería para SP/PV
   * @property {'AUTO'|'MAN'|'CAS'} [mode] - Modo del controlador
   */

  /** @type {FaceplateProps} */
  let {
    tag = 'LIC-101',
    description = 'Level Controller',
    sp = 50,
    pv = 50,
    op = 50,
    unit = '%',
    mode = 'AUTO'
  } = $props();

  // Helper defensivo: evita crash si el valor llega como undefined/null/string
  const fmt = (v, d = 2) =>
    Number.isFinite(+v) ? (+v).toFixed(d) : '--.--';

  // Derivación reactiva: la barra siempre entre 0 y 100
  let opBarWidth = $derived(
    Math.max(0, Math.min(100, Number.isFinite(+op) ? +op : 0))
  );

  // Clase segura para modo (defensiva)
  let modeClass = $derived(
    ['auto', 'man', 'cas'].includes(String(mode).toLowerCase())
      ? String(mode).toLowerCase()
      : 'auto'
  );
</script>

<div class="faceplate" role="group" aria-label="Faceplate {tag}">
  <div class="fp-title">
    <span class="tag">{tag}</span>
    <span class="fp-mode {modeClass}">{mode}</span>
  </div>
  <div class="fp-desc">{description}</div>

  <div class="fp-vals">
    <span class="lbl">SP</span>
    <span class="val sp-val">{fmt(sp)}</span>
    <span class="unit">{unit}</span>
  </div>
  <div class="fp-vals">
    <span class="lbl">PV</span>
    <span class="val pv-val">{fmt(pv)}</span>
    <span class="unit">{unit}</span>
  </div>
  <div class="fp-vals">
    <span class="lbl">CV</span>
    <span class="val op-val">{fmt(op)}</span>
    <span class="unit">%</span>
  </div>

  <div class="bar" aria-hidden="true">
    <div class="bar-fill" style="width: {opBarWidth}%"></div>
  </div>
</div>

<style>
  .faceplate {
    background: linear-gradient(180deg, #2e2e2e, #252525);
    border: 2px solid #555;
    border-radius: 6px;
    padding: 12px;
    font-family: Consolas, monospace;
    color: #e6e6e6;
    max-width: 300px;
  }
  .fp-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #555;
    padding-bottom: 4px;
    margin-bottom: 6px;
  }
  .tag {
    background: #111;
    border: 1px solid #444;
    color: #fff;
    font-weight: bold;
    letter-spacing: 2px;
    font-size: 13px;
    padding: 2px 6px;
    border-radius: 2px;
  }
  .fp-mode {
    padding: 2px 8px;
    border-radius: 3px;
    font-size: 10px;
    font-weight: bold;
  }
  .fp-mode.auto {
    background: #1b5e20;
    color: #a5d6a7;
  }
  .fp-mode.man {
    background: #e65100;
    color: #ffe0b2;
  }
  .fp-mode.cas {
    background: #0d47a1;
    color: #bbdefb;
  }
  .fp-desc {
    font-size: 10px;
    color: #8bd18b;
    text-align: center;
    margin-bottom: 8px;
    font-style: italic;
  }
  .fp-vals {
    display: grid;
    grid-template-columns: 45px 1fr 50px;
    gap: 4px;
    align-items: center;
    margin: 4px 0;
  }
  .lbl {
    color: #9aa0a6;
    font-weight: bold;
    font-size: 11px;
  }
  .val {
    font-size: 16px;
    text-align: right;
    padding: 2px 6px;
    border-radius: 2px;
    background: #111;
  }
  .pv-val { color: #7CFC00; }
  .sp-val { color: #ff5252; }
  .op-val { color: #42a5f5; }
  .unit {
    color: #8ec5ff;
    font-size: 10px;
    font-weight: bold;
  }
  .bar {
    height: 8px;
    background: #111;
    border: 1px solid #444;
    border-radius: 2px;
    overflow: hidden;
    margin-top: 8px;
  }
  .bar-fill {
    height: 100%;
    background: linear-gradient(90deg, #0277bd, #42a5f5);
    transition: width 0.2s;
  }
</style>
