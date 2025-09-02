/**
 * Function to computes various cosmological quantities.
 * Deeply inspired by Edward L. Wright's CosmoCalc, but improved with types & tests.
 *
 * @module Cosmology
 */
// ************************************************************************************
// Original Copyright Notice
// ************************************************************************************
// by Ned Wright
// 25 Jul 1999
// Copyright Edward L. Wright, all rights reserved.
// https://www.astro.ucla.edu/~wright/CosmoCalc.html
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
import { getLightTravelTime, getUniverseAge, getUniverseAgeAtRedshift } from './ages'
import {
  getAngularSizeDistance,
  getAngularSizeScale,
  getComovingRadialDistance,
  getLuminosityDistance,
  getTangentialComovingDistance
} from './distances'
import { getOmegaK, getOmegaR } from './omegas'
import { getComovingVolume, getComovingVolumeWithinRedshift } from './volumes'

export {
  getUniverseAge,
  getUniverseAgeAtRedshift,
  getLightTravelTime,
  getAngularSizeDistance,
  getAngularSizeScale,
  getLuminosityDistance,
  getComovingRadialDistance,
  getTangentialComovingDistance,
  getOmegaR,
  getOmegaK,
  getComovingVolume,
  getComovingVolumeWithinRedshift
}
