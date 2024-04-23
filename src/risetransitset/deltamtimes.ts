import { Degree, EquatorialCoordinates, GeographicCoordinates, LengthArray } from '@/types'
import { DEG2RAD, STANDARD_ALTITUDE_STARS } from '@/constants'
import { fmod180, fmod360 } from '@/utils'


// See AA p24
function getInterpolatedValue (v1: number, v2: number, v3: number, n: number): number {
  const a = v2 - v1
  const b = v3 - v2
  const c = b - a
  return v2 + n / 2 * (a + b + n * c)
}

function getInterpolatedValueNum (v1: number, v2: number, v3: number, n: number): number {
  const a = v2 - v1
  const b = v3 - v2
  const c = b - a
  return v2 + (n / 2) * (a + b + (n * c))
}

export function getDeltaMTimes (m: number,
                                isTransit: boolean,
                                Theta0: Degree,
                                DeltaT: number,
                                equCoords: LengthArray<EquatorialCoordinates, 3>,
                                geoCoords: GeographicCoordinates,
                                alt: Degree = STANDARD_ALTITUDE_STARS): {
  Deltam: number,
  hourAngle: Degree,
  localAltitude: Degree
} {
  const theta0 = fmod360(Theta0 + 360.985647 * m)
  const n = m + DeltaT / 86400
  
  const alpha = getInterpolatedValue(equCoords[0].rightAscension, equCoords[1].rightAscension, equCoords[2].rightAscension, n)
  const delta = getInterpolatedValue(equCoords[0].declination, equCoords[1].declination, equCoords[2].declination, n)
  const lng = geoCoords.longitude
  const lat = geoCoords.latitude
  const H = fmod180(theta0 + lng - alpha)
  
  // Below is the horizontal altitude for given hour angle.
  const sinh = Math.sin(lat * DEG2RAD) * Math.sin(delta * DEG2RAD)
    + Math.cos(lat * DEG2RAD) * Math.cos(delta * DEG2RAD) * Math.cos(H * DEG2RAD)
  
  const h = Math.asin(sinh) / DEG2RAD
  return {
    Deltam: (isTransit) ?
      -1 * H / 360 :
      (h - alt) / (Math.cos(delta * DEG2RAD) * Math.cos(lat * DEG2RAD) * Math.sin(H * DEG2RAD) * 360),
    hourAngle: H,
    localAltitude: h
  }
}
