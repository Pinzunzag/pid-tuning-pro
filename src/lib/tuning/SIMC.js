// SIMC (Skogestad) tuning — Improved variant v2.24.5+
// Reference: Skogestad-Grimholt 2012

const KP_MAX = 10;
const KP_MIN = 0.05;
const TI_MIN = 0.5;
const LAG_DOMINANT_RATIO = 5;

const OBJ_LAMBDA_MULT = {
  aggressive: 1.0,
  balanced: 3.0,
  conservative: 8.0
};

export function computeSIMC(params) {
  const { Kp_process, tau, theta, objective, sliderPos, controllerType, alpha } = params;
  
  if (Kp_process === 0 || tau <= 0) return null;
  
  const baseMult = OBJ_LAMBDA_MULT[objective];
  const respFactor = 2.0 - 1.5 * sliderPos; // 0=very robust, 1=very aggressive
  const lambda = Math.max(0.1 * theta, theta * baseMult * respFactor);
  
  let Kp = tau / (Kp_process * (lambda + theta));
  const tauThetaRatio = tau / theta;
  const isLagDominant = tauThetaRatio > LAG_DOMINANT_RATIO;
  
  let Ti;
  if (isLagDominant) {
    Ti = 4 * (lambda + theta); // Extended
  } else {
    Ti = Math.min(tau, 4 * (lambda + theta)); // Classic
  }
  
  let Td = 0;
  if (controllerType === 'PID') Td = theta / 2;
  
  // Safety caps
  Kp = Math.min(Math.max(Math.abs(Kp), KP_MIN), KP_MAX);
  Ti = Math.max(Ti, TI_MIN);
  
  return {
    Kp, Ti, Td, alpha,
    lambda,
    simcVariant: isLagDominant ? 'extended' : 'classic',
    tauThetaRatio
  };
}

export function estimateDampingFromOvershoot(overshootPct) {
  if (overshootPct <= 0.1) return 1.0;
  const os = Math.min(0.99, overshootPct / 100);
  const lnOS = Math.log(os);
  const zeta = -lnOS / Math.sqrt(Math.PI * Math.PI + lnOS * lnOS);
  return Math.max(0.05, Math.min(1.5, zeta));
}