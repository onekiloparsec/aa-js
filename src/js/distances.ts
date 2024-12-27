/**
 @module Distances
 */
import { HUBBLE_CONSTANT, ONE_UA_IN_KILOMETERS, PC2LY, PC2UA, SPEED_OF_LIGHT } from '@/js/constants'
import {
  ArcSecond,
  AstronomicalUnit,
  Day,
  Kilometer,
  KilometerPerSecondPerMegaParsec,
  LightYear,
  Magnitude,
  MegaParsec,
  Parsec
} from '@/js/types'

/**
 * Transform a distance in parsec into a parallax
 * @param {Parsec} parsec The input distance in parsecs
 * @returns {ArcSecond} The parallax
 */
export function getParallaxFromParsecs (parsec: Parsec): ArcSecond {
  return Math.atan(1. / (parsec * PC2UA)) * 3600.0 * 180.0 / Math.PI
}

/**
 * Transform a parallax into a distance in parsec.
 * @param {ArcSecond} arcseconds The parallax
 * @return {Parsec} The distance in parsec.
 */
export function getParsecsFromParallax (arcseconds: ArcSecond): Parsec {
  return 1. / Math.tan(arcseconds / 3600.0 * Math.PI / 180) / PC2UA
}

/**
 * Transform parsecs into Astronomical Units
 * @param {Parsec} pc
 * @return {AstronomicalUnit}
 */
export function getAstronomicalUnitsFromParsecs (pc: Parsec): AstronomicalUnit {
  return pc * PC2UA
}

/**
 * Transform Astronomical Units to parsecs
 * @param {AstronomicalUnit} AU
 * @return {Parsec}
 */
export function getParsecsFromAstronomicalUnits (AU: AstronomicalUnit): Parsec {
  return AU / PC2UA
}

/**
 * Transform parsecs into kilometers
 * @param {Parsec} pc
 * @return {Kilometer}
 */
export function getKilometersFromParsecs (pc: Parsec): Kilometer {
  return getAstronomicalUnitsFromParsecs(pc) * ONE_UA_IN_KILOMETERS
}

/**
 * Transform kilometers into parsecs
 * @param {Kilometer} km
 * @return {Parsec}
 */
export function getParsecsFromKilometers (km: Kilometer): Parsec {
  return getParsecsFromAstronomicalUnits(km / ONE_UA_IN_KILOMETERS)
}

/**
 * Transform parsecs into light-years
 * @param {Parsec} pc
 * @return {LightYear}
 */
export function getLightYearsFromParsecs (pc: Parsec): LightYear {
  return pc * PC2LY
}

/**
 * Transform light-years into parsecs
 * @param {LightYear} ly
 * @return {Parsec}
 */
export function getParsecsFromLightYears (ly: LightYear): Parsec {
  return ly / PC2LY
}

/**
 * Get the distance modulus from a distance in parsecs.
 * @param {Parsec} pc
 * @param {Magnitude} visualAbsorption The visual absorption (default = 0)
 * @return {Magnitude}
 */
export function getDistanceModulusFromParsecs (pc: Parsec, visualAbsorption: Magnitude = 0): Magnitude {
  return 5 * Math.log10(pc) - 5.0 + visualAbsorption
}

/**
 * Get the distance in parsecs from a distance modulus
 * @param {Magnitude} mM The distance modulus
 * @param {Magnitude} visualAbsorption The visual absorption (default = 0)
 * @returns {Parsec}
 */
export function getParsecsFromDistanceModulus (mM: Magnitude, visualAbsorption: Magnitude = 0): Parsec {
  return Math.pow(10.0, (mM + 5 - visualAbsorption) / 5)
}

/**
 * Transform a distance in Megaparsecs into a redshift
 * @param {MegaParsec} Mpc
 * @param {KilometerPerSecondPerMegaParsec} hubbleConstant The Hubble constant (default = 72)
 * @returns {number}
 */
export function getRedshiftFromMegaparsecs (Mpc: MegaParsec, hubbleConstant: KilometerPerSecondPerMegaParsec = HUBBLE_CONSTANT): number {
  return Mpc * hubbleConstant / SPEED_OF_LIGHT
}

/**
 * Transform a redshift into a distance in Megaparsecs
 * @param z
 * @param {KilometerPerSecondPerMegaParsec} hubbleConstant The Hubble constant (default = 72)
 * @return {MegaParsec}
 */
export function getMegaparsecsFromRedshift (z: number, hubbleConstant: KilometerPerSecondPerMegaParsec = HUBBLE_CONSTANT): MegaParsec {
  return z / hubbleConstant * SPEED_OF_LIGHT
}

export function getLightTimeFromDistance (distance: AstronomicalUnit): Day {
  return distance * 0.005_775_5183
}
