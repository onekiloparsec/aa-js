use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(Debug)]
pub struct EquatorialCoordinates {
    pub right_ascension: f64, // in degrees
    pub declination: f64,      // in degrees
}

#[wasm_bindgen]
#[derive(Debug)]
pub struct GeographicCoordinates {
    pub longitude: f64, // in degrees
    pub latitude: f64,  // in degrees
}
