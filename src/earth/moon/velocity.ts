import { Degree, Meter, Kilometer, JulianDay, GeographicCoordinates, KilometerPerSecond } from '@/types'
import { getApparentGeocentricEquatorialCoordinates, getRadiusVectorInKilometer } from './coordinates'
import { getLocalSiderealTime } from '@/juliandays'
import { H2DEG } from '@/constants'

type Vec3 = { x: number; y: number; z: number };

const DEG2RAD = Math.PI / 180
const EARTH_RADIUS_KM = 6378.137

function getNorm (v: Vec3): number {
  return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z)
}

function substract (a: Vec3, b: Vec3): Vec3 {
  return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z }
}

function moonGeocentricVectorKm (ra: Degree, dec: Degree, r: Kilometer): Vec3 {
  const raRad = ra * DEG2RAD
  const decRad = dec * DEG2RAD
  const cosd = Math.cos(decRad)
  return {
    x: r * cosd * Math.cos(raRad),
    y: r * cosd * Math.sin(raRad),
    z: r * Math.sin(decRad),
  }
}

/**
 * Observer geocentric vector in the *equatorial* frame of date using local sidereal time.
 * lmst is the local sidereal time angle in degrees (0..360).
 */
function observerVectorEquatorialKm (lat: Degree, lmst: Degree, h: Meter = 0): Vec3 {
  const latRad = lat * DEG2RAD
  const lmstRad = lmst * DEG2RAD
  const R = EARTH_RADIUS_KM + h / 1000
  const cosLat = Math.cos(latRad)
  return {
    x: R * cosLat * Math.cos(lmstRad),
    y: R * cosLat * Math.sin(lmstRad),
    z: R * Math.sin(latRad),
  }
}

/**
 * Compute topocentric range rho (km).
 *
 * You must supply:
 * - geocentric RA/Dec in degrees
 * - geocentric distance r (km)
 * - observer lat (deg), height (m)
 * - local sidereal time angle (deg) for the observer at jd
 */
function topocentricRangeKm (
  ra: Degree,
  dec: Degree,
  r: Kilometer,
  obsLat: Degree,
  obsLMST: Degree,
  obsHeight: Meter
): Kilometer {
  const rMoon = moonGeocentricVectorKm(ra, dec, r)
  const rObs = observerVectorEquatorialKm(obsLat, obsLMST, obsHeight)
  return getNorm(substract(rMoon, rObs))
}

/**
 * Topocentric Moon radial velocity (km/s) relative to an observer on Earth.
 *
 * Uses:
 * - apparent geocentric RA/Dec of the Moon
 * - geocentric Earth–Moon distance (radius vector) in km
 * - observer site (lat/lng/height)
 * - central difference with Δt = 60 s
 *
 * Sign: positive = receding, negative = approaching.
 */
export function getTopocentricRadialVelocity (
  jd: JulianDay,
  observer: GeographicCoordinates
): KilometerPerSecond {
  const deltaTSec = 60
  const deltaJd = deltaTSec / 86400
  
  const jdMinus = jd - deltaJd
  const jdPlus = jd + deltaJd
  
  const equMinus = getApparentGeocentricEquatorialCoordinates(jdMinus)
  const equPlus = getApparentGeocentricEquatorialCoordinates(jdPlus)
  
  const rMinus = getRadiusVectorInKilometer(jdMinus)
  const rPlus = getRadiusVectorInKilometer(jdPlus)
  
  const lstMinusDeg = getLocalSiderealTime(jdMinus, observer.longitude) * H2DEG
  const lstPlusDeg = getLocalSiderealTime(jdPlus, observer.longitude) * H2DEG
  
  const rhoMinus = topocentricRangeKm(
    equMinus.rightAscension,
    equMinus.declination,
    rMinus,
    observer.latitude,
    lstMinusDeg,
    observer.height ?? 0
  )
  
  const rhoPlus = topocentricRangeKm(
    equPlus.rightAscension,
    equPlus.declination,
    rPlus,
    observer.latitude,
    lstPlusDeg,
    observer.height ?? 0
  )
  
  return (rhoPlus - rhoMinus) / (2 * deltaTSec)
}