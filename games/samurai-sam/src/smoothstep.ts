export function smoothstep(min: number, max: number, ratio: number) {
  // Ensure ratio is within the range [0, 1]
  ratio = Math.max(0, Math.min(1, ratio));

  // Apply the smoothstep interpolation formula
  const t = ratio;

  // Interpolate between min and max using the calculated t
  return min + t * (max - min);
}
