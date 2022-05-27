// ************************************************************************************
// Original Copyright Notice
// ************************************************************************************
// by Ned Wright
// 25 Jul 1999
// Copyright Edward L. Wright, all rights reserved.
//
// Adapted/modernized by Stuart Lowe @ dotAstronomy 2012, Heidelberg
//
// Corrected and covered with unit tests by Cédric Foellmi @onekiloparsec
// (https://github.com/onekiloparsec) February 2020
//
// ************************************************************************************
// See also Ned Wright's cosmology tutorial:
// http://www.astro.ucla.edu/~wright/cosmo_01.htm
// ************************************************************************************

import { SPEED_OF_LIGHT } from './constants'
import { GigaParsec3, GYr, KilometerPerSecondPerMegaParsec, MegaParsec } from 'aa.js'

const Tyr = 977.8 // coefficient for converting 1/H into Gyr
const INTEGRAL_POINTS_NUMBER = 2000

/**
 * Omega R (radiation), the ratio of the density of the Universe to the critical density.
 * @param {KilometerPerSecondPerMegaParsec} H0 The Hubble constant
 * @returns {number}
 */
export function getOmegaR (H0: KilometerPerSecondPerMegaParsec): number {
  const h = H0 / 100
  return 4.165E-5 / (h * h)	// includes 3 massless neutrino species, T0 = 2.72528
}

/**
 * Omega K (curvature) = 1-Omega(total)
 * @param {KilometerPerSecondPerMegaParsec} H0 The Hubble constant
 * @param {number} omegaMat Omega M (matter)
 * @param {number} omegaVac Omega Vac (vacuum)
 * @returns {number}
 */
export function getOmegaK (H0: KilometerPerSecondPerMegaParsec, omegaMat: number, omegaVac: number): number {
  const omegaR = getOmegaR(H0)
  return 1 - omegaMat - omegaR - omegaVac
}

/**
 * The age of the universe
 * @param {KilometerPerSecondPerMegaParsec} H0 The Hubble constant
 * @param {number} omegaMat
 * @param {number} omegaVac
 * @returns {GYr}
 */
export function getUniverseAge (H0: KilometerPerSecondPerMegaParsec, omegaMat: number, omegaVac: number): GYr {
  let az = 1.0
  let omegaR = getOmegaR(H0)
  let omegaK = getOmegaK(H0, omegaMat, omegaVac)

  let age = 0
  for (let i = 0; i < INTEGRAL_POINTS_NUMBER; i++) {
    const a = az * (i + 0.5) / INTEGRAL_POINTS_NUMBER
    const adot = Math.sqrt(omegaK + (omegaMat / a) + (omegaR / (a * a)) + (omegaVac * a * a))
    age = age + 1 / adot
  }
  age = age / INTEGRAL_POINTS_NUMBER

  return age * (Tyr / H0)
}

/**
 * The age of the universe at a given redshift
 * @param {KilometerPerSecondPerMegaParsec} H0 The Hubble constant
 * @param {number} omegaMat Omega Matter
 * @param {number} omegaVac Omega Vacuum
 * @param {number} z The redshift
 * @returns {GYr}
 */
export function getUniverseAgeAtRedshift (H0: KilometerPerSecondPerMegaParsec, omegaMat: number, omegaVac: number, z: number): GYr {
  let az = 1.0 / (1 + z)
  let WR = getOmegaR(H0)
  let WK = getOmegaK(H0, omegaMat, omegaVac)

  let age = 0
  for (let i = 0; i < INTEGRAL_POINTS_NUMBER; i++) {
    const a = az * (i + 0.5) / INTEGRAL_POINTS_NUMBER
    const adot = Math.sqrt(WK + (omegaMat / a) + (WR / (a * a)) + (omegaVac * a * a))
    age = age + 1 / adot
  }

  let zage = az * age / INTEGRAL_POINTS_NUMBER

  // correction for annihilations of particles not present now like e+/e-
  // added 13-Aug-03 based on T_vs_t.f
  var lpz = Math.log((1 + z)) / Math.log(10.0)
  var dzage = 0
  if (lpz > 7.500) dzage = 0.002 * (lpz - 7.500)
  if (lpz > 8.000) dzage = 0.014 * (lpz - 8.000) + 0.001
  if (lpz > 8.500) dzage = 0.040 * (lpz - 8.500) + 0.008
  if (lpz > 9.000) dzage = 0.020 * (lpz - 9.000) + 0.028
  if (lpz > 9.500) dzage = 0.019 * (lpz - 9.500) + 0.039
  if (lpz > 10.000) dzage = 0.048
  if (lpz > 10.775) dzage = 0.035 * (lpz - 10.775) + 0.048
  if (lpz > 11.851) dzage = 0.069 * (lpz - 11.851) + 0.086
  if (lpz > 12.258) dzage = 0.461 * (lpz - 12.258) + 0.114
  if (lpz > 12.382) dzage = 0.024 * (lpz - 12.382) + 0.171
  if (lpz > 13.055) dzage = 0.013 * (lpz - 13.055) + 0.188
  if (lpz > 14.081) dzage = 0.013 * (lpz - 14.081) + 0.201
  if (lpz > 15.107) dzage = 0.214

  // Gyr
  return (Tyr / H0) * zage * Math.pow(10.0, dzage)
}

