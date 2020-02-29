// ************************************************************************************
// Original Copyright Notice
// ************************************************************************************
// by Ned Wright
// 25 Jul 1999
// Copyright Edward L. Wright, all rights reserved.
// define global variables and functions
//
// Adapted/modernized by Stuart Lowe @ dotAstronomy 2012, Heidelberg
// ************************************************************************************
// See also Ned Wright's cosmology tutorial:
// http://www.astro.ucla.edu/~wright/cosmo_01.htm
// ************************************************************************************

const Tyr = 977.8 // coefficent for converting 1/H into Gyr
const INTEGRAL_POINTS_NUMBER = 1000

const defaultValues = {
  n: 1000,	// number of points in integrals
  nda: 1,	// number of digits in angular size distance
  H0: 71,	// Hubble constant
  WM: 0.27,	// Omega(matter)
  WV: 0.73,	// Omega(vacuum) or lambda
  WR: 0,	// Omega(radiation)
  WK: 0,	// Omega curvaturve: 1-Omega(total)
  z: 3.0,	// redshift of the object
  h: 0.71,	// H0/100
  c: 299792.458, // velocity of light in km/sec
  DTT: 0.5,	// time from z to now in units of 1/H0
  DTT_Gyr: 0.0,	// value of DTT in Gyr
  age: 0.5,	// age of Universe in units of 1/H0
  age_Gyr: 0.0,	// value of age in Gyr
  zage: 0.1,	// age of Universe at redshift z in units of 1/H0
  zage_Gyr: 0.0,	// value of zage in Gyr
  DCMR: 0.0,	// comoving radial distance in units of c/H0
  DCMR_Mpc: 0.0,
  DCMR_Gyr: 0.0,
  DA: 0.0,	// angular size distance
  DA_Mpc: 0.0,
  DA_Gyr: 0.0,
  kpc_DA: 0.0,
  DL: 0.0,	// luminosity distance
  DL_Mpc: 0.0,
  DL_Gyr: 0.0,	// DL in units of billions of light years
  V_Gpc: 0.0,
  a: 1.0,	// 1/(1+z), the scale factor of the Universe
  az: 0.5	// 1/(1+z(object));
}

const stround = function (x, m) {
  // rounds to m digits and makes a string
  var tenn = 1
  var i = 0
  for (i = 0; i !== m; i++) tenn = tenn * 10

  var y = Math.round(Math.abs(x) * tenn)
  var str = ' ' + y
  while (m > str.length - 2) str = ' 0' + str.substring(1, str.length)
  str = str.substring(0, str.length - m) + '.' +
    str.substring(str.length - m, str.length)
  if (x < 0) str = ' -' + str.substring(1, str.length)
  return str
}

// entry point for the input form to pass values back to this script
// Cosmos.prototype.setValues = function (H0, WM, WV, z) {
//   const H0 = H0
//   const h = H0 / 100
//   const WM = WM
//   const WV = WV
//   const z = z
//   const WR = 4.165E-5 / (h * h)	// includes 3 massless neutrino species, T0 = 2.72528
//   const WK = 1 - WM - WR - WV
// }

function getOmegaR (H0) {
  const h = H0 / 100
  return 4.165E-5 / (h * h)	// includes 3 massless neutrino species, T0 = 2.72528
}

function getOmegaK (H0, WM, WV) {
  const WR = getOmegaR(H0)
  return 1 - WM - WR - WV
}

function getTangentialComovingDistance (WK, DCMR) {
  const x = Math.sqrt(Math.abs(WK)) * DCMR
  if (x > 0.1) {
    const ratio = (WK > 0) ? 0.5 * (Math.exp(x) - Math.exp(-x)) / x : Math.sin(x) / x
    return ratio * DCMR
  }

  let y = x * x
  // statement below fixed 13-Aug-03 to correct sign error in expansion
  if (WK < 0) {
    y = -y
  }
  const ratio = 1 + y / 6 + y * y / 120
  return ratio * DCMR
}

function getComovingVolume (WK, DCMR) {
  const x = Math.sqrt(Math.abs(WK)) * DCMR
  if (x > 0.1) {
    const ratio = (WK > 0) ? (0.125 * (Math.exp(2 * x) - Math.exp(-2 * x)) - x / 2) / (x * x * x / 3) :
      (x / 2 - Math.sin(2 * x) / 4) / (x * x * x / 3)
    return ratio * DCMR * DCMR * DCMR / 3
  }

  let y = x * x
  // statement below fixed 13-Aug-03 to correct sign error in expansion
  if (WK < 0) {
    y = -y
  }
  const ratio = 1 + y / 5 + (2 / 105) * y * y
  return ratio * DCMR * DCMR * DCMR / 3
}

