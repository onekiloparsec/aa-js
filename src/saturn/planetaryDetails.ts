import { Degree, EllipticalDetails, JulianDay, Magnitude } from '../types'
import { DEG2RAD, RAD2DEG } from '../constants'
import { getEllipticalDetails } from '../elliptical'
import { MapTo0To360Range } from '../utils'
import * as earth from '../earth'

import { getEclipticLatitude, getEclipticLongitude, getRadiusVector } from './coordinates'
import { getRingSystemDetails } from './ringSystem'

export function getPlanetaryDetails (jd: JulianDay): EllipticalDetails {
  return getEllipticalDetails(jd, getEclipticLongitude, getEclipticLatitude, getRadiusVector)
}

// / The phase angle, that is the angle (Sun-planet-Earth).
export function getPhaseAngle (jd: JulianDay): Degree {
  const r = getRadiusVector(jd)
  const R = earth.getRadiusVector(jd)
  const Delta = getPlanetaryDetails(jd).apparentGeocentricDistance
  return MapTo0To360Range(RAD2DEG * (Math.acos((r * r + Delta * Delta - R * R) / (2 * r * Delta))))
}

// / The illuminated fraction of the planet as seen from the Earth. Between 0 and 1.
export function getIlluminatedFraction (jd: JulianDay): number {
  const phaseAngle = getPhaseAngle(jd) * DEG2RAD
  return (1 + Math.cos(phaseAngle)) / 2
}

/// The magnitude of the planet, which depends on the planet's distance to the Earth,
/// its distance to the Sun and the phase angle i (Sun-planet-Earth).
/// Implementation return the modern American Astronomical Almanac value instead of Mueller's
/// Includes the contribution from the ring.
export function getMagnitude (jd: JulianDay): Magnitude {
  const r = getRadiusVector(jd)
  const Delta = getPlanetaryDetails(jd).apparentGeocentricDistance

  const ringSystem = getRingSystemDetails(jd)
  const B = ringSystem.earthCoordinates.latitude * DEG2RAD
  const sinB = Math.sin(ringSystem.earthCoordinates.latitude)
  const DeltaU = ringSystem.saturnicentricSunEarthLongitudesDifference

  return -8.88 + 5 * Math.log10(r * Delta) + 0.044 * Math.abs(DeltaU) - 2.60 * Math.sin(Math.abs(B)) + 1.25 * sinB * sinB
}

/// The equatorial semi diameter of the planet. Note that values of the Astronomical Almanac of 1984 are returned.
/// There are also older values (1980) named "A" values. In the case of Venus, the "B" value refers to the planet's
/// crust, while the "A" value refers to the top of the cloud level. The latter is more relevant for astronomical
/// phenomena such as transits and occultations.
export function getEquatorialSemiDiameter (jd: JulianDay): Degree {
  const Delta = getPlanetaryDetails(jd).apparentGeocentricDistance
  return 8.34 / Delta
}

/// The polar semi diameter of the planet. See `equatorialSemiDiameter` about "A" et "B" values.
/// Note that for all planets but Jupiter and Saturn, the polarSemiDiameter is identical to the equatorial one.
export function getPolarSemiDiameter (jd: JulianDay): Degree {
  return getEquatorialSemiDiameter(jd)
}
