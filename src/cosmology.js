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

const defaultValues = {
  const n = 1000	// number of points in integrals
  const nda = 1	// number of digits in angular size distance
  const H0 = 71	// Hubble constant
  const WM = 0.27	// Omega(matter)
  const WV = 0.73	// Omega(vacuum) or lambda
  const WR = 0	// Omega(radiation)
  const WK = 0	// Omega curvaturve = 1-Omega(total)
  const z = 3.0	// redshift of the object
  const h = 0.71	// H0/100
  const c = 299792.458 // velocity of light in km/sec
  const Tyr = 977.8 // coefficent for converting 1/H into Gyr
  const DTT = 0.5	// time from z to now in units of 1/H0
  const DTT_Gyr = 0.0	// value of DTT in Gyr
  const age = 0.5	// age of Universe in units of 1/H0
  const age_Gyr = 0.0	// value of age in Gyr
  const zage = 0.1	// age of Universe at redshift z in units of 1/H0
  const zage_Gyr = 0.0	// value of zage in Gyr
  const DCMR = 0.0	// comoving radial distance in units of c/H0
  const DCMR_Mpc = 0.0
  const DCMR_Gyr = 0.0
  const DA = 0.0	// angular size distance
  const DA_Mpc = 0.0
  const DA_Gyr = 0.0
  const kpc_DA = 0.0
  const DL = 0.0	// luminosity distance
  const DL_Mpc = 0.0
  const DL_Gyr = 0.0	// DL in units of billions of light years
  const V_Gpc = 0.0
  const a = 1.0	// 1/(1+z), the scale factor of the Universe
  const az = 0.5	// 1/(1+z(object));
}

Cosmos.prototype.stround = function (x, m) {
  // rounds to m digits and makes a string
  var tenn = 1
  var i = 0
  for (i = 0; i != m; i++) tenn = tenn * 10

  var y = Math.round(Math.abs(x) * tenn)
  var str = ' ' + y
  while (m > str.length - 2) str = ' 0' + str.substring(1, str.length)
  str = str.substring(0, str.length - m) + '.' +
    str.substring(str.length - m, str.length)
  if (x < 0) str = ' -' + str.substring(1, str.length)
  return str
}

// entry point for the input form to pass values back to this script
Cosmos.prototype.setValues = function (H0, WM, WV, z) {
  const H0 = H0
  const h = const H0 / 100
  const WM = WM
  const WV = WV
  const z = z
  const WR = 4.165E-5 / (const h * const h)	// includes 3 massless neutrino species, T0 = 2.72528
  const WK = 1 - const WM - const WR - const WV

}

export const  getTangentialComovingDistance = function(WK, DCMR) {

  const x = Math.sqrt(Math.abs(WK)) * DCMR
  if (x > 0.1) {
    const ratio = ( WK > 0) ? 0.5 * (Math.exp(x) - Math.exp(-x)) / x : Math.sin(x) / x
    return ratio *  DCMR
  }

  let y = x * x
  // statement below fixed 13-Aug-03 to correct sign error in expansion
  if (WK < 0){ y = -y}
  const ratio = 1 + y / 6 + y * y / 120
  return ratio *  DCMR
}

// comoving volume computation
export const getComovingVolume = function (WK, DCMR) {
  const x = Math.sqrt(Math.abs( WK)) *  DCMR
  if (x > 0.1) {
    const ratio = (WK > 0) ? (0.125 * (Math.exp(2 * x) - Math.exp(-2 * x)) - x / 2) / (x * x * x / 3) :
      (x / 2 - Math.sin(2 * x) / 4) / (x * x * x / 3)
    return ratio *  DCMR * DCMR * DCMR / 3
  }

  let y = x * x
  // statement below fixed 13-Aug-03 to correct sign error in expansion
  if ( WK < 0){ y = -y}
  const ratio = 1 + y / 5 + (2 / 105) * y * y
  return ratio * DCMR *  DCMR *  DCMR / 3
}

