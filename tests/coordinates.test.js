import { getJulianDay } from '@/juliandays'
import { H2DEG } from '@/constants'
import { getFlatteningCorrections } from '@/earth/coordinates'
import { getDecimal } from '@/sexagesimal'
import {
  getDeclinationFromEcliptic,
  getEclipticLatitudeFromEquatorial,
  getEclipticLongitudeFromEquatorial,
  getParallacticAngle,
  getRightAscensionFromEcliptic,
  transformEquatorialToTopocentric
} from '@/coordinates'
import { Mars } from '@'

test('parallactic angle before meridian', () => {
  const utcDate = new Date(Date.UTC(2017, 5, 14, 2, 0, 0.0))
  let jd = getJulianDay(utcDate)

  // gro_j1655_40, see below
  let ra = getDecimal(16, 54, 0.14) // in hours
  let dec = getDecimal(39, 50, 44.9, false)

  // http://www.ls.eso.org/lasilla/Telescopes/2p2/D1p5M/
  let lng = getDecimal(70, 44, 7.662, false) // east-positive
  let lat = getDecimal(29, 15, 14.235, false)

  // See https://www.eso.org/sci/observing/tools/calendar/ParAng.html to check values.
  let refAngle = -78.1

  expect(getParallacticAngle(jd, ra, dec, lng, lat)).toBeCloseTo(refAngle, 0)
})

test('parallactic angle after meridian', () => {
  const utcDate = new Date(Date.UTC(2017, 5, 14, 6, 0, 0.0))
  let jd = getJulianDay(utcDate)

  // gro_j1655_40, see below
  let ra = getDecimal(16, 54, 0.14) // in hours
  let dec = getDecimal(39, 50, 44.9, false)

  // http://www.ls.eso.org/lasilla/Telescopes/2p2/D1p5M/
  let lng = getDecimal(70, 44, 7.662, false) // east-positive
  let lat = getDecimal(29, 15, 14.235, false)

  // Slightly adjusted values. Ref might not be 100% accurate...
  // Looking for improved reference values...
  let refAngle = 74.4

  expect(getParallacticAngle(jd, ra, dec, lng, lat)).toBeCloseTo(refAngle, 0)
})

// See AA p95, Ex 13.a
test('transform equatorial to ecliptic', () => {
  const pollux = { rightAscension: 7 + 45 / 60 + 18.946 / 3600, declination: 28 + 1 / 60 + 34.26 / 3600 }
  const lambda = getEclipticLongitudeFromEquatorial(pollux.rightAscension, pollux.declination)
  expect(lambda).toBeCloseTo(113.215630, 6)
  const beta = getEclipticLatitudeFromEquatorial(pollux.rightAscension, pollux.declination)
  expect(beta).toBeCloseTo(6.684170, 6)
})


// See AA p95, Ex 13.a
test('transform ecliptic to equatorial', () => {
  const pollux = { rightAscension: 7 + 45 / 60 + 18.946 / 3600, declination: 28 + 1 / 60 + 34.26 / 3600 }
  const alpha = getRightAscensionFromEcliptic(113.215630, 6.684170)
  expect(alpha).toBeCloseTo(pollux.rightAscension, 6)
  const delta = getDeclinationFromEcliptic(113.215630, 6.684170)
  expect(delta).toBeCloseTo(pollux.declination, 6)
})
