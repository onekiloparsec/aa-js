/**
 @module PhysicalConstants
 */
import {
  Day,
  Degree,
  Hour,
  JulianDay,
  Kilogram,
  Kilometer,
  KilometerPerSecond,
  MiliSecond,
  Radian,
  Second
} from './types'

/** @constant {JulianDay} */
export const J1970: JulianDay = 2440588.0
/** @constant {JulianDay} */
export const J2000: JulianDay = 2451545.0

/** @constant {JulianDay} */
export const MJD_START: JulianDay = 2400000.5
/** @constant {MiliSecond} */
export const DAYMS: MiliSecond = 1000 * 3600 * 24

/** @constant {Radian} */
export const PI: Radian = Math.PI
/** @constant {Radian} */
export const PITWO: Radian = PI * 2
/** @constant {Radian} */
export const PIHALF: Radian = PI / 2

/** @private */
export const DEG2RAD: Radian = PI / 180
/** @private */
export const RAD2DEG: Degree = 180 / PI
/** @private */
export const RAD2H: Hour = 12 / PI
/** @private */
export const H2RAD: Radian = PI / 12
/** @private */
export const H2DEG: Degree = 360 / 24
/** @private */
export const DEG2H: Hour = 24 / 360

/** @constant {KilometerPerSecond} */
export const SPEED_OF_LIGHT: KilometerPerSecond = 299792.458
/** @constant {KilometerPerSecond} */
export const SPEED_OF_LIGHT_APPROX = 300000.0

/** @constant {number} */
export const CONSTANT_OF_ABERRATION = 20.49552 // See AA p.151

/** @constant {Day} */
export const SIDEREAL_OVER_SOLAR_RATE: Day = 1.0027379093	// Sidereal / solar rate.
/** @constant {Day} */
export const AVERAGE_JULIAN_YEAR: Day = 365.25		// See Observer's handbook (1999 - RAS of Canada).
/** @constant {Day} */
export const AVERAGE_GREGORIAN_YEAR: Day = 365.2425		//
/** @constant {Day} */
export const AVERAGE_SIDEREAL_YEAR: Day = 365.256363	// Fixed star to fixed star.
/** @constant {Day} */
export const AVERAGE_ANOMALISTIC_YEAR: Day = 365.259635	// Perihelion to perihelion.
/** @constant {Day} */
export const AVERAGE_TROPICAL_YEAR: Day = 365.242190	// Equinox to equinox.
/** @constant {Day} */
export const AVERAGE_ECLIPSE_YEAR: Day = 346.620075	// Lunar mode to lunar mode.

/** @constant {Second} */
export const ONE_DAY_IN_SECONDS: Second = 86400.0
/** @constant {Second} */
export const ONE_YEAR_IN_SECONDS: Second = AVERAGE_GREGORIAN_YEAR * ONE_DAY_IN_SECONDS

/** @constant {Degree} */
export const ECLIPTIC_OBLIQUITY_J2000_0: Degree = 23.4392911	// In degrees, see p.92 of AA.
/** @constant {Degree} */
export const ECLIPTIC_OBLIQUITY_B1950_0: Degree = 23.4457889	// In degrees, see p.92 of AA.

/** @constant {Day} */
export const JULIAN_YEAR: Day = 365.25		// See p.133 of AA.
/** @constant {Day} */
export const BESSELIAN_YEAR: Day = 365.2421988	// See p.133 of AA.
/** @constant {JulianDay} */
export const JULIAN_DAY_B1950_0: JulianDay = 2433282.4235	// See p.133 of AA.

/** @constant {Degree} */
export const GALACTIC_NORTH_POLE_ALPHA_B1950_0: Degree = 192.25
/** @constant {Degree} */
export const GALACTIC_NORTH_POLE_DELTA_B1950_0: Degree = 27.4

/** @constant {Kilometer} */
export const EARTH_EQUATORIAL_RADIUS: Kilometer = 6378.14		// See p82 of AA.
/** @constant {number} */
export const EARTH_RADIUS_FLATTENING_FACTOR = 1 / 298.257	// See p82 of AA.
/** @constant {number} */
export const EARTH_MERIDIAN_ECCENTRICITY = Math.sqrt(EARTH_RADIUS_FLATTENING_FACTOR * 2 - Math.pow(EARTH_RADIUS_FLATTENING_FACTOR, 2))	// 0.08181922145552321, See p82 of AA, sqrt(2f-f^2), where f = flattening factor

