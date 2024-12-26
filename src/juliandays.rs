// src/juliandays.rs

use wasm_bindgen::prelude::*;

// Constants
const DAYMS: f64 = 86400000.0;
const J1970: f64 = 2440588.0;
const J2000: f64 = 2451545.0;
const MJD_START: f64 = 2400000.5;

// Function to compute the date timestamp corresponding to the Julian Day
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

// Additional functions would need to be implemented similarly...
