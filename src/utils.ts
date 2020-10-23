// https://gist.github.com/wteuber/6241786
import { Degree } from "./constants";

export function fmod(a: number, b: number): number {
  return Number((a - (Math.floor(a / b) * b)).toPrecision(8))
}

export function isNumber(v: any): boolean {
  return !isNaN(parseFloat(v)) && isFinite(v)
}

export function MapTo0To360Range(Degrees: Degree): Degree {
  let fResult = fmod(Degrees, 360)
  if (fResult < 0) {
    fResult += 360
  }
  return fResult
}

export function MapToMinus90To90Range(Degrees: Degree): Degree {
  let fResult = MapTo0To360Range(Degrees)

  if (fResult > 270) {
    fResult = fResult - 360
  } else if (fResult > 180) {
    fResult = 180 - fResult
  } else if (fResult > 90) {
    fResult = 180 - fResult
  }

  return fResult
}

export function MapTo0To1Range(fraction: number): number {
  let fResult = fmod(fraction, 1)
  if (fResult < 0) {
    fResult += 1
  }
  return fResult
}