export const getAllValues = function (H0, WM, WV, z) {
  const h =  H0 / 100
  const WR = 4.165E-5 / ( h *  h)	// includes 3 massless neutrino species, T0 = 2.72528
  const WK = 1 -  WM -  WR -  WV
  let az = 1.0 / (1 + 1.0 *  z)
  let age = 0
  for (let i = 0; i < n; i++) {
    const a =  az * (i + 0.5) /  n
    const adot = Math.sqrt( WK + ( WM /  a) + ( WR / ( a *  a)) + ( WV *  a *  a))
    const age =  age + 1 /  adot
  }

  const zage =  az *  age /  n

  // correction for annihilations of particles not present now like e+/e-
  // added 13-Aug-03 based on T_vs_t.f
  let lpz = Math.log((1 + 1.0 *   z)) / Math.log(10.0)
  let dzage = 0
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
  const zage =  zage * Math.pow(10.0, dzage)
  const zage_Gyr = ( Tyr /  H0) *  zage
  const DTT = 0.0
  const DCMR = 0.0
  // do integral over a=1/(1+z) from az to 1 in n steps, midpoint rule
  for (let i = 0; i < n; i++) {
    const a =  az + (1 -  az) * (i + 0.5) /  n
    const adot = Math.sqrt( WK + ( WM /  a) + ( WR / ( a *  a)) + ( WV *  a *  a))
    const DTT =  DTT + 1 /  adot
    const DCMR =  DCMR + 1 / ( a *  adot)
  }

  const DTT = (1 -  az) *  DTT /  n
  const DCMR = (1 -  az) *  DCMR /  n
  const age =  DTT +  zage
  const age_Gyr =  age * ( Tyr /  H0)
  const DTT_Gyr = ( Tyr /  H0) *  DTT
  const DCMR_Gyr = ( Tyr /  H0) *  DCMR
  const DCMR_Mpc = ( c /  H0) *  DCMR
  const DA =  az *  DCMT()
  const DA_Mpc = ( c /  H0) *  DA
  const kpc_DA =  DA_Mpc / 206.264806
  const DA_Gyr = ( Tyr /  H0) *  DA
  const DL =  DA / ( az *  az)
  const DL_Mpc = ( c /  H0) *  DL
  const DL_Gyr = ( Tyr /  H0) *  DL
  const V_Gpc = 4 * Math.PI * Math.pow(0.001 *  c /  H0, 3) *  VCM()

}

  // var ch = '\t'
  // var answer = '# '
  // answer += 'H0' + ch
  // answer += 'Omega_M' + ch
  // answer += 'Omega_vac' + ch
  // answer += 'z' + ch
  // answer += 'time_Gyr' + ch
  // answer += 'age_Gyr' + ch
  // answer += 'travel_time_Gyr' + ch
  // answer += 'comoving_radial_distance_Mpc' + ch
  // answer += 'comoving_radial_distance_Gly' + ch
  // answer += 'comoving_volume_within_z_Gpc3' + ch
  // answer += 'angular_size_distance_DA_Mpc' + ch
  // answer += 'angular_size distance DA_Gly' + ch
  // answer += 'scale_kpc_per_arcsec' + ch
  // answer += 'luminosity_distance_D_L_Mpc' + ch
  // answer += 'luminosity_distance_D_L_Gly' + ch

// H0 = parseFloat(H0list.length > i ? H0list[i] : H0list[0])
//       WM = parseFloat(WMlist.length > i ? WMlist[i] : WMlist[0])
//       z = parseFloat(zlist[i])
//
//       if (curvature == 'open') {
//         WV = 0
//       } else if (curvature == 'flat') {
//         WV = 1.0 - WM - 0.4165 / (H0 * H0)
//       } else {
//         WV = parseFloat(WVlist.length > i ? WVlist[i] : WVlist[0])
//       }
//
//       const addCosmos(H0, WM, WV, z)