/** @constant {Kilometer} */
export const ONE_UA_IN_KILOMETERS: Kilometer = 149597870.691
/*
 http://neo.jpl.nasa.gov/glossary/au.html
 Definition: An Astronomical Unit is approximately the mean distance between the Earth and the Sun. It is a derived
 constant and used to indicate distances within the solar system. Its formal definition is the radius of an unperturbed
 circular orbit a massless body would revolve about the sun in 2*(pi)/k days (i.e., 365.2568983.... days), where k is
 defined as the Gaussian constant exactly equal to 0.01720209895. Since an AU is based on radius of a circular orbit,
 one AU is actually slightly less than the average distance between the Earth and the Sun (approximately 150 million
 km or 93 million miles).
*/

/** @private */
export const PC2UA = 1.0 / Math.tan(1. / 3600.0 * Math.PI / 180.) // = 1.0/tan(1./3600.0*M_PI/180.) = 206264.80624548031
/** @private */
export const PC2LY = 3.263797724738089 // = pc*ua/SPEED_OF_LIGHT/(ONE_DAY_INSECONDS*365.0) = 3.263797724738089

//http://physics.nist.gov/cuu/index.html
/** @private */
export const PLANCK_CONSTANT = 6.62606957e-34 // Joule * seconds;
/** @private */
export const BOLTZMANN_CONSTANT = 1.3806488e-23 // Joule/Kelvin

// http://nssdc.gsfc.nasa.gov/planetary/factsheet/
// http://solarscience.msfc.nasa.gov

/** @constant {Kilogram} */
export const MSUN: Kilogram = 1.98855e30 // kg;
/** @constant {Kilogram} */
export const MJUP: Kilogram = 1.8990e27 // kg;
/** @constant {Kilogram} */
export const MNEP: Kilogram = 1.0243e26 // kg;
/** @constant {Kilogram} */
export const MEARTH: Kilogram = 5.9736e24 // kg;

/** @private */
export const ONE_MASS_OF_JUPITER_IN_NEPTUNE_MASS = 18.539490383676657
/** @private */
export const ONE_MASS_OF_JUPITER_IN_EARTH_MASS = 317.8987545198875

/** @constant {KilometerPerSecondPerMegaParsec} */
export const HUBBLE_CONSTANT = 72.0
/** @constant {Celsius} */
export const ABSOLUTE_ZERO_TEMPERATURE_CELSIUS = -273.15

// export const SUN_EXTENDED_EVENTS_ALTITUDES = [
//   [-0.833, 'sunrise', 'sunset'],
//   [-0.3, 'sunriseEnd', 'sunsetStart'],
//   [-6, 'dawn', 'dusk'],
//   [-12, 'nauticalDawn', 'nauticalDusk'],
//   [-18, 'nightEnd', 'night'],
//   [6, 'goldenHourEnd', 'goldenHour']
// ]

/** @private */
export const SUN_EVENTS_ALTITUDES: Degree[] = [
  -0.833,
  -6,
  -12,
  -18
]
/** @private */
export const SUN_EXTENDED_EVENTS_ALTITUDES: Degree[] = [
  6,
  -0.3,
  -0.833,
  -6,
  -12,
  -18
]

// See AA. p 101 for Rise & Set
/** @constant {Degree} */
export const STANDARD_ALTITUDE_STARS: Degree = -0.5667 // works for planets too.
/** @constant {Degree} */
export const STANDARD_ALTITUDE_MOON: Degree = 0.125
/** @constant {Degree} */
export const STANDARD_ALTITUDE_SUN: Degree = -0.8333

// Wikipedia
/** @constant {Day} */
export const MOON_SYNODIC_PERIOD: Day = 29.530_587_705_76

/** @constant {string} */
export enum MoonPhaseQuarter {
  New,
  FirstQuarter,
  Full,
  LastQuarter
}

/** @constant {string} */
export enum MoonPhase {
  New,
  WaxingCrescent,
  FirstQuarter,
  WaxingGibbous,
  Full,
  WaningGibbous,
  LastQuarter,
  WaningCrescent
}

/** @private */
export const MOON_PHASE_UPPER_LIMITS = {
  [MoonPhase.New]: 0.033863193308711,
  [MoonPhase.WaxingCrescent]: 0.216136806691289,
  [MoonPhase.FirstQuarter]: 0.283863193308711,
  [MoonPhase.WaxingGibbous]: 0.466136806691289,
  [MoonPhase.Full]: 0.533863193308711,
  [MoonPhase.WaningGibbous]: 0.716136806691289,
  [MoonPhase.LastQuarter]: 0.783863193308711,
  [MoonPhase.WaningCrescent]: 0.966136806691289
}
