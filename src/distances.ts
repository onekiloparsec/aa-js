import { ONE_UA_IN_KILOMETERS, PC2LY, PC2UA, SPEED_OF_LIGHT } from './constants'

export function parallaxFromParsec(parsec: number): number {
  return Math.atan(1. / (parsec * PC2UA)) * 3600.0 * 180.0 / Math.PI
}

export function parsecFromParallax(arcseconds: number): number {
  return 1. / Math.tan(arcseconds / 3600.0 * Math.PI / 180.) / PC2UA
}

export function astronomicalUnitsFromParsec(pc: number): number {
  return pc * PC2UA
}

export function parsecFromAstronomicalUnits(AU: number): number {
  return AU / PC2UA
}

export function kilometersFromParsec(pc: number): number {
  return astronomicalUnitsFromParsec(pc) * ONE_UA_IN_KILOMETERS
}

export function parsecFromKilometers(km: number): number {
  return parsecFromAstronomicalUnits(km / ONE_UA_IN_KILOMETERS)
}

export function lightYearsFromParsec(pc: number): number {
  return pc * PC2LY
}

export function parsecFromLightYears(ly: number): number {
  return ly / PC2LY
}

export function distanceModulusFromParsec(pc: number, visualAbsorption: number = 0): number {
  return 5.0 * Math.log10(pc) - 5.0 + visualAbsorption
}

export function parsecFromDistanceModulus(mM: number, visualAbsorption: number = 0): number {
  return Math.pow(10.0, (mM + 5.0 - visualAbsorption) / 5.0)
}

export function megaParsecValueFromParsec(pc: number): number {
  return pc / 1e6
}

export function redshiftFromMegaparsec(Mpc: number, hubbleConstant: number = 72): number {
  return Mpc * hubbleConstant / SPEED_OF_LIGHT
}

export function megaparsecFromRedshift(z: number, hubbleConstant: number = 72): number {
  return z / hubbleConstant * SPEED_OF_LIGHT
}