/**
 * The light travel time
 * @param {KilometerPerSecondPerMegaParsec} H0 The Hubble constant
 * @param {number} omegaMat Omega Matter
 * @param {number} omegaVac Omega Vacuum
 * @param {number} z The redshift
 * @returns {GYr}
 */
export function getLightTravelTime (H0: KilometerPerSecondPerMegaParsec, omegaMat: number, omegaVac: number, z: number): GYr {
  let DTT = 0.0
  let az = 1.0 / (1 + z)
  let omegaR = getOmegaR(H0)
  let omegaK = getOmegaK(H0, omegaMat, omegaVac)

// do integral over a=1/(1+z) from az to 1 in n steps, midpoint rule
  for (let i = 0; i < INTEGRAL_POINTS_NUMBER; i++) {
    let a = az + (1 - az) * (i + 0.5) / INTEGRAL_POINTS_NUMBER
    let adot = Math.sqrt(omegaK + (omegaMat / a) + (omegaR / (a * a)) + (omegaVac * a * a))
    DTT = DTT + 1 / adot
  }

  DTT = (1 - az) * DTT / INTEGRAL_POINTS_NUMBER

  // Gyr
  return (Tyr / H0) * DTT
}

/**
 * Comoving radial distance
 * @param {KilometerPerSecondPerMegaParsec} H0 The Hubble constant
 * @param {number} omegaMat Omega Matter
 * @param {number} omegaVac Omega Vacuum
 * @param {number} z The redshift
 * @returns {MegaParsec}
 */
export function getComovingRadialDistance (H0: KilometerPerSecondPerMegaParsec, omegaMat: number, omegaVac: number, z: number): MegaParsec {
  let DCMR = 0.0
  let az = 1.0 / (1 + z)
  let WR = getOmegaR(H0)
  let WK = getOmegaK(H0, omegaMat, omegaVac)

// do integral over a=1/(1+z) from az to 1 in n steps, midpoint rule
  for (let i = 0; i < INTEGRAL_POINTS_NUMBER; i++) {
    let a = az + (1 - az) * (i + 0.5) / INTEGRAL_POINTS_NUMBER
    let adot = Math.sqrt(WK + (omegaMat / a) + (WR / (a * a)) + (omegaVac * a * a))
    DCMR = DCMR + 1 / (a * adot)
  }

  DCMR = (1 - az) * DCMR / INTEGRAL_POINTS_NUMBER

  // Mpc
  return (SPEED_OF_LIGHT / H0) * DCMR
}

/**
 * Comoving volume
 * @param {number} omegaK Omega Curvature (= 1 - Omega Total)
 * @param {number} DCMR
 * @returns {GigaParsec3}
 */
export function getComovingVolume (omegaK: number, DCMR: number): GigaParsec3 {
  const x = Math.sqrt(Math.abs(omegaK)) * DCMR
  if (x > 0.1) {
    const ratio = (omegaK > 0) ? (0.125 * (Math.exp(2 * x) - Math.exp(-2 * x)) - x / 2) / (x * x * x / 3) :
      (x / 2 - Math.sin(2 * x) / 4) / (x * x * x / 3)
    return ratio * DCMR * DCMR * DCMR / 3
  }

  let y = x * x
  // statement below fixed 13-Aug-03 to correct sign error in expansion
  if (omegaK < 0) {
    y = -y
  }
  const ratio = 1 + y / 5 + (2 / 105) * y * y
  return ratio * DCMR * DCMR * DCMR / 3
}

/**
 *
 * @param {KilometerPerSecondPerMegaParsec} H0 The Hubble constant
 * @param {number} omegaMat Omega Matter
 * @param {number} omegaVac Omega Vacuum
 * @param {number} z The redshift
 * @returns {GigaParsec3}
 */
