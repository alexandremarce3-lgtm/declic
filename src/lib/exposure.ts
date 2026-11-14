/**
 * Modèle simplifié du triangle d'exposition.
 * Exposition relative ∝ lumière × t × ISO / N²  → écart en « stops » = log2(rapport).
 */

export const APERTURES = [1.4, 2, 2.8, 4, 5.6, 8, 11, 16, 22] as const;
export const SHUTTERS = [1 / 2, 1 / 4, 1 / 8, 1 / 15, 1 / 30, 1 / 60, 1 / 125, 1 / 250, 1 / 500, 1 / 1000, 1 / 2000] as const;
export const ISOS = [100, 200, 400, 800, 1600, 3200, 6400] as const;

/** Réglage de référence considéré comme « bien exposé » pour la scène de plein jour */
export const REFERENCE = { aperture: 5.6, shutter: 1 / 125, iso: 400 };

export type ExposureSettings = { aperture: number; shutter: number; iso: number };

/**
 * Écart d'exposition en stops (0 = correct).
 * `light` : luminosité de la scène en stops par rapport à la référence (négatif = plus sombre).
 */
export function exposureOffset({ aperture, shutter, iso }: ExposureSettings, light = 0): number {
  const ratio =
    (shutter / REFERENCE.shutter) *
    (iso / REFERENCE.iso) *
    (REFERENCE.aperture ** 2 / aperture ** 2);
  return Math.log2(ratio) + light;
}

/** Index du cran le plus proche (en échelle logarithmique) */
export function nearestIndex(values: readonly number[], v: number): number {
  let best = 0;
  values.forEach((x, i) => {
    if (Math.abs(Math.log(x / v)) < Math.abs(Math.log(values[best] / v))) best = i;
  });
  return best;
}

/** Notations universelles (identiques dans toutes les langues) */
export const formatAperture = (n: number) => `f/${n}`;

export const formatShutter = (t: number) => (t >= 1 ? `${t} s` : `1/${Math.round(1 / t)} s`);

export const formatIso = (iso: number) => `ISO ${iso}`;

/** Seuil sous lequel un écart d'exposition est considéré comme correct */
export const EXPOSURE_TOLERANCE = 0.5;
