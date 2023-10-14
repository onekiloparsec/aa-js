import { coordinates, juliandays, sexagesimal } from '../src'

test('parallactic angle before meridian', () => {
  const utcDate = new Date(Date.UTC(2017, 5, 14, 2, 0, 0.0))
  let jd = juliandays.getJulianDay(utcDate)

  // gro_j1655_40, see below
  let ra = sexagesimal.getDecimal(16, 54, 0.14) // in hours
  let dec = sexagesimal.getDecimal(39, 50, 44.9, false)

  // http://www.ls.eso.org/lasilla/Telescopes/2p2/D1p5M/
  let lng = sexagesimal.getDecimal(70, 44, 7.662, false) // east-positive
  let lat = sexagesimal.getDecimal(29, 15, 14.235, false)

  // See https://www.eso.org/sci/observing/tools/calendar/ParAng.html to check values.
  let refAngle = -78.1

  expect(coordinates.getParallacticAngle(jd, ra, dec, lng, lat)).toBeCloseTo(refAngle, 0)
})

test('parallactic angle after meridian', () => {
  const utcDate = new Date(Date.UTC(2017, 5, 14, 6, 0, 0.0))
  let jd = juliandays.getJulianDay(utcDate)

  // gro_j1655_40, see below
  let ra = sexagesimal.getDecimal(16, 54, 0.14) // in hours
  let dec = sexagesimal.getDecimal(39, 50, 44.9, false)

  // http://www.ls.eso.org/lasilla/Telescopes/2p2/D1p5M/
  let lng = sexagesimal.getDecimal(70, 44, 7.662, false) // east-positive
  let lat = sexagesimal.getDecimal(29, 15, 14.235, false)

  // Slightly adjusted values. Ref might not be 100% accurate...
  // Looking for improved reference values...
  let refAngle = 74.4

  expect(coordinates.getParallacticAngle(jd, ra, dec, lng, lat)).toBeCloseTo(refAngle, 0)
})

// See AA p95, Ex 13.a
test('transform equatorial to ecliptic', () => {
  const pollux = { rightAscension: 7 + 45 / 60 + 18.946 / 3600, declination: 28 + 1 / 60 + 34.26 / 3600 }
  const lambda = coordinates.getEclipticLongitudeFromEquatorial(pollux.rightAscension, pollux.declination)
  expect(lambda).toBeCloseTo(113.215630, 6)
  const beta = coordinates.getEclipticLatitudeFromEquatorial(pollux.rightAscension, pollux.declination)
  expect(beta).toBeCloseTo(6.684170, 6)
})
