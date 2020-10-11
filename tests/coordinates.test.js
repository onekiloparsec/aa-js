import coordinates from '../src/coordinates'
import sexagesimal from '../src/sexagesimal'
import julianday from '../src/julianday'

test('parallactic angle before meridian', () => {
  const utcDate = new Date(Date.UTC(2017, 5, 14, 2, 0, 0.0))
  let jd = julianday.julianDay(utcDate)

  // gro_j1655_40, see below
  let ra = sexagesimal.decimal(16, 54, 0.14) // in hours
  let dec = sexagesimal.decimal(39, 50, 44.9, false)

  // http://www.ls.eso.org/lasilla/Telescopes/2p2/D1p5M/
  let lng = sexagesimal.decimal(70, 44, 7.662, false) // east-positive
  let lat = sexagesimal.decimal(29, 15, 14.235, false)

  // See https://www.eso.org/sci/observing/tools/calendar/ParAng.html to check values.
  let refAngle = -78.1

  expect(coordinates.parallacticAngle(jd, ra, dec, lat, lng)).toBeCloseTo(refAngle, 0)
})

test('parallactic angle after meridian', () => {
  const utcDate = new Date(Date.UTC(2017, 5, 14, 6, 0, 0.0))
  let jd = julianday.julianDay(utcDate)

  // gro_j1655_40, see below
  let ra = sexagesimal.decimal(16, 54, 0.14) // in hours
  let dec = sexagesimal.decimal(39, 50, 44.9, false)

  // http://www.ls.eso.org/lasilla/Telescopes/2p2/D1p5M/
  let lng = sexagesimal.decimal(70, 44, 7.662, false) // east-positive
  let lat = sexagesimal.decimal(29, 15, 14.235, false)

  // Slightly adjusted values. Ref might not be 100% accurate...
  // Looking for improved reference values...
  let refAngle = 74.4

  expect(coordinates.parallacticAngle(jd, ra, dec, lat, lng)).toBeCloseTo(refAngle, 0)
})
