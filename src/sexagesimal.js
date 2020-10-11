'use strict'

function decimal (d, m, s, positive = true) {
  // if (!positive) {
  //   assert(Degrees >= 0)  // All parameters should be non negative if the "bPositive" parameter is false
  //   assert(Minutes >= 0)
  //   assert(Seconds >= 0)
  // }

  if (positive) {
    return d + m / 60 + s / 3600
  } else {
    return -1 * d - m / 60 - s / 3600
  }
}

function sexagesimal (decimal) {
  const degrees = Math.floor(decimal)
  const fractionDegrees = decimal - degrees
  const fractionMinutes = fractionDegrees * 60
  const minutes = Math.floor(fractionMinutes)
  const seconds = (fractionMinutes - minutes) * 60

  return {
    radix: degrees,
    minutes: minutes,
    seconds: seconds
  }
}

export default {
  decimal,
  sexagesimal
}
