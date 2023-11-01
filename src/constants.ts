/**
 @module GlobalConstants
 */
import Decimal from '@/decimal'
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

export const ZERO = new Decimal(0)
export const HALF = new Decimal(0.5)
export const ONE = new Decimal(1)
export const TWO = new Decimal(2)
export const THREE = new Decimal(3)
export const FOUR = new Decimal(4)
export const FIVE = new Decimal(5)
export const MINUSONE = new Decimal(-1)

export const J1970: JulianDay = new Decimal(2440588.0)
export const J2000: JulianDay = new Decimal(2451545.0)

export const MJD_START: JulianDay = new Decimal(2400000.5)
export const DAYMS: MiliSecond = new Decimal(1000).mul(3600).mul(24)

export const PI: Radian = Decimal.acos(-1)
export const DEG2RAD: Radian = PI.dividedBy(180)
export const RAD2DEG: Degree = new Decimal(180).dividedBy(PI)
export const RAD2H: Hour = new Decimal(12).dividedBy(PI)
export const H2RAD: Radian = PI.dividedBy(12)
export const H2DEG: Degree = new Decimal(360).dividedBy(24)
export const DEG2H: Hour = new Decimal(24).dividedBy(360)

export const SPEED_OF_LIGHT: KilometerPerSecond = new Decimal(299792.458)
export const SPEED_OF_LIGHT_APPROX = new Decimal(300000.0)

export const CONSTANT_OF_ABERRATION = new Decimal(20.49552) // See AA p.151

export const SIDEREAL_OVER_SOLAR_RATE: Day = new Decimal(1.0027379093)	// Sidereal / solar rate.
export const AVERAGE_JULIAN_YEAR: Day = new Decimal(365.25)		// See Observer's handbook (1999 - RAS of Canada).
export const AVERAGE_GREGORIAN_YEAR: Day = new Decimal(365.2425)		//
export const AVERAGE_SIDEREAL_YEAR: Day = new Decimal(365.256363)	// Fixed star to fixed star.
export const AVERAGE_ANOMALISTIC_YEAR: Day = new Decimal(365.259635)	// Perihelion to perihelion.
export const AVERAGE_TROPICAL_YEAR: Day = new Decimal(365.242190)	// Equinox to equinox.
export const AVERAGE_ECLIPSE_YEAR: Day = new Decimal(346.620075)	// Lunar mode to lunar mode.

export const ONE_DAY_IN_SECONDS: Second = new Decimal(86400.0)
export const ONE_YEAR_IN_SECONDS: Second = AVERAGE_GREGORIAN_YEAR.mul(ONE_DAY_IN_SECONDS)

export const ECLIPTIC_OBLIQUITY_J2000_0: Degree = new Decimal(23.4392911)	// In degrees, see p.92 of AA.
export const ECLIPTIC_OBLIQUITY_B1950_0: Degree = new Decimal(23.4457889)	// In degrees, see p.92 of AA.

export const JULIAN_YEAR: Day = new Decimal(365.25)		// See p.133 of AA.
export const BESSELIAN_YEAR: Day = new Decimal(365.2421988)	// See p.133 of AA.
export const JULIAN_DAY_B1950_0: JulianDay = new Decimal(2433282.4235)	// See p.133 of AA.

export const GALACTIC_NORTH_POLE_ALPHA_B1950_0: Degree = new Decimal(192.25)
export const GALACTIC_NORTH_POLE_DELTA_B1950_0: Degree = new Decimal(27.4)

export const EARTH_EQUATORIAL_RADIUS: Kilometer = new Decimal(6378.14)		// See p82 of AA.
export const EARTH_RADIUS_FLATTENING_FACTOR = new Decimal(1).dividedBy(298.257)	// See p82 of AA.
export const EARTH_MERIDIAN_ECCENTRICITY = EARTH_RADIUS_FLATTENING_FACTOR.mul(2).minus(EARTH_RADIUS_FLATTENING_FACTOR.pow(2)).sqrt()	// 0.08181922145552321, See p82 of AA, sqrt(2f-f^2), where f = flattening factor