function getUniverseAge (H0, WM, WV, z = 0) {
  let az = 1.0 / (1 + z)
  let WR = getOmegaR(H0)
  let WK = getOmegaK(H0, WM, WV)

  let age = 0
  for (let i = 0; i < INTEGRAL_POINTS_NUMBER; i++) {
    const a = az * (i + 0.5) / INTEGRAL_POINTS_NUMBER
    const adot = Math.sqrt(WK + (WM / a) + (WR / (a * a)) + (WV * a * a))
    age = age + 1 / adot
  }

  return age * (Tyr / H0) / 1000
}

export default {
  getOmegaR,
  getOmegaK,
  getTangentialComovingDistance,
  getComovingVolume,
  getUniverseAge
}

// function getUniverseAge
//   let zage = az * age / n
//
//   // correction for annihilations of particles not present now like e+/e-
//   // added 13-Aug-03 based on T_vs_t.f
//   let lpz = Math.log((1 + 1.0 * z)) / Math.log(10.0)
//   let dzage = 0
//   if (lpz > 7.500) dzage = 0.002 * (lpz - 7.500)
//   if (lpz > 8.000) dzage = 0.014 * (lpz - 8.000) + 0.001
//   if (lpz > 8.500) dzage = 0.040 * (lpz - 8.500) + 0.008
//   if (lpz > 9.000) dzage = 0.020 * (lpz - 9.000) + 0.028
//   if (lpz > 9.500) dzage = 0.019 * (lpz - 9.500) + 0.039
//   if (lpz > 10.000) dzage = 0.048
//   if (lpz > 10.775) dzage = 0.035 * (lpz - 10.775) + 0.048
//   if (lpz > 11.851) dzage = 0.069 * (lpz - 11.851) + 0.086
//   if (lpz > 12.258) dzage = 0.461 * (lpz - 12.258) + 0.114
//   if (lpz > 12.382) dzage = 0.024 * (lpz - 12.382) + 0.171
//   if (lpz > 13.055) dzage = 0.013 * (lpz - 13.055) + 0.188
//   if (lpz > 14.081) dzage = 0.013 * (lpz - 14.081) + 0.201
//   if (lpz > 15.107) dzage = 0.214
//
//   return (Tyr / H0) * zage * Math.pow(10.0, dzage)
// }
//
// export const getAllValues = function (H0, WM, WV, z) {
//   const h = H0 / 100
//   const WR = 4.165E-5 / (h * h)	// includes 3 massless neutrino species, T0 = 2.72528
//   const WK = 1 - WM - WR - WV
//   let az = 1.0 / (1 + 1.0 * z)
//   let age = 0
//   for (let i = 0; i < n; i++) {
//     const a = az * (i + 0.5) / n
//     const adot = Math.sqrt(WK + (WM / a) + (WR / (a * a)) + (WV * a * a))
//     const age = age + 1 / adot
//   }
//
//   const DTT = 0.0
//   const DCMR = 0.0
//   // do integral over a=1/(1+z) from az to 1 in n steps, midpoint rule
//   for (let i = 0; i < n; i++) {
//     const a = az + (1 - az) * (i + 0.5) / n
//     const adot = Math.sqrt(WK + (WM / a) + (WR / (a * a)) + (WV * a * a))
//     const DTT = DTT + 1 / adot
//     const DCMR = DCMR + 1 / (a * adot)
//   }
//
//   const DTT = (1 - az) * DTT / n
//   const DCMR = (1 - az) * DCMR / n
//   // const age = DTT + zage
//   // const age_Gyr = age * (Tyr / H0)
//   const DTT_Gyr = (Tyr / H0) * DTT
//   const DCMR_Gyr = (Tyr / H0) * DCMR
//   const DCMR_Mpc = (c / H0) * DCMR
//   const DA = az * DCMT()
//   const DA_Mpc = (c / H0) * DA
//   const kpc_DA = DA_Mpc / 206.264806
//   const DA_Gyr = (Tyr / H0) * DA
//   const DL = DA / (az * az)
//   const DL_Mpc = (c / H0) * DL
//   const DL_Gyr = (Tyr / H0) * DL
//   const V_Gpc = 4 * Math.PI * Math.pow(0.001 * c / H0, 3) * VCM()
//
// }
