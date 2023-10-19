import { constants, juliandays, transits, times, Venus } from '../src'
import * as utils from '../src/utils.ts'

describe('transits of exoplanets', () => {
  it('get transit for H = 0', () => {
    const alt = transits.getTransitAltitude(291.0625 * constants.DEG2H, 0.7461111, -70, -30)
    expect(alt).toBeCloseTo(59.2538889, 5)
  })

  it('get transit for a given transit time', () => {
    const tzeroPrimaryTransit = 2454273.3436
    const alt = transits.getTransitAltitude(291.0625 * constants.DEG2H, 0.7461111, -70, -30, tzeroPrimaryTransit)
    expect(alt).toBeCloseTo(-47.615535, 5)
  })
})


test('circumpolar transit', () => {
  const results = transits.getRiseSetTransitTimes(juliandays.getJulianDay(), 0, -89.23, 0, -70)
  expect(results.transit.isCircumpolar).toBeTruthy()
  expect(results.transit.isAboveHorizon).toBeTruthy()
  expect(results.transit.isAboveAltitude).toBeTruthy()
  expect(results.rise.utc).toBeUndefined()
  expect(results.set.utc).toBeUndefined()
})


// See AA, pp 103 & 104
test('approximate Venus on 1988 March 20 at Boston', () => {
  const date = new Date(Date.UTC(1988, 2, 20, 0, 0, 0))
  const jd = juliandays.getJulianDay(date)
  const coordsBoston = { latitude: 42.3333, longitude: -71.0833 }
  const coordsVenus = { rightAscension: 41.73129, declination: 18.44092 }
  const results = transits.getRiseSetTransitTimes(
    jd,
    coordsVenus.rightAscension * constants.DEG2H,
    coordsVenus.declination,
    coordsBoston.longitude,
    coordsBoston.latitude
  )
  expect(results.transit.isCircumpolar).toBeFalsy()
  expect(results.transit.isAboveHorizon).toBeTruthy()
  expect(results.transit.isAboveAltitude).toBeTruthy()
  expect(results.rise.utc).toBeCloseTo(24 * 0.51766, 2)
  // expect(results.transit.utc).toBeCloseTo(24 * 0.81980, 1)
  expect(results.set.utc).toBeCloseTo(24 * 0.12130, 6)
  expect(results.rise.julianDay < results.transit.julianDay).toBeTruthy()
  expect(results.transit.julianDay < results.set.julianDay).toBeTruthy()
})


// See AA, pp 103 & 104
test('accurate Venus on 1988 March 20 at Boston', () => {
  const date = new Date(Date.UTC(1988, 2, 20, 0, 0, 0))
  const jd = juliandays.getJulianDay(date)
  const coordsBoston = { latitude: 42.3333, longitude: -71.0833 }
  const rasVenus = [40.68021 * constants.DEG2H, 41.73129 * constants.DEG2H, 42.78204 * constants.DEG2H]
  const decVenus = [18.04762, 18.44092, 18.82742]
  const results = transits.getAccurateRiseSetTransitTimes(
    jd,
    rasVenus,
    decVenus,
    coordsBoston.longitude,
    coordsBoston.latitude
  )
  expect(results.transit.isCircumpolar).toBeFalsy()
  expect(results.transit.isAboveHorizon).toBeTruthy()
  expect(results.transit.isAboveAltitude).toBeTruthy()
  expect(results.rise.utc).toBeCloseTo(24 * 0.51766, 2)
  // expect(results.transit.utc).toBeCloseTo(24 * 0.81980, 1)
  expect(results.set.utc).toBeCloseTo(24 * 0.12130, 6)
  expect(results.rise.julianDay < results.transit.julianDay).toBeTruthy()
  expect(results.transit.julianDay < results.set.julianDay).toBeTruthy()
})


// See AA p 103
test('approximate Venus on 2023 October 14 at UMBC', () => {
  // We should normally use the Topocentric coordinates of Venus, not the Geocentric ones.
  // Yet the topocentric corrections are usually small (< 30").
  // Note, months are 0-based, hence 9 = october.
  const jd = juliandays.getJulianDay(new Date(Date.UTC(2023, 9, 14, 0, 0)))
  const jd0 = times.transformUTC2TT(jd)
  const umbc = { longitude: -76.70978311382578, latitude: 39.25443537644697 }
  const coords0 = Venus.getApparentEquatorialCoordinates(jd0 - 1)
  const coords1 = Venus.getApparentEquatorialCoordinates(jd0)
  const coords2 = Venus.getApparentEquatorialCoordinates(jd0 + 1)
  const results = transits.getAccurateRiseSetTransitTimes(
    jd,
    [coords0.rightAscension, coords1.rightAscension, coords2.rightAscension],
    [coords0.declination, coords1.declination, coords2.declination],
    umbc.longitude,
    umbc.latitude
  )
  // See https://www.arcsecond.io/observingsites/cac8b50e-5602-467d-a98f-59358ab29077
  const offsetUTC = -18000 // seconds
  const offsetDST = 3600 // seconds
  const offsetHours = (offsetUTC + offsetDST) / 3600
  expect(utils.fmod(results.rise.utc + offsetHours, 24)).toBeCloseTo(3.5, 1) // FAIL???
  expect(utils.fmod(results.transit.utc + offsetHours, 24)).toBeCloseTo(10.0, 1) // FAIL???
  expect(utils.fmod(results.set.utc + offsetHours, 24)).toBeCloseTo(16.30, 1) // FAIL???
})