export const ONE_UA_IN_KILOMETERS: Kilometer = new Decimal(149597870.691)
/*
 http://neo.jpl.nasa.gov/glossary/au.html
 Definition: An Astronomical Unit is approximately the mean distance between the Earth and the Sun. It is a derived
 constant and used to indicate distances within the solar system. Its formal definition is the radius of an unperturbed
 circular orbit a massless body would revolve about the sun in 2*(pi)/k days (i.e., 365.2568983.... days), where k is
 defined as the Gaussian constant exactly equal to 0.01720209895. Since an AU is based on radius of a circular orbit,
 one AU is actually slightly less than the average distance between the Earth and the Sun (approximately 150 million
 km or 93 million miles).
*/

export const PC2UA = ONE.dividedBy(Decimal.tan(ONE.dividedBy(3600).mul(PI).dividedBy(180))) // = 1.0/tan(1./3600.0*M_PI/180.) = 206264.80624548031
export const PC2LY = new Decimal(3.263797724738089) // = pc*ua/SPEED_OF_LIGHT/(ONE_DAY_INSECONDS*365.0) = 3.263797724738089

//http://physics.nist.gov/cuu/index.html
export const PLANCK_CONSTANT = new Decimal(6.62606957e-34) // Joule * seconds;
export const BOLTZMANN_CONSTANT = new Decimal(1.3806488e-23) // Joule/Kelvin

// http://nssdc.gsfc.nasa.gov/planetary/factsheet/
// http://solarscience.msfc.nasa.gov

export const MSUN: Kilogram = new Decimal(1.98855e30) // kg;
export const MJUP: Kilogram = new Decimal(1.8990e27) // kg;
export const MNEP: Kilogram = new Decimal(1.0243e26) // kg;
export const MEARTH: Kilogram = new Decimal(5.9736e24) // kg;

export const ONE_MASS_OF_JUPITER_IN_NEPTUNE_MASS = new Decimal(18.539490383676657)
export const ONE_MASS_OF_JUPITER_IN_EARTH_MASS = new Decimal(317.8987545198875)

// EQUATORIAL RADII. See http://nssdc.gsfc.nasa.gov/planetary/factsheet/jupiterfact.html
export const ONE_SOLAR_RADIUS_IN_KILOMETERS: Kilometer = new Decimal(695990.0) // km;
export const ONE_JUPITER_RADIUS_IN_KILOMETERS: Kilometer = new Decimal(71492.0)
export const ONE_NEPTUNE_RADIUS_IN_KILOMETERS: Kilometer = new Decimal(24764.0)
export const ONE_EARTH_RADIUS_IN_KILOMETERS: Kilometer = new Decimal(6378.137)

export const HUBBLE_CONSTANT = new Decimal(72.0)
export const ABSOLUTE_ZERO_TEMPERATURE_CELSIUS = new Decimal(-273.15)

// export const SUN_EXTENDED_EVENTS_ALTITUDES = [
//   [-0.833, 'sunrise', 'sunset'],
//   [-0.3, 'sunriseEnd', 'sunsetStart'],
//   [-6, 'dawn', 'dusk'],
//   [-12, 'nauticalDawn', 'nauticalDusk'],
//   [-18, 'nightEnd', 'night'],
//   [6, 'goldenHourEnd', 'goldenHour']
// ]

export const SUN_EVENTS_ALTITUDES: Degree[] = [
  new Decimal(-0.833),
  new Decimal(-6),
  new Decimal(-12),
  new Decimal(-18)
]
export const SUN_EXTENDED_EVENTS_ALTITUDES: Degree[] = [
  new Decimal(6),
  new Decimal(-0.3),
  new Decimal(-0.833),
  new Decimal(-6),
  new Decimal(-12),
  new Decimal(-18)
]

// See AA. p 101 for Rise & Set
export const STANDARD_ALTITUDE_STARS = new Decimal(-0.5667) // works for planets too.
export const STANDARD_ALTITUDE_MOON = new Decimal(+0.125)
export const STANDARD_ALTITUDE_SUN = new Decimal(-0.8333)
