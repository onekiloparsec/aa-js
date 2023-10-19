import { PlanetConstants, PlanetOrbitalElements } from '@/types'

/**
 * Planet constants, copied from the JPL
 * Reference: https://ssd.jpl.nasa.gov/?planet_phys_par
 */
export const constants: PlanetConstants = {
  equatorialRadius: 6051.8,
  meanRadius: 6051.8,
  mass: 4.86747,
  bulkDensity: 5.243,
  siderealRotationPeriod: -243.018, // negative
  siderealOrbitPeriod: 0.61519726,
  visualMagnitude: -4.47,
  geometricAlbedo: 0.65,
  equatorialGravity: 8.87,
  escapeVelocity: 10.36
}

/**
 * Orbital Elements for the mean equinox of date
 * Reference: Astronomical Algorithms, J. Meus, pp. 212-213 (Table 31.A).
 */
export const orbitalElements: PlanetOrbitalElements = {
  meanLongitude: [181.979801, 58519.2130302, 0.00031014, 0.000000015],
  semiMajorAxis: 0.723329820,
  eccentricity: [0.00677192, -0.000047765, 0.0000000981, 0.00000000046],
  inclination: [3.394662, 0.0010037, -0.00000088, 0.000000007],
  longitudeOfAscendingNode: [76.679920, 0.9011206, 0.00040618, -0.000000093],
  longitudeOfPerihelion: [131.563703, 1.4022288, -0.00107618, -0.000005678]
}

/**
 * Orbital Elements for the standard equinox J2000
 * Reference: Astronomical Algorithms, J. Meus, pp. 212-213 (Table 31.A).
 */
export const orbitalElementsJ2000: PlanetOrbitalElements = {
  meanLongitude: [181.979801, 58519.2130302, 0.00031014, 0.000000015],
  semiMajorAxis: 0.723329820,
  eccentricity: [0.00677192, -0.000047765, 0.0000000981, 0.00000000046],
  inclination: [3.394662, 0.0010037, -0.00000088, 0.000000007],
  longitudeOfAscendingNode: [76.679920, 0.9011206, 0.00040618, -0.000000093],
  longitudeOfPerihelion: [131.563703, 1.4022288, -0.00107618, -0.000005678]
}
