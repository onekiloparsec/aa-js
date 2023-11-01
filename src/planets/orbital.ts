import Decimal from '@/decimal'
import { AstronomicalUnit, Degree, JulianDay, LengthArray } from '@/types'
import { getJulianCentury } from '@/juliandays'

function getValue (jd: JulianDay | number, elementValues: [Decimal, Decimal, Decimal, Decimal]) {
  const T = getJulianCentury(jd)
  return new Decimal(elementValues[0])
    .plus(new Decimal(elementValues[1]).mul(T))
    .plus(new Decimal(elementValues[2]).mul(T.pow(2)))
    .plus(new Decimal(elementValues[3]).mul(T.pow(3)))
}

export function getPlanetMeanLongitude (jd: JulianDay | number, meanLongitude: LengthArray<Degree, 4>): Degree {
  return getValue(jd, meanLongitude)
}

export function getPlanetSemiMajorAxis (jd: JulianDay | number, semiMajorAxis: LengthArray<AstronomicalUnit, 4>): Degree {
  return getValue(jd, semiMajorAxis)
}

export function getPlanetEccentricity (jd: JulianDay | number, eccentricity: LengthArray<Decimal, 4>): Decimal {
  return getValue(jd, eccentricity)
}

export function getPlanetInclination (jd: JulianDay | number, inclination: LengthArray<Degree, 4>): Degree {
  return getValue(jd, inclination)
}

export function getPlanetLongitudeOfAscendingNode (jd: JulianDay | number, longitudeOfAscendingNode: LengthArray<Degree, 4>): Degree {
  return getValue(jd, longitudeOfAscendingNode)
}

export function getPlanetLongitudeOfPerihelion (jd: JulianDay | number, longitudeOfPerihelion: LengthArray<Degree, 4>): Degree {
  return getValue(jd, longitudeOfPerihelion)
}
