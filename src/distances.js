import {
   PC2UA,
   PC2LY,
  ONE_UA_IN_KILOMETERS,
  SPEED_OF_LIGHT
} from './constants'

function parallaxFromParsec (parsec) {
  return Math.atan(1. / (parsec *  PC2UA)) * 3600.0 * 180.0 / Math.PI
}

function parsecFromParallax (arcseconds) {
  return 1. / Math.tan(arcseconds / 3600.0 * Math.PI / 180.) /  PC2UA
}

function astronomicalUnitsFromParsec (pc) {
  return pc *  PC2UA
}

function parsecFromAstronomicalUnits (AU) {
  return AU /  PC2UA
}

function kilometersFromParsec (pc) {
  return astronomicalUnitsFromParsec(pc) * ONE_UA_IN_KILOMETERS
}

function parsecFromKilometers (km) {
  return parsecFromAstronomicalUnits(km / ONE_UA_IN_KILOMETERS)
}

function lightYearsFromParsec (pc) {
  return pc *  PC2LY
}

function parsecFromLightYears (ly) {
  return ly /  PC2LY
}

function distanceModulusFromParsec (pc, visualAbsorption = 0) {
  return 5.0 * Math.log10(pc) - 5.0 + visualAbsorption
}

function parsecFromDistanceModulus (mM, visualAbsorption = 0) {
  return Math.pow(10.0, (mM + 5.0 - visualAbsorption) / 5.0)
}

function megaParsecValueFromParsec (pc) {
  return pc / 1e6
}

function redshiftFromMegaparsec (Mpc, hubbleConstant = 72) {
  return Mpc * hubbleConstant / SPEED_OF_LIGHT
}

function megaparsecFromRedshift (z, hubbleConstant = 72) {
  return z / hubbleConstant * SPEED_OF_LIGHT
}

export default {
  parallaxFromParsec,
  parsecFromParallax,
  astronomicalUnitsFromParsec,
  parsecFromAstronomicalUnits,
  kilometersFromParsec,
  parsecFromKilometers,
  lightYearsFromParsec,
  parsecFromLightYears,
  distanceModulusFromParsec,
  parsecFromDistanceModulus,
  megaParsecValueFromParsec,
  redshiftFromMegaparsec,
  megaparsecFromRedshift
}