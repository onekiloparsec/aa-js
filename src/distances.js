import {
  ONE_PARSEC_IN_UA,
  ONE_PARSEC_IN_LIGHTYEAR,
  ONE_UA_IN_KILOMETERS,
  SPEED_OF_LIGHT
} from './constants'

function getParallaxFromParsec (parsec) {
  return Math.atan(1. / (parsec * ONE_PARSEC_IN_UA)) * 3600.0 * 180.0 / Math.PI
}

function getParsecFromParallax (arcseconds) {
  return 1. / Math.tan(arcseconds / 3600.0 * Math.PI / 180.) / ONE_PARSEC_IN_UA
}

function getAstronomicalUnitsFromParsec (pc) {
  return pc * ONE_PARSEC_IN_UA
}

function getParsecFromAstronomicalUnits (AU) {
  return AU / ONE_PARSEC_IN_UA
}

function getKilometersFromParsec (pc) {
  return getAstronomicalUnitsFromParsec(pc) * ONE_UA_IN_KILOMETERS
}

function getParsecFromKilometers (km) {
  return getParsecFromAstronomicalUnits(km / ONE_UA_IN_KILOMETERS)
}

function getLightYearsFromParsec (pc) {
  return pc * ONE_PARSEC_IN_LIGHTYEAR
}

function getParsecFromLightYears (ly) {
  return ly / ONE_PARSEC_IN_LIGHTYEAR
}

function getDistanceModulusFromParsec (pc, visualAbsorption = 0) {
  return 5.0 * Math.log10(pc) - 5.0 + visualAbsorption
}

function getParsecFromDistanceModulus (mM, visualAbsorption = 0) {
  return Math.pow(10.0, (mM + 5.0 - visualAbsorption) / 5.0)
}

function getMegaParsecValueFromParsec (pc) {
  return pc / 1e6
}

function getRedshiftFromMegaparsec (Mpc, hubbleConstant = 72) {
  return Mpc * hubbleConstant / SPEED_OF_LIGHT
}

function getMegaparsecFromRedshift (z, hubbleConstant = 72) {
  return z / hubbleConstant * SPEED_OF_LIGHT
}

export default {
  getParallaxFromParsec,
  getParsecFromParallax,
  getAstronomicalUnitsFromParsec,
  getParsecFromAstronomicalUnits,
  getKilometersFromParsec,
  getParsecFromKilometers,
  getLightYearsFromParsec,
  getParsecFromLightYears,
  getDistanceModulusFromParsec,
  getParsecFromDistanceModulus,
  getMegaParsecValueFromParsec,
  getRedshiftFromMegaparsec,
  getMegaparsecFromRedshift
}