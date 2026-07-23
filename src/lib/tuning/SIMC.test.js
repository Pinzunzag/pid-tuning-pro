import { describe, it, expect } from 'vitest';
import { computeSIMC, estimateDampingFromOvershoot } from './SIMC.js';

describe('SIMC Tuning', () => {
  it('LIC preset gives expected Balanced tuning', () => {
    const result = computeSIMC({
      Kp_process: 1.0,
      tau: 25,
      theta: 3,
      objective: 'balanced',
      sliderPos: 0.5,
      controllerType: 'PI',
      alpha: 0.1
    });
    
    expect(result).not.toBeNull();
    expect(result.Kp).toBeGreaterThan(0.5);
    expect(result.Kp).toBeLessThan(3.0);
    expect(result.simcVariant).toBe('extended'); // τ/θ = 8.3 > 5
  });
  
  it('Damping estimation matches formula', () => {
    // 10% overshoot → zeta ≈ 0.591
    const zeta = estimateDampingFromOvershoot(10);
    expect(zeta).toBeCloseTo(0.591, 2);
  });
});