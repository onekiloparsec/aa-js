import * as utils from '@/utils'
import * as risetransitsets from '@/risetransitsets'
import * as constants from '@/constants'
import { STANDARD_ALTITUDE_STARS } from '@/constants'
import * as juliandays from '@/juliandays'
import { Venus } from '@/planets'

describe('rise transit & sets', () => {

  test('circumpolar transit', () => {
    const results = risetransitsets.getRiseSetTransitTimes(juliandays.getJulianDay(), 0, -89.23, 0, -70, STANDARD_ALTITUDE_STARS, 0)
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
    const results = risetransitsets.getRiseSetTransitTimes(
      jd,
      coordsVenus.rightAscension * constants.DEG2H,
      coordsVenus.declination,
      coordsBoston.longitude,
      coordsBoston.latitude
    )
    expect(results.transit.isCircumpolar).toBeFalsy()
    expect(results.transit.isAboveHorizon).toBeTruthy()
    expect(results.transit.isAboveAltitude).toBeTruthy()
    expect(results.rise.utc.toNumber()).toBeCloseTo(24 * 0.51766, 1)
    expect(results.transit.utc.toNumber()).toBeCloseTo(24 * 0.81980, 1)
    expect(results.set.utc.toNumber()).toBeCloseTo(24 * 0.12130, 2)
    expect(results.rise.julianDay.lessThan(results.transit.julianDay)).toBeTruthy()
    expect(results.transit.julianDay.lessThan(results.set.julianDay)).toBeTruthy()
  })


// See AA, pp 103 & 104
  test('accurate Venus on 1988 March 20 at Boston', () => {
    const date = new Date(Date.UTC(1988, 2, 20, 0, 0, 0))
    const jd = juliandays.getJulianDay(date)
    const coordsBoston = { latitude: 42.3333, longitude: -71.0833 }
    const rasVenus = [constants.DEG2H.mul(40.68021), constants.DEG2H.mul(41.73129), constants.DEG2H.mul(42.78204)]
    const decVenus = [18.04762, 18.44092, 18.82742]
    const results = risetransitsets.getAccurateRiseSetTransitTimes(
      jd,
      rasVenus,
      decVenus,
      coordsBoston.longitude,
      coordsBoston.latitude
    )
    expect(results.transit.isCircumpolar).toBeFalsy()
    expect(results.transit.isAboveHorizon).toBeTruthy()
    expect(results.transit.isAboveAltitude).toBeTruthy()
    // Our results don't agree perfectly with AA decimals, probably ours are made with greater precision from the start.
    expect(results.rise.utc.toNumber()).toBeCloseTo(24 * 0.51766, 1)
    expect(results.transit.utc.toNumber()).toBeCloseTo(24 * 0.81980, 1)
    expect(results.set.utc).toBeCloseTo(24 * 0.12130, 1)
    expect(results.rise.julianDay.toNumber() < results.transit.julianDay.toNumber()).toBeTruthy()
    expect(results.transit.julianDay.toNumber() < results.set.julianDay.toNumber()).toBeTruthy()
  })


// See also AA p 103 for inspiration
  test('approximate Venus on 2023 October 14 at UMBC', () => {
    // We should normally use the Topocentric coordinates of Venus, not the Geocentric ones.
    // Yet the topocentric corrections are usually small (< 30").
    // Note, months are 0-based, hence 9 = october.
    const jd0 = juliandays.getJulianDay(new Date(Date.UTC(2023, 9, 14, 0, 0)))
    const umbc = { longitude: -76.70978311382578, latitude: 39.25443537644697 }
    const coords0 = Venus.getGeocentricEquatorialCoordinates(jd0 - 1)
    const coords1 = Venus.getGeocentricEquatorialCoordinates(jd0)
    const coords2 = Venus.getGeocentricEquatorialCoordinates(jd0 + 1)
    const results = risetransitsets.getAccurateRiseSetTransitTimes(
      jd0,
      [coords0.rightAscension, coords1.rightAscension, coords2.rightAscension],
      [coords0.declination, coords1.declination, coords2.declination],
      umbc.longitude,
      umbc.latitude
    )
    // See https://www.arcsecond.io/observingsites/cac8b50e-5602-467d-a98f-59358ab29077
    const offsetUTC = -18000 // seconds
    const offsetDST = 3600 // seconds
    const offsetHours = (offsetUTC + offsetDST) / 3600
    expect(utils.fmod(results.rise.utc.toNumber() + offsetHours, 24)).toBeCloseTo(3.43, 1)
    expect(utils.fmod(results.transit.utc.toNumber() + offsetHours, 24)).toBeCloseTo(10.0, 1)
    expect(utils.fmod(results.set.utc.toNumber() + offsetHours, 24)).toBeCloseTo(16.47, 1)
  })
})
