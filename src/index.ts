/**
 * AA
 * @namespace
 */
import Decimal from '@/decimal'
import { AllPlanetName, EarthPlanet, MinorPlanet, NaturalSun, Planet, PlanetName, SolarSystemName } from '@/types'

import { Earth } from './earth'
import { Sun } from './sun'

import { Jupiter, Mars, Mercury, Neptune, Pluto, Saturn, Uranus, Venus } from './planets'

import * as coordinates from './coordinates'
import * as cosmology from './cosmology'
import * as distances from './distances'
import * as exoplanets from './exoplanets'
import * as juliandays from './juliandays'
import * as sexagesimal from './sexagesimal'
import * as risetransitset from './risetransitset'
import * as times from './times'

const Planets: { [key in PlanetName]: Planet } = {
  Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune
}

const AllPlanets: { [key in AllPlanetName]: Planet | MinorPlanet } = {
  Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto
}

const SolarSystem: { [key in SolarSystemName]: NaturalSun | Planet | EarthPlanet | MinorPlanet } = {
  Sun, Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto
}

export {
  Decimal,
  Sun,
  Mercury,
  Venus,
  Earth,
  Mars,
  Jupiter,
  Saturn,
  Uranus,
  Neptune,
  Pluto,
  Planets,
  AllPlanets,
  SolarSystem,
  coordinates,
  cosmology,
  distances,
  exoplanets,
  juliandays,
  sexagesimal,
  risetransitset,
  times
}

export * from './constants'
export * from './utils'
export * from './types'
