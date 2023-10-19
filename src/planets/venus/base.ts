import { AstronomicalUnit, Equinox, JulianDay, KilometerPerSecond } from '@/types'
import { getFractionalYear } from '@/dates'
import {
  getPlanetInstantaneousVelocity,
  getPlanetVelocityAtAphelion,
  getPlanetVelocityAtPerihelion
} from '../elliptical'
import { getRadiusVector } from './coordinates'
import { orbitalElements, orbitalElementsJ2000 } from './constants'

// The value of K must be an integer
function getK (jd: JulianDay): number {
  const decimalYear = getFractionalYear(jd)
  return Math.floor(1.62549 * (decimalYear - 2000.53))
}

/**
 * Aphelion (time of passage at the closest point to the Sun)
 * @param {JulianDay} jd The julian day
 * @returns {JulianDay}
 */
export function getAphelion (jd: JulianDay): JulianDay {
  const kdash = getK(jd) + 0.5
  return 2451738.233 + 224.7008188 * kdash - 0.0000000327 * kdash * kdash
}

/**
 * Perihelion (time of passage at the farthest point to the Sun)
 * @param {JulianDay} jd The julian day
 * @returns {JulianDay}
 */
export function getPerihelion (jd: JulianDay): JulianDay {
  const k = getK(jd)
  return 2451738.233 + 224.7008188 * k - 0.0000000327 * k * k
}
