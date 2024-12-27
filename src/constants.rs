// src/lib.rs

use wasm_bindgen::prelude::*;
// use std::f64::consts::PI;

// Using ChatGPT to generate the following constants.

// Do not use wasm_bindgen which cannot export constants to TS/JS.
pub const J1970: f64 = 2440588.0; // Julian Day for 1970-01-01
pub const J2000: f64 = 2451545.0; // Julian Day for 2000-01-01
pub const MJD_START: f64 = 2400000.5; // Modified Julian Day start

pub const CONSTANT_OF_ABERRATION: f64 = 20.49552; // Constant of aberration
pub const SIDEREAL_OVER_SOLAR_RATE: f64 = 1.0027379093; // Sidereal / solar rate
pub const AVERAGE_JULIAN_YEAR: f64 = 365.25; // Average Julian year
pub const AVERAGE_GREGORIAN_YEAR: f64 = 365.2425; // Average Gregorian year
pub const AVERAGE_SIDEREAL_YEAR: f64 = 365.256363; // Average sidereal year
pub const AVERAGE_ANOMALISTIC_YEAR: f64 = 365.259635; // Average anomalistic year
pub const AVERAGE_TROPICAL_YEAR: f64 = 365.242190; // Average tropical year
pub const AVERAGE_ECLIPSE_YEAR: f64 = 346.620075; // Average eclipse year
pub const ECLIPTIC_OBLIQUITY_J2000_0: f64 = 23.4392911; // Ecliptic obliquity J2000
pub const ECLIPTIC_OBLIQUITY_B1950_0: f64 = 23.4457889; // Ecliptic obliquity B1950
pub const JULIAN_YEAR: f64 = 365.25; // Julian year
pub const BESSELIAN_YEAR: f64 = 365.2421988; // Besselian year
pub const JULIAN_DAY_B1950_0: f64 = 2433282.4235; // Julian day B1950
pub const GALACTIC_NORTH_POLE_ALPHA_B1950_0: f64 = 192.25; // Galactic north pole alpha B1950
pub const GALACTIC_NORTH_POLE_DELTA_B1950_0: f64 = 27.4; // Galactic north pole delta B1950
pub const EARTH_EQUATORIAL_RADIUS: f64 = 6378.14; // Earth equatorial radius in km
pub const EARTH_RADIUS_FLATTENING_FACTOR: f64 = 1.0 / 298.257; // Earth radius flattening factor
// pub const EARTH_MERIDIAN_ECCENTRICITY: f64 = (EARTH_RADIUS_FLATTENING_FACTOR * 2.0 - EARTH_RADIUS_FLATTENING_FACTOR.powi(2)).sqrt(); // Earth meridian eccentricity

pub const DAYMS: f64 = 1000.0 * 3600.0 * 24.0; // Milliseconds in a day
pub const PI: f64 = 3.141592653589793; // Pi constant
pub const PITWO: f64 = PI * 2.0; // 2 * Pi
pub const PIHALF: f64 = PI / 2.0; // Pi / 2
pub const DEG2RAD: f64 = PI / 180.0; // Degrees to Radians
pub const RAD2DEG: f64 = 180.0 / PI; // Radians to Degrees
pub const RAD2H: f64 = 12.0 / PI; // Radians to Hours
pub const H2RAD: f64 = PI / 12.0; // Hours to Radians
pub const H2DEG: f64 = 360.0 / 24.0; // Hours to Degrees
pub const DEG2H: f64 = 24.0 / 360.0; // Degrees to Hours
pub const SPEED_OF_LIGHT: f64 = 299792.458; // Speed of light in km/s
pub const SPEED_OF_LIGHT_APPROX: f64 = 300000.0; // Approximate speed of light

pub const ONE_DAY_IN_SECONDS: f64 = 86400.0; // One day in seconds
pub const ONE_YEAR_IN_SECONDS: f64 = AVERAGE_GREGORIAN_YEAR * ONE_DAY_IN_SECONDS; // One year in seconds

pub const ONE_UA_IN_KILOMETERS: f64 = 149597870.691; // One astronomical unit in kilometers
pub const PC2UA: f64 = 206264.80624548031; // Parsec to astronomical unit
pub const PC2LY: f64 = 3.263797724738089; // Parsec to light year
pub const PLANCK_CONSTANT: f64 = 6.62606957e-34; // Planck constant in Joule * seconds
pub const BOLTZMANN_CONSTANT: f64 = 1.3806488e-23; // Boltzmann constant in Joule/Kelvin
pub const MSUN: f64 = 1.98855e30; // Solar mass in kg
pub const MJUP: f64 = 1.8990e27; // Jupiter mass in kg
pub const MNEP: f64 = 1.0243e26; // Neptune mass in kg
pub const MEARTH: f64 = 5.9736e24; // Earth mass in kg
pub const ONE_MASS_OF_JUPITER_IN_NEPTUNE_MASS: f64 = 18.539490383676657; // Jupiter mass in Neptune mass
pub const ONE_MASS_OF_JUPITER_IN_EARTH_MASS: f64 = 317.8987545198875; // Jupiter mass in Earth mass
pub const HUBBLE_CONSTANT: f64 = 72.0; // Hubble constant
pub const ABSOLUTE_ZERO_TEMPERATURE_CELSIUS: f64 = -273.15; // Absolute zero in Celsius

pub const SUN_EVENTS_ALTITUDES: [f64; 4] = [-0.833, -6.0, -12.0, -18.0]; // Sun event altitudes
pub const SUN_EXTENDED_EVENTS_ALTITUDES: [f64; 6] = [6.0, -0.3, -0.833, -6.0, -12.0, -18.0]; // Extended sun event altitudes
pub const STANDARD_ALTITUDE_STARS: f64 = -0.5667; // Standard altitude for stars
pub const STANDARD_ALTITUDE_MOON: f64 = 0.125; // Standard altitude for moon
pub const STANDARD_ALTITUDE_SUN: f64 = -0.8333; // Standard altitude for sun
pub const MOON_SYNODIC_PERIOD: f64 = 29.53058770576; // Moon synodic period

pub enum MoonPhaseQuarter {
    New,
    FirstQuarter,
    Full,
    LastQuarter,
}

pub enum MoonPhase {
    New,
    WaxingCrescent,
    FirstQuarter,
    WaxingGibbous,
    Full,
    WaningGibbous,
    LastQuarter,
    WaningCrescent,
}

pub const MOON_PHASE_UPPER_LIMITS: [f64; 8] = [
    0.033863193308711,
    0.216136806691289,
    0.283863193308711,
    0.466136806691289,
    0.533863193308711,
    0.716136806691289,
    0.783863193308711,
    0.966136806691289,
];

// --- exporting only a few constants to TS/JS ---

// Export a JavaScript-compatible getter for the constant value. Note the js_name attribute.
#[wasm_bindgen(js_name = J1970)]
pub fn j1970() -> f64 {
    J1970
}

#[wasm_bindgen(js_name = J2000)]
pub fn j2000() -> f64 {
    J2000
}

// Add TypeScript definition for a true constant
#[wasm_bindgen(typescript_custom_section)]
const TS_DEF: &'static str = r#"
export const J1970: number;
export const J2000: number;
"#;
