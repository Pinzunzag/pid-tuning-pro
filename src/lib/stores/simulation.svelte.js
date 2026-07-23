import { PID } from '$lib/simulation/pid.js';
import { FOPDT } from '$lib/simulation/process.js';

/**
 * Store reactivo Svelte 5 (Runes) para la simulación PID en vivo.
 * Devuelve un objeto con getters/setters reactivos + start/stop/reset.
 */
export function createSimulation() {
  // ---- Estado reactivo (Runes) ----
  let sp = $state(50);
  let pv = $state(50);
  let op = $state(50);
  let running = $state(false);
  let mode = $state('AUTO');

  // Parámetros de tuning
  let kp = $state(1.5);
  let ti = $state(10);
  let td = $state(0);

  // ---- Motor (no reactivo, se sincroniza en cada tick) ----
  // Nota: inicializamos con literales para evitar el warning
  // "state_referenced_locally". Los valores reales se sincronizan
  // en cada iteración del interval más abajo.
  const pid = new PID({ kp: 1.5, ti: 10, td: 0 });
  const plant = new FOPDT({ gain: 1.0, tau: 15, deadTime: 2, y0: 50 });

  const dt = 0.1; // 100 ms
  /** @type {ReturnType<typeof setInterval> | null} */
  let intervalId = null;

  function tick() {
    // Sincronizar tuning por si el usuario movió los sliders
    pid.kp = kp;
    pid.ti = ti;
    pid.td = td;

    if (mode === 'AUTO') {
      op = pid.step(sp, pv, dt);
    }
    // En MAN, el CV lo controla el usuario directamente (bind)
    pv = plant.step(op, dt);
  }

  function start() {
    if (running) return;
    running = true;
    intervalId = setInterval(tick, dt * 1000);
  }

  function stop() {
    running = false;
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  function reset() {
    stop();
    pv = 50;
    op = 50;
    pid.reset();
    plant.reset(50);
  }

  return {
    // Getters/setters reactivos expuestos al componente
    get sp() { return sp; }, set sp(v) { sp = v; },
    get pv() { return pv; },
    get op() { return op; }, set op(v) { op = v; },
    get mode() { return mode; }, set mode(v) { mode = v; },
    get kp() { return kp; }, set kp(v) { kp = v; },
    get ti() { return ti; }, set ti(v) { ti = v; },
    get td() { return td; }, set td(v) { td = v; },
    get running() { return running; },
    start,
    stop,
    reset
  };
}
