import {
  ONE_PARSEC_IN_UA,
  ONE_PARSEC_IN_LIGHTYEAR,
  ONE_UA_IN_KILOMETERS,
  SPEED_OF_LIGHT
} from './constants'

function getParsecFromParallax (arcseconds) {
  return 1. / Math.tan(arcseconds / 3600.0 * Math.PI / 180.) / ONE_PARSEC_IN_UA
}

function getParallaxFromParsec (parsec) {
  return Math.atan(1. / (parsec * ONE_PARSEC_IN_UA)) * 3600.0 * 180.0 / Math.PI
}


function getAstronomicalUnitsFromParsec (pc) {
  return pc * ONE_PARSEC_IN_UA
}

function getKilometersFromParsec (pc) {
  return getAstronomicalUnitsFromParsec(pc) * ONE_UA_IN_KILOMETERS
}

function getLightYearsFromParsec (pc) {
  return pc * ONE_PARSEC_IN_LIGHTYEAR
}

function getDistanceModulusDromParsec (pc, visualAbsorption = 0) {
  return 5.0 * Math.log10(pc) - 5.0 + visualAbsorption
}

function getMegaParsecValueFromParsec (pc) {
  return pc / 1e6
}

function getRedshiftFromMegaparsec (Mpc, hubbleConstant = 72) {
  return Mpc * hubbleConstant / SPEED_OF_LIGHT
}

export default {
  getParsecFromParallax,
  getParallaxFromParsec,
  getAstronomicalUnitsFromParsec,
  getKilometersFromParsec,
  getLightYearsFromParsec,
  getDistanceModulusDromParsec,
  getMegaParsecValueFromParsec,
  getRedshiftFromMegaparsec
}