/**
 * AA
 * @namespace
 */
import { Earth } from './earth'
import { Sun } from './sun'

import { Jupiter, Mars, Mercury, Neptune, Pluto, Saturn, Uranus, Venus } from './planets'

export * as constants from './constants'

export * as coordinates from './coordinates'
export * as cosmology from './cosmology'
export * as dates from './dates'
export * as distances from './distances'
export * as exoplanets from './exoplanets'
export * as juliandays from './juliandays'
export * as precession from './precession'
export * as sexagesimal from './sexagesimal'
export * as times from './times'

export { Sun, Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto }

export const Planets = {
  Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto
}

export const SolarSystem = {
  Sun, Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto
}
