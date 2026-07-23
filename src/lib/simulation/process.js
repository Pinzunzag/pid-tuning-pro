/**
 * Modelo First Order Plus Dead Time (FOPDT).
 * G(s) = K * e^(-θs) / (τs + 1)
 * Discretizado por Euler: y[k+1] = y[k] + dt * (K*u_delayed - y[k]) / τ
 */
export class FOPDT {
  /**
   * @param {Object} params
   * @param {number} params.gain     - Ganancia del proceso K
   * @param {number} params.tau      - Constante de tiempo τ (s)
   * @param {number} params.deadTime - Tiempo muerto θ (s)
   * @param {number} [params.y0=50]  - Estado inicial
   */
  constructor({ gain, tau, deadTime, y0 = 50 }) {
    this.K = gain;
    this.tau = tau;
    this.theta = deadTime;
    this.y = y0;
    /** @type {number[]} Cola para dead time */
    this.buffer = [];
  }

  /**
   * Avanza el proceso un paso dt con entrada u.
   * @param {number} u  - Entrada (CV del controlador, 0-100 %)
   * @param {number} dt - Delta de tiempo (s)
   * @returns {number} Nueva PV
   */
  step(u, dt) {
    // Encolar entrada actual
    this.buffer.push(u);

    // Extraer entrada retardada según dead time
    const delaySteps = Math.max(1, Math.round(this.theta / dt));
    const uDelayed =
      this.buffer.length > delaySteps ? this.buffer.shift() : this.buffer[0];

    // EDO discretizada por Euler
    const dy = (this.K * uDelayed - this.y) / this.tau;
    this.y += dy * dt;

    return this.y;
  }

  reset(y0 = 50) {
    this.y = y0;
    this.buffer = [];
  }
}
