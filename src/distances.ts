/**
 @module Distances
 */
import Decimal from '@/decimal'
import { FIVE, HUBBLE_CONSTANT, ONE, ONE_UA_IN_KILOMETERS, PC2LY, PC2UA, PI, SPEED_OF_LIGHT } from '@/constants'
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
} from '@/types'

/**
 * Transform a distance in parsec into a parallax
 * @param {Parsec} parsec The input distance in parsecs
 * @returns {ArcSecond} The parallax
 */
export function getParallaxFromParsecs (parsec: Parsec | number): ArcSecond {
  return Decimal.atan(ONE.dividedBy(new Decimal(parsec).mul(PC2UA))).mul(3600.0).mul(180.0).dividedBy(PI)
}

/**
 * Transform a parallax into a distance in parsec.
 * @param {ArcSecond} arcseconds The parallax
 * @return {Parsec} The distance in parsec.
 */
export function getParsecsFromParallax (arcseconds: ArcSecond): Parsec {
  return ONE.dividedBy(Decimal.tan(new Decimal(arcseconds).dividedBy(3600.0).mul(PI).dividedBy(180.0))).dividedBy(PC2UA)
}

/**
 * Transform parsecs into Astronomical Units
 * @param {Parsec} pc
 * @return {AstronomicalUnit}
 */
export function getAstronomicalUnitsFromParsecs (pc: Parsec | number): AstronomicalUnit {
  return new Decimal(pc).mul(PC2UA)
}

/**
 * Transform Astronomical Units to parsecs
 * @param {AstronomicalUnit} AU
 * @return {Parsec}
 */
export function getParsecsFromAstronomicalUnits (AU: AstronomicalUnit | number): Parsec {
  return new Decimal(AU).dividedBy(PC2UA)
}

/**
 * Transform parsecs into kilometers
 * @param {Parsec} pc
 * @return {Kilometer}
 */
export function getKilometersFromParsecs (pc: Parsec | number): Kilometer {
  return getAstronomicalUnitsFromParsecs(pc).mul(ONE_UA_IN_KILOMETERS)
}

/**
 * Transform kilometers into parsecs
 * @param {Kilometer} km
 * @return {Parsec}
 */
export function getParsecsFromKilometers (km: Kilometer | number): Parsec {
  return getParsecsFromAstronomicalUnits(new Decimal(km).dividedBy(ONE_UA_IN_KILOMETERS))
}

/**
 * Transform parsecs into light-years
 * @param {Parsec} pc
 * @return {LightYear}
 */
export function getLightYearsFromParsecs (pc: Parsec | number): LightYear {
  return new Decimal(pc).mul(PC2LY)
}

/**
 * Transform light-years into parsecs
 * @param {LightYear} ly
 * @return {Parsec}
 */
export function getParsecsFromLightYears (ly: LightYear | number): Parsec {
  return new Decimal(ly).dividedBy(PC2LY)
}

/**
 * Get the distance modulus from a distance in parsecs.
 * @param {Parsec} pc
 * @param {Magnitude} visualAbsorption The visual absorption (default = 0)
 * @return {Magnitude}
 */
export function getDistanceModulusFromParsecs (pc: Parsec | number, visualAbsorption: Magnitude | number = 0): Magnitude {
  return FIVE.mul(Decimal.log10(pc)).minus(5.0).plus(visualAbsorption)
}

/**
 * Get the distance in parsecs from a distance modulus
 * @param {Magnitude} mM The distance modulus
 * @param {Magnitude} visualAbsorption The visual absorption (default = 0)
 * @returns {Parsec}
 */
export function getParsecsFromDistanceModulus (mM: Magnitude | number, visualAbsorption: Magnitude | number = 0): Parsec {
  return Decimal.pow(10.0, (new Decimal(mM).plus(5).minus(visualAbsorption)).dividedBy(5))
}

/**
 * Transform a distance in Megaparsecs into a redshift
 * @param {MegaParsec} Mpc
 * @param {KilometerPerSecondPerMegaParsec} hubbleConstant The Hubble constant (default = 72)
 * @returns {number}
 */
export function getRedshiftFromMegaparsecs (Mpc: MegaParsec | number, hubbleConstant: KilometerPerSecondPerMegaParsec = HUBBLE_CONSTANT): Decimal {
  return new Decimal(Mpc).mul(hubbleConstant).dividedBy(SPEED_OF_LIGHT)
}

/**
 * Transform a redshift into a distance in Megaparsecs
 * @param z
 * @param {KilometerPerSecondPerMegaParsec} hubbleConstant The Hubble constant (default = 72)
 * @return {MegaParsec}
 */
export function getMegaparsecsFromRedshift (z: Decimal | number, hubbleConstant: KilometerPerSecondPerMegaParsec = HUBBLE_CONSTANT): MegaParsec {
  return new Decimal(z).dividedBy(hubbleConstant).mul(SPEED_OF_LIGHT)
}

export function getLightTimeFromDistance (distance: AstronomicalUnit | number): Day {
  return new Decimal(distance).mul('0.005_775_5183')
}
