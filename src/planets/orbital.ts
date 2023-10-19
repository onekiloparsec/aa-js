import { Degree, JulianDay, PlanetOrbitalElements } from '@/types'
import { getJulianCentury } from '@/juliandays'

function getValue (jd: JulianDay, elementValues: [number, number, number, number]) {
  const T = getJulianCentury(jd)
  return elementValues[0] + elementValues[1] * T + elementValues[2] * T * T + elementValues[3] * T * T * T
}

export function getPlanetMeanLongitude (jd: JulianDay, planetElements: PlanetOrbitalElements): Degree {
  return getValue(jd, planetElements.meanLongitude)
}

export function getPlanetEccentricity (jd: JulianDay, planetElements: PlanetOrbitalElements): number {
  return getValue(jd, planetElements.eccentricity)
}

export function getPlanetInclination (jd: JulianDay, planetElements: PlanetOrbitalElements): number {
  return getValue(jd, planetElements.inclination)
}

export function getPlanetLongitudeOfAscendingNode (jd: JulianDay, planetElements: PlanetOrbitalElements): number {
  return getValue(jd, planetElements.longitudeOfAscendingNode)
}

export function getPlanetLongitudeOfPerihelion (jd: JulianDay, planetElements: PlanetOrbitalElements): number {
  return getValue(jd, planetElements.longitudeOfPerihelion)
}
