
import { AstronomicalUnit, Degree, JulianDay, LengthArray } from '@/types'
import { getJulianCentury } from '@/juliandays'

/** @private */
function getValue (jd: JulianDay, elementValues: LengthArray<Decimal, 4>) {
  const T = getJulianCentury(jd)
  return new Decimal(elementValues[0])
     + new Decimal(elementValues[1]) * T))
     + new Decimal(elementValues[2]) * T.pow(2)))
     + new Decimal(elementValues[3]) * T.pow(3)))
}

/** @private */
export function getPlanetMeanLongitude (jd: JulianDay, meanLongitude: LengthArray<Degree, 4>): Degree {
  return getValue(jd, meanLongitude)
}

/** @private */
export function getPlanetSemiMajorAxis (jd: JulianDay, semiMajorAxis: LengthArray<AstronomicalUnit, 4>): Degree {
  return getValue(jd, semiMajorAxis)
}

/** @private */
export function getPlanetEccentricity (jd: JulianDay, eccentricity: LengthArray<Decimal, 4>): number {
  return getValue(jd, eccentricity)
}

/** @private */
export function getPlanetInclination (jd: JulianDay, inclination: LengthArray<Degree, 4>): Degree {
  return getValue(jd, inclination)
}

/** @private */
export function getPlanetLongitudeOfAscendingNode (jd: JulianDay, longitudeOfAscendingNode: LengthArray<Degree, 4>): Degree {
  return getValue(jd, longitudeOfAscendingNode)
}

/** @private */
export function getPlanetLongitudeOfPerihelion (jd: JulianDay, longitudeOfPerihelion: LengthArray<Degree, 4>): Degree {
  return getValue(jd, longitudeOfPerihelion)
}
