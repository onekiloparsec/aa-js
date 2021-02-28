import { AstronomicalUnit, JulianDay } from '../constants'
import { EquatorialCoordinates } from '../coordinates'
import { getEllipticalDetails } from '../elliptical'
import { getEclipticLatitude, getEclipticLongitude, getRadiusVector } from './coordinates'

export function getApparentGeocentricDistance(jd: JulianDay): AstronomicalUnit {
  const ellipticalDetails = getEllipticalDetails(jd, getEclipticLongitude, getEclipticLatitude, getRadiusVector)
  return ellipticalDetails.apparentGeocentricDistance
}

export function getApparentGeocentricEquatorialCoordinates(jd: JulianDay): EquatorialCoordinates {
  const ellipticalDetails = getEllipticalDetails(jd, getEclipticLongitude, getEclipticLatitude, getRadiusVector)
  return ellipticalDetails.apparentGeocentricEquatorialCoordinates
}

/// The true geocentric distance of the planet
// export function getTrueGeocentricDistance(jd: JulianDay): AstronomicalUnit {
// }

/// The phase angle, that is the angle (Sun-planet-Earth).
// export function getPhaseAngle(jd: JulianDay): Degree {
// }

/// The illuminated fraction of the planet as seen from the Earth. Between 0 and 1.
// export function getIlluminatedFraction(jd: JulianDay): number {
// }

/// The magnitude of the planet, which depends on the planet's distance to the Earth,
/// its distance to the Sun and the phase angle i (Sun-planet-Earth).
/// Implementation return the modern American Astronomical Almanac value instead of Mueller's
// export function getMagnitude(jd: JulianDay): Magnitude {
// }

/// The magnitude of the planet, which depends on the planet's distance to the Earth,
/// its distance to the Sun and the phase angle i (Sun-planet-Earth).
/// Implementation return the old Muller's values.
// export function getMagnitudeMuller(jd: JulianDay): Magnitude {
// }

/// The equatorial semi diameter of the planet. Note that values of the Astronomical Almanac of 1984 are returned.
/// There are also older values (1980) named "A" values. In the case of Venus, the "B" value refers to the planet's
/// crust, while the "A" value refers to the top of the cloud level. The latter is more relevant for astronomical
/// phenomena such as transits and occultations.
// export function getEquatorialSemiDiameter(jd: JulianDay): Degree {
// }

/// The polar semi diameter of the planet. See `equatorialSemiDiameter` about "A" et "B" values.
/// Note that for all planets but Jupiter and Saturn, the polarSemiDiameter is identical to the equatorial one.
// export function getPolarSemiDiameter(jd: JulianDay): Degree {
// }
