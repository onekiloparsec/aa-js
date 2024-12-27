pub mod juliandays;
pub mod utils;
pub mod constants;

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}
