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
