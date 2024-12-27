// src/juliandays.rs

// This module is mostly useful for pure WASM-computations.

use crate::utils::{fmod24, fmod360};
use wasm_bindgen::prelude::*;

// Constants
const DAYMS: f64 = 86400000.0;
const J1970: f64 = 2440588.0;
const J2000: f64 = 2451545.0;
const MJD_START: f64 = 2400000.5;
const DEG2H: f64 = 24f64 / 360f64;

// Function to compute the date timestamp corresponding to the Julian Day.
#[wasm_bindgen]
pub fn get_milliseconds(jd: f64) -> i32 {
    ((jd + 0.5 - J1970) * DAYMS) as i32
}

// Function to compute the Julian day for a given date
#[wasm_bindgen]
pub fn get_julian_day(milliseconds: i32) -> f64 {
    milliseconds as f64 / DAYMS - 0.5 + J1970
}

// Function to compute the Modified Julian Day
#[wasm_bindgen]
pub fn get_modified_julian_day(jd: f64) -> f64 {
    jd - MJD_START
}

// Function to compute the Julian Day of Midnight UTC
#[wasm_bindgen]
pub fn get_julian_day_midnight(jd: f64) -> f64 {
    (jd - 0.5).floor() + 0.5
}

// Function to compute the Julian Century
#[wasm_bindgen]
pub fn get_julian_century(jd: f64) -> f64 {
    (jd - J2000) / 36525.0
}

// Function to compute the Julian Millennium
#[wasm_bindgen]
pub fn get_julian_millennium(jd: f64) -> f64 {
    (jd - J2000) / 365250.0
}

// Function to compute the Local Mean Sidereal Time
#[wasm_bindgen]
pub fn get_local_sidereal_time(jd: f64, lng: f64) -> f64 {
    let t = get_julian_century(jd);

    // Greenwich SiderealTime in degrees! Equ. 12.4 of AA, p. 88
    let gmst = 280.460_618_37 + 360.985_647_366_29 * (jd - 2451545f64) + 0.000_387_933 * t * t
        - t * t * t / 38_710_000f64;

    fmod24(fmod360(gmst + lng) * DEG2H)
}
