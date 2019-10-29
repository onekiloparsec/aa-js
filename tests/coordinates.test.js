import coordinates from '../src/coordinates'
import sexagesimal from '../src/sexagesimal'
import julianday from '../src/julianday'

test('get altitude', () => {
  expect(coordinates.getHorizontalAltitude({})).toBe(-1)
  expect(coordinates.getHorizontalAltitude({ julianDayValue: 24550000 })).toBe(-1)
  expect(coordinates.getHorizontalAltitude({ julianDayValue: null, targetCoords: {}, siteCoords: {} })).toBe(-1)
})

test('parallactic angle before meridian', () => {
  const utcDate = new Date(Date.UTC(2017, 5, 14, 2, 0, 0.0))
  let julianDayValue = julianday.getJulianDay(utcDate)

  // gro_j1655_40, see below
  let skyCoords = {
    rightAscension: sexagesimal.getDecimal(16, 54, 0.14), // in hours
    declination: sexagesimal.getDecimal(39, 50, 44.9, false)
  }

  // http://www.ls.eso.org/lasilla/Telescopes/2p2/D1p5M/
  let siteCoords = {
    longitude: sexagesimal.getDecimal(70, 44, 7.662, false), // east-positive
    latitude: sexagesimal.getDecimal(29, 15, 14.235, false)
  }

  // See https://www.eso.org/sci/observing/tools/calendar/ParAng.html to check values.
  let refAngle = -78.1

  expect(coordinates.getParallacticAngle({ julianDayValue, skyCoords, siteCoords })).toBeCloseTo(refAngle, 0)
})

test('parallactic angle after meridian', () => {
  const utcDate = new Date(Date.UTC(2017, 5, 14, 6, 0, 0.0))
  let julianDayValue = julianday.getJulianDay(utcDate)

  // gro_j1655_40, see below
  let skyCoords = {
    rightAscension: sexagesimal.getDecimal(16, 54, 0.14), // in hours
    declination: sexagesimal.getDecimal(39, 50, 44.9, false)
  }

  // http://www.ls.eso.org/lasilla/Telescopes/2p2/D1p5M/
  let siteCoords = {
    longitude: sexagesimal.getDecimal(70, 44, 7.662, false), // east-positive
    latitude: sexagesimal.getDecimal(29, 15, 14.235, false)
  }

  // Slightly adjusted values. Ref might not be 100% accurate...
  // Looking for improved reference values...
  let refAngle = 74.4

  expect(coordinates.getParallacticAngle({ julianDayValue, skyCoords, siteCoords })).toBeCloseTo(refAngle, 0)
})
