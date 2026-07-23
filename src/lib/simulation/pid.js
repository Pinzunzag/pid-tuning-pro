/**
 * Controlador PID paralelo con anti-windup por back-calculation.
 * @typedef {Object} PIDParams
 * @property {number} kp - Ganancia proporcional
 * @property {number} ti - Tiempo integral (s). Usa Infinity para desactivar I
 * @property {number} td - Tiempo derivativo (s). Usa 0 para desactivar D
 * @property {number} [opMin=0] - Límite inferior de salida
 * @property {number} [opMax=100] - Límite superior de salida
 */

export class PID {
  /** @param {PIDParams} params */
  constructor({ kp, ti, td, opMin = 0, opMax = 100 }) {
    this.kp = kp;
    this.ti = ti;
    this.td = td;
    this.opMin = opMin;
    this.opMax = opMax;
    this.integral = 0;
    this.prevError = 0;
    this.prevPv = 0;
  }

  /**
   * Calcula la salida del controlador.
   * @param {number} sp - Setpoint
   * @param {number} pv - Process Variable
   * @param {number} dt - Delta de tiempo (s)
   * @returns {number} Salida CV entre opMin y opMax
   */
  step(sp, pv, dt) {
    const error = sp - pv;

    // Proporcional
    const P = this.kp * error;

    // Integral (con anti-windup simple por clamping)
    if (Number.isFinite(this.ti) && this.ti > 0) {
      this.integral += (this.kp / this.ti) * error * dt;
    }

    // Derivativo sobre PV (evita "derivative kick")
    const D = this.td > 0 ? -this.kp * this.td * (pv - this.prevPv) / dt : 0;

    let output = P + this.integral + D;

    // Clamping + anti-windup
    if (output > this.opMax) {
      this.integral -= (output - this.opMax);
      output = this.opMax;
    } else if (output < this.opMin) {
      this.integral += (this.opMin - output);
      output = this.opMin;
    }

    this.prevError = error;
    this.prevPv = pv;
    return output;
  }

  reset() {
    this.integral = 0;
    this.prevError = 0;
    this.prevPv = 0;
  }
}