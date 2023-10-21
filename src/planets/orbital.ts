import Decimal from 'decimal.js'
import { Degree, JulianDay, PlanetOrbitalElements } from '@/types'
import { getJulianCentury } from '@/juliandays'

function getValue (jd: JulianDay | number, elementValues: [Decimal, Decimal, Decimal, Decimal]) {
  const T = getJulianCentury(jd)
  return new Decimal(elementValues[0])
    .plus(new Decimal(elementValues[1]).mul(T))
    .plus(new Decimal(elementValues[2]).mul(T.pow(2)))
    .plus(new Decimal(elementValues[3]).mul(T.pow(3)))
}

export function getPlanetMeanLongitude (jd: JulianDay | number, planetElements: PlanetOrbitalElements): Degree {
  return getValue(jd, planetElements.meanLongitude)
}

export function getPlanetEccentricity (jd: JulianDay | number, planetElements: PlanetOrbitalElements): Decimal {
  return getValue(jd, planetElements.eccentricity)
}

export function getPlanetInclination (jd: JulianDay | number, planetElements: PlanetOrbitalElements): Degree {
  return getValue(jd, planetElements.inclination)
}

export function getPlanetLongitudeOfAscendingNode (jd: JulianDay | number, planetElements: PlanetOrbitalElements): Degree {
  return getValue(jd, planetElements.longitudeOfAscendingNode)
}

export function getPlanetLongitudeOfPerihelion (jd: JulianDay | number, planetElements: PlanetOrbitalElements): Degree {
  return getValue(jd, planetElements.longitudeOfPerihelion)
}
