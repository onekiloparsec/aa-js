import {
   PC2UA,
   PC2LY,
  ONE_UA_IN_KILOMETERS,
  SPEED_OF_LIGHT
} from './constants'

function getParallaxFromParsec (parsec) {
  return Math.atan(1. / (parsec *  PC2UA)) * 3600.0 * 180.0 / Math.PI
}

function getParsecFromParallax (arcseconds) {
  return 1. / Math.tan(arcseconds / 3600.0 * Math.PI / 180.) /  PC2UA
}

function getAstronomicalUnitsFromParsec (pc) {
  return pc *  PC2UA
}

function getParsecFromAstronomicalUnits (AU) {
  return AU /  PC2UA
}

function getKilometersFromParsec (pc) {
  return getAstronomicalUnitsFromParsec(pc) * ONE_UA_IN_KILOMETERS
}

function getParsecFromKilometers (km) {
  return getParsecFromAstronomicalUnits(km / ONE_UA_IN_KILOMETERS)
}

function getLightYearsFromParsec (pc) {
  return pc *  PC2LY
}

function getParsecFromLightYears (ly) {
  return ly /  PC2LY
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