import { Degree } from './types'

// https://gist.github.com/wteuber/6241786
export function fmod (a: number, b: number): number {
  return Number((a - (Math.floor(a / b) * b)).toPrecision(8))
}

export function isNumber (v: any): boolean {
  return !isNaN(parseFloat(v)) && isFinite(v)
}

export function MapTo0To360Range (degrees: Degree): Degree {
  let fResult = fmod(degrees, 360)
  if (fResult < 0) {
    fResult += 360
  }
  return fResult
}

export function MapToMinus90To90Range (degrees: Degree): Degree {
  let fResult = MapTo0To360Range(degrees)

  if (fResult > 270) {
    fResult = fResult - 360
  } else if (fResult > 180) {
    fResult = 180 - fResult
  } else if (fResult > 90) {
    fResult = 180 - fResult
  }

  return fResult
}

export function MapTo0To1Range (fraction: number): number {
  let fResult = fmod(fraction, 1)
  if (fResult < 0) {
    fResult += 1
  }
  return fResult
}
