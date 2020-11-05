export const J1970 = 2440588.0
export const J2000 = 2451545.0

export const MJD_START = 2400000.5
export const DAYMS = 1000 * 60 * 60 * 24

export const DEG2RAD = 0.017453292519943295769236907684886
export const RAD2DEG = 57.295779513082320876798154814105
export const RAD2H = 3.8197186342054880584532103209403
export const H2RAD = 0.26179938779914943653855361527329
export const H2DEG = 15.0
export const DEG2H = 0.06666666666666666666666666666666666

export const SPEED_OF_LIGHT = 299792.458
export const SPEED_OF_LIGHT_MS = 299792458.0
export const SPEED_OF_LIGHT_APPROX_MS = 300000000.0

export const SIDEREAL_OVER_SOLAR_RATE = 1.0027379093	// Sidereal / solar rate.
export const AVERAGE_JULIAN_YEAR = 365.25		// See Observer's handbook (1999 - RAS of Canada).
export const AVERAGE_GREGORIAN_YEAR = 365.2425		//
export const AVERAGE_SIDEREAL_YEAR = 365.256363	// Fixed star to fixed star.
export const AVERAGE_ANOMALISTIC_YEAR = 365.259635	// Perihelion to perihelion.
export const AVERAGE_TROPICAL_YEAR = 365.242190	// Equinox to equinox.
export const AVERAGE_ECLIPSE_YEAR = 346.620075	// Lunar mode to lunar mode.

export const ONE_YEAR_IN_SECONDS = 31556952.0	// AVERAGE_GREGORIAN_YEAR * 86400;
export const ONE_MONTH_IN_SECONDS = 2635200.0	// 30.5 * 86400 || IMPRECISE!!!
export const ONE_WEEK_IN_SECONDS = 604800.0		// 7*86400;
export const ONE_DAY_IN_SECONDS = 86400.0
export const ONE_DAY_IN_MINUTES = 1440.0
export const ONE_DAY_IN_HOURS = 24.0
export const ONE_HOUR_IN_SECONDS = 3600.0
export const ONE_HOUR_IN_MINUTES = 60.0
export const ONE_MINUTE_IN_SECONDS = 60.0
export const HALF_DAY_IN_HOURS = 12.0

export const NOT_A_SCIENTIFIC_NUMBER = -999999999999999.0

export const ECLIPTIC_OBLIQUITY_J2000_0 = 23.4392911	// In degrees, see p.92 of AA.
export const ECLIPTIC_OBLIQUITY_B1950_0 = 23.4457889	// In degrees, see p.92 of AA.

export const JULIAN_YEAR = 365.25		// See p.133 of AA.
export const BESSELIAN_YEAR = 365.2421988	// See p.133 of AA.
export const JULIAN_DAY_B1950_0 = 2433282.4235	// See p.133 of AA.

export const GALACTIC_NORTH_POLE_ALPHA_B1950_0 = 192.25
export const GALACTIC_NORTH_POLE_DELTA_B1950_0 = 27.4

export const EARTH_EQUATORIAL_RADIUS = 6378.14		// See p82 of AA.
export const EARTH_RADIUS_FLATTENING_FACTOR = 1. / 298.257	// See p82 of AA.

export const ONE_UA_IN_KILOMETERS = 149597870.691
/*
 http://neo.jpl.nasa.gov/glossary/au.html
 Definition: An Astronomical Unit is approximately the mean distance between the Earth and the Sun. It is a derived 
 constant and used to indicate distances within the solar system. Its formal definition is the radius of an unperturbed 
 circular orbit a massless body would revolve about the sun in 2*(pi)/k days (i.e., 365.2568983.... days), where k is 
 defined as the Gaussian constant exactly equal to 0.01720209895. Since an AU is based on radius of a circular orbit, 
 one AU is actually slightly less than the average distance between the Earth and the Sun (approximately 150 million 
 km or 93 million miles).
*/

export const PC2UA = 206264.80624548031 // = 1.0/tan(1./3600.0*M_PI/180.);
export const PC2LY = 3.263797724738089 // = pc*ua/SPEED_OF_LIGHT/(ONE_DAY_INSECONDS*365.0)

//http://physics.nist.gov/cuu/index.html
export const PLANCK_CONSTANT = 6.62606957e-34 // Joule * seconds;
export const BOLTZMANN_CONSTANT = 1.3806488e-23 // Joule/Kelvin

// http://nssdc.gsfc.nasa.gov/planetary/factsheet/
// http://solarscience.msfc.nasa.gov

export const MSUN = 1.98855e30 // kg;
export const MJUP = 1.8990e27 // kg;
export const MNEP = 1.0243e26 // kg;
export const MEARTH = 5.9736e24 // kg;

export const ONE_MASS_OF_JUPITER_IN_NEPTUNE_MASS = 18.539490383676657
export const ONE_MASS_OF_JUPITER_IN_EARTH_MASS = 317.8987545198875

// EQUATORIAL RADII. See http://nssdc.gsfc.nasa.gov/planetary/factsheet/jupiterfact.html
export const ONE_SOLAR_RADIUS_IN_KILOMETERS = 695990.0 // km;
export const ONE_JUPITER_RADIUS_IN_KILOMETERS = 71492.0//
export const ONE_NEPTUNE_RADIUS_IN_KILOMETERS = 24764.0//
export const ONE_EARTH_RADIUS_IN_KILOMETERS = 6378.137//

export const HUBBLE_CONSTANT = 72.0

export const ABSOLUTE_ZERO_TEMPERATURE_CELSIUS = -273.15

// export const SUN_EXTENDED_EVENTS_ALTITUDES = [
//   [-0.833, 'sunrise', 'sunset'],
//   [-0.3, 'sunriseEnd', 'sunsetStart'],
//   [-6, 'dawn', 'dusk'],
//   [-12, 'nauticalDawn', 'nauticalDusk'],
//   [-18, 'nightEnd', 'night'],
//   [6, 'goldenHourEnd', 'goldenHour']
// ]

export const SUN_EVENTS_ALTITUDES = [-0.833, -6, -12, -18]
export const SUN_EXTENDED_EVENTS_ALTITUDES = [6, -0.3, -0.833, -6, -12, -18]

export type Degree = number;
export type Day = number;
export type Hour = number;
export type Pixel = number;
export type JulianDay = number;
export type ArcSecond = number;
export type JupiterRadius = number
export type SolarRadius = number
export type AstronomicalUnit = number