import { EllipticalDetails, JulianDay } from '../constants'
import { getEllipticalDetails } from '../elliptical'
import { getEclipticLatitude, getEclipticLongitude, getRadiusVector } from './coordinates'

export function getPlanetaryDetails(jd: JulianDay): EllipticalDetails {
  return getEllipticalDetails(jd, getEclipticLongitude, getEclipticLatitude, getRadiusVector)
}

