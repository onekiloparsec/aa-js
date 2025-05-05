// src/lib.rs

use wasm_bindgen::prelude::*;
use crate::constants::*;
use crate::structs::*;

use crate::juliandays::get_local_sidereal_time;

#[wasm_bindgen]
pub fn get_parallactic_angle(jd: f64, equ_coords: EquatorialCoordinates, geo_coords: GeographicCoordinates) -> f64 {
    let lmst: f64 = get_local_sidereal_time(jd, geo_coords.longitude) * constants::H2DEG;
    let ha: f64 = (lmst - equ_coords.right_ascension) * constants::DEG2RAD;

    let r_equ_coords = EquatorialCoordinates {
        right_ascension: equ_coords.right_ascension * constants::DEG2RAD,
        declination: equ_coords.declination * constants::DEG2RAD,
    };
    let r_geo_coords = GeographicCoordinates {
        longitude: geo_coords.longitude * constants::DEG2RAD,
        latitude: geo_coords.latitude * constants::DEG2RAD,
    };

    let cosdec = r_equ_coords.declination.cos();
    let angle = if cosdec != 0.0 {
        (r_geo_coords.latitude.tan() * cosdec - r_equ_coords.declination.sin() * ha.sin()).atan2(ha.sin()) * constants::RAD2DEG;
    } else {
        if r_geo_coords.latitude >= 0.0 { 180.0 } else { 0.0 };
    };

    angle
}

#[wasm_bindgen]
pub fn get_great_circle_angular_distance(equ_coords1: EquatorialCoordinates, equ_coords2: EquatorialCoordinates) -> f64 {
    let alpha1 = equ_coords1.right_ascension * constants::DEG2RAD;
    let alpha2 = equ_coords2.right_ascension * constants::DEG2RAD;
    let delta1 = equ_coords1.declination * constants::DEG2RAD;
    let delta2 = equ_coords2.declination * constants::DEG2RAD;

    let x = delta1.cos() * delta2.sin() - delta1.sin() * delta2.cos() * (alpha2 - alpha1).cos();
    let y = delta2.cos() * (alpha2 - alpha1).sin();
    let z = delta1.sin() * delta2.sin() + delta1.cos() * delta2.cos() * (alpha2 - alpha1).cos();

    (y.atan2(z).hypot(x)).atan2(z) / constants::DEG2RAD
}
