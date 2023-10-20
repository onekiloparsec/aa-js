import { PlanetConstants, PlanetOrbitalElements } from '@/types'

/**
 * Planet constants, copied from the JPL
 * Reference: https://ssd.jpl.nasa.gov/?planet_phys_par
 */
export const constants: PlanetConstants = {
  equatorialRadius: 2440.53,
  meanRadius: 2439.4,
  mass: 0.330114,
  bulkDensity: 5.4291,
  siderealRotationPeriod: 58.6462,
  siderealOrbitPeriod: 0.2408467,
  visualMagnitude: -0.60,
  geometricAlbedo: 0.106,
  equatorialGravity: 3.70,
  escapeVelocity: 4.25
}



/**
 * Orbital Elements for the mean equinox of date
 * Reference: Astronomical Algorithms, J. Meus, pp. 212-213 (Table 31.A).
 */
export const orbitalElements: PlanetOrbitalElements = {
  meanLongitude: [181.979801, 58519.2130302, 0.00031014, 0.000000015],
  semiMajorAxis: 0.723329820,
  eccentricity: [0.00677192, -0.000047765, 0.0000000981, 0.00000000046],
  inclination: [3.394662, 0.0010037, -0.00000088, -0.000000007],
  longitudeOfAscendingNode: [76.679920, 0.9011206, 0.00040618, -0.000000093],
  longitudeOfPerihelion: [131.563703, 1.4022288, -0.00107618, -0.000005678]
}

/**
 * Orbital Elements for the standard equinox J2000
 * Reference: Astronomical Algorithms, J. Meus, pp. 212-213 (Table 31.B).
 */
export const orbitalElementsJ2000: PlanetOrbitalElements = {
  meanLongitude: [181.979801, 58517.8156760, 0.00000165, -0.000000002],
  semiMajorAxis: orbitalElements.semiMajorAxis,
  eccentricity: orbitalElements.eccentricity,
  inclination: [3.394662, -0.0008568, -0.00003244, 0.00000009],
  longitudeOfAscendingNode: [76.679920, -0.2780134, -0.00014257, -0.000000164],
  longitudeOfPerihelion: [131.563703, 0.0048746, -0.00138467, -0.000005695]
}
