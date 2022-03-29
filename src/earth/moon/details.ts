import { DEG2RAD, Degree, JulianDay, RAD2DEG } from '../../constants'
import * as sun from '../../sun'
import * as earth from '../../earth'

import { getEclipticLatitude, getEclipticLongitude, getRadiusVector } from './coordinates'

// / The phase angle, that is the angle (Sun-planet-Earth).
export function getPhaseAngle (jd: JulianDay): Degree {
  const sunLongitude = sun.getGeometricEclipticLongitude(jd)
  const moonCoords = { longitude: getEclipticLongitude(jd), latitude: getEclipticLatitude(jd) }

  // Geocentric elongation Psi of the Moon from the Sun
  const psi = Math.acos(Math.cos(moonCoords.latitude * DEG2RAD) * Math.cos((moonCoords.longitude - sunLongitude) * DEG2RAD))

  // Distance Earth-Moon
  const Delta = getRadiusVector(jd)
  const R = earth.getRadiusVector(jd)

  return Math.atan2(R * Math.sin(psi), Delta - R * Math.cos(psi)) * RAD2DEG
}

// / The illuminated fraction of the Moon as seen from the Earth. Between 0 and 1.
export function getIlluminatedFraction (jd: JulianDay): number {
  const phaseAngle = getPhaseAngle(jd) * DEG2RAD
  return (1 + Math.cos(phaseAngle)) / 2
}

export function getEquatorialHorizontalParallax (jd: JulianDay): Degree {
  return Math.asin(6378.14 / getRadiusVector(jd)) * RAD2DEG
}