export function getComovingVolumeWithinRedshift (H0: KilometerPerSecondPerMegaParsec, omegaMat: number, omegaVac: number, z: number): GigaParsec3 {
  let az = 1.0 / (1 + z)
  let WR = getOmegaR(H0)
  let WK = getOmegaK(H0, omegaMat, omegaVac)
  let DCMR = 0.0
// do integral over a=1/(1+z) from az to 1 in n steps, midpoint rule
  for (let i = 0; i < INTEGRAL_POINTS_NUMBER; i++) {
    let a = az + (1 - az) * (i + 0.5) / INTEGRAL_POINTS_NUMBER
    let adot = Math.sqrt(WK + (omegaMat / a) + (WR / (a * a)) + (omegaVac * a * a))
    DCMR = DCMR + 1 / (a * adot)
  }
  DCMR = (1 - az) * DCMR / INTEGRAL_POINTS_NUMBER
  let VCM = getComovingVolume(WK, DCMR)

  // Gpc^3
  return 4 * Math.PI * Math.pow(0.001 * SPEED_OF_LIGHT / H0, 3) * VCM
}

/**
 * Tangential comoving distance
 * @param {KilometerPerSecondPerMegaParsec} H0 The Hubble constant
 * @param {number} omegaMat Omega Matter
 * @param {number} omegaVac Omega Vacuum
 * @param {number} z The redshift
 * @returns {number}
 */
export function getTangentialComovingDistance (H0: KilometerPerSecondPerMegaParsec, omegaMat: number, omegaVac: number, z: number): number {
  let az = 1.0 / (1 + z)
  let WR = getOmegaR(H0)
  let WK = getOmegaK(H0, omegaMat, omegaVac)

  let DCMR = 0.0
// do integral over a=1/(1+z) from az to 1 in n steps, midpoint rule
  for (let i = 0; i < INTEGRAL_POINTS_NUMBER; i++) {
    let a = az + (1 - az) * (i + 0.5) / INTEGRAL_POINTS_NUMBER
    let adot = Math.sqrt(WK + (omegaMat / a) + (WR / (a * a)) + (omegaVac * a * a))
    DCMR = DCMR + 1 / (a * adot)
  }
  DCMR = (1 - az) * DCMR / INTEGRAL_POINTS_NUMBER

  let ratio = 1.00
  let x = Math.sqrt(Math.abs(WK)) * DCMR
  if (x > 0.1) {
    ratio = (WK > 0) ? 0.5 * (Math.exp(x) - Math.exp(-x)) / x : Math.sin(x) / x
    return ratio * DCMR
  }

  let y = x * x
// statement below fixed 13-Aug-03 to correct sign error in expansion
  if (WK < 0) y = -y
  ratio = 1 + y / 6 + y * y / 120
  return ratio * DCMR
}

/**
 * Angular size distance
 * @param {KilometerPerSecondPerMegaParsec} H0 The Hubble constant
 * @param {number} omegaMat Omega Matter
 * @param {number} omegaVac Omega Vacuum
 * @param {number} z The redshift
 * @returns {MegaParsec}
 */
export function getAngularSizeDistance (H0: KilometerPerSecondPerMegaParsec, omegaMat: number, omegaVac: number, z: number): MegaParsec {
  let az = 1.0 / (1 + z)
  let DA = az * getTangentialComovingDistance(H0, omegaMat, omegaVac, z)
  // Mpc
  return (SPEED_OF_LIGHT / H0) * DA
}

/**
 * Angular size scale
 * @param {KilometerPerSecondPerMegaParsec} H0 The Hubble constant
 * @param {number} omegaMat Omega Matter
 * @param {number} omegaVac Omega Vacuum
 * @param {number} z The redshift
 * @returns {number} Megaparsec / arcsecond
 */
export function getAngularSizeScale (H0: KilometerPerSecondPerMegaParsec, omegaMat: number, omegaVac: number, z: number): number {
  let DA = getAngularSizeDistance(H0, omegaMat, omegaVac, z)
  let DA_Mpc = (SPEED_OF_LIGHT / H0) * DA
  return DA_Mpc / 206.264806
}

/**
 * Luminosity distance
 * @param {KilometerPerSecondPerMegaParsec} H0 The Hubble constant
 * @param {number} omegaMat Omega Matter
 * @param {number} omegaVac Omega Vacuum
 * @param {number} z The redshift
 * @returns {MegaParsec}
 */
export function getLuminosityDistance (H0: KilometerPerSecondPerMegaParsec, omegaMat: number, omegaVac: number, z: number): MegaParsec {
  let az = 1.0 / (1 + z)
  let DA = getAngularSizeDistance(H0, omegaMat, omegaVac, z)
  return DA / (az * az)
}
