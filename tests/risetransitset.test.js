import { fmod, juliandays, risetransitset, STANDARD_ALTITUDE_STARS, Venus } from '@'
import { getJulianDayMidnight } from '@/juliandays'
import { getDecimalValue, getSexagesimalValue } from '@/sexagesimal'

describe('rise transit & sets', () => {
  test('circumpolar transit', () => {
    const jd = juliandays.getJulianDay()
    const results = risetransitset.getRiseTransitSetTimes(
      jd,
      { rightAscension: 0, declination: -89.23 },
      { longitude: 0, latitude: -70 },
      STANDARD_ALTITUDE_STARS
    )
    expect(results.transit.isCircumpolar).toBeTruthy()
    expect(results.transit.isAboveHorizon).toBeTruthy()
    expect(results.transit.isAboveAltitude).toBeTruthy()
    expect(results.rise.utc).toBeUndefined()
    expect(results.set.utc).toBeUndefined()
  })

  test('circumpolar transit [low precision]', () => {
    const jd = juliandays.getJulianDay()
    const results = risetransitset.getRiseTransitSetTimes(
      jd,
      { rightAscension: 0, declination: -89.23 },
      { longitude: 0, latitude: -70 },
      STANDARD_ALTITUDE_STARS,
      false
    )
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
    const results = risetransitset.getRiseTransitSetTimes(jd, coordsVenus, coordsBoston)
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
  test('approximate Venus on 1988 March 20 at Boston [low precision]', () => {
    const date = new Date(Date.UTC(1988, 2, 20, 0, 0, 0))
    const jd = juliandays.getJulianDay(date)
    const coordsBoston = { latitude: 42.3333, longitude: -71.0833 }
    const coordsVenus = { rightAscension: 41.73129, declination: 18.44092 }
    const results = risetransitset.getRiseTransitSetTimes(jd, coordsVenus, coordsBoston, STANDARD_ALTITUDE_STARS, false)
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

    const Theta0 = juliandays.getLocalSiderealTime(getJulianDayMidnight(jd), 0).hoursToDegrees()
    expect(Theta0.toNumber()).toBeCloseTo(177.742_08, 2)

    // In TD not UT, see AA p.103
    const venus = [
      { rightAscension: getDecimalValue(2, 42, 43.25).hoursToDegrees(), declination: getDecimalValue(18, 2, 54.4) },
      { rightAscension: getDecimalValue(2, 46, 55.51).hoursToDegrees(), declination: getDecimalValue(18, 26, 27.3) },
      { rightAscension: getDecimalValue(2, 51, 7.69).hoursToDegrees(), declination: getDecimalValue(18, 18, 49, 38.7) }
    ]
    const results = risetransitset.getAccurateRiseTransitSetTimes(jd, venus, coordsBoston, STANDARD_ALTITUDE_STARS, 2)
    expect(results.transit.isCircumpolar).toBeFalsy()
    expect(results.transit.isAboveHorizon).toBeTruthy()
    expect(results.transit.isAboveAltitude).toBeTruthy()

    // Our results don't agree perfectly with AA decimals?
    let { radix, minutes } = getSexagesimalValue(results.rise.utc)
    expect(radix.toNumber()).toEqual(12)
    expect(minutes.toNumber()).toEqual(26); // in AA, it is 25

    ({ radix, minutes } = getSexagesimalValue(results.transit.utc))
    expect(radix.toNumber()).toEqual(19)
    expect(minutes.toNumber()).toEqual(40); // in AA, it is 41

    ({ radix, minutes } = getSexagesimalValue(results.set.utc))
    expect(radix.toNumber()).toEqual(2)
    expect(minutes.toNumber()).toEqual(54)

    expect(results.rise.julianDay.toNumber() < results.transit.julianDay.toNumber()).toBeTruthy()
    expect(results.transit.julianDay.toNumber() < results.set.julianDay.toNumber()).toBeTruthy()
  })

  // See AA, pp 103 & 104
  test('accurate Venus on 1988 March 20 at Boston [low precision]', () => {
    const date = new Date(Date.UTC(1988, 2, 20, 0, 0, 0))
    const jd = juliandays.getJulianDay(date)
    const coordsBoston = { latitude: 42.3333, longitude: -71.0833 }

    const Theta0 = juliandays.getLocalSiderealTime(getJulianDayMidnight(jd), 0).hoursToDegrees()
    expect(Theta0.toNumber()).toBeCloseTo(177.742_08, 2)

    // In TD not UT, see AA p.103
    const venus = [
      { rightAscension: getDecimalValue(2, 42, 43.25).hoursToDegrees(), declination: getDecimalValue(18, 2, 54.4) },
      { rightAscension: getDecimalValue(2, 46, 55.51).hoursToDegrees(), declination: getDecimalValue(18, 26, 27.3) },
      { rightAscension: getDecimalValue(2, 51, 7.69).hoursToDegrees(), declination: getDecimalValue(18, 18, 49, 38.7) }
    ]
    const results = risetransitset.getAccurateRiseTransitSetTimes(jd, venus, coordsBoston, STANDARD_ALTITUDE_STARS, 2, false)
    expect(results.transit.isCircumpolar).toBeFalsy()
    expect(results.transit.isAboveHorizon).toBeTruthy()
    expect(results.transit.isAboveAltitude).toBeTruthy()

    // Our results don't agree perfectly with AA decimals?
    let { radix, minutes } = getSexagesimalValue(results.rise.utc)
    expect(radix.toNumber()).toEqual(12)
    expect(minutes.toNumber()).toEqual(26); // in AA, it is 25

    ({ radix, minutes } = getSexagesimalValue(results.transit.utc))
    expect(radix.toNumber()).toEqual(19)
    expect(minutes.toNumber()).toEqual(40); // in AA, it is 41

    ({ radix, minutes } = getSexagesimalValue(results.set.utc))
    expect(radix.toNumber()).toEqual(2)
    expect(minutes.toNumber()).toEqual(54)

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
    const results = risetransitset.getAccurateRiseTransitSetTimes(jd0, [coords0, coords1, coords2], umbc)
    // See https://www.arcsecond.io/observingsites/cac8b50e-5602-467d-a98f-59358ab29077
    const offsetUTC = -18000 // seconds
    const offsetDST = 3600 // seconds
    const offsetHours = (offsetUTC + offsetDST) / 3600
    expect(fmod(results.rise.utc.toNumber() + offsetHours, 24)).toBeCloseTo(3.43, 1)
    expect(fmod(results.transit.utc.toNumber() + offsetHours, 24)).toBeCloseTo(10.0, 1)
    expect(fmod(results.set.utc.toNumber() + offsetHours, 24)).toBeCloseTo(16.47, 1)
  })


  // See also AA p 103 for inspiration
  test('approximate Venus on 2023 October 14 at UMBC [low precision]', () => {
    // We should normally use the Topocentric coordinates of Venus, not the Geocentric ones.
    // Yet the topocentric corrections are usually small (< 30").
    // Note, months are 0-based, hence 9 = october.
    const jd0 = juliandays.getJulianDay(new Date(Date.UTC(2023, 9, 14, 0, 0)))
    const umbc = { longitude: -76.70978311382578, latitude: 39.25443537644697 }
    const coords0 = Venus.getGeocentricEquatorialCoordinates(jd0 - 1)
    const coords1 = Venus.getGeocentricEquatorialCoordinates(jd0)
    const coords2 = Venus.getGeocentricEquatorialCoordinates(jd0 + 1)
    const results = risetransitset.getAccurateRiseTransitSetTimes(jd0, [coords0, coords1, coords2], umbc, STANDARD_ALTITUDE_STARS, 1, false)
    // See https://www.arcsecond.io/observingsites/cac8b50e-5602-467d-a98f-59358ab29077
    const offsetUTC = -18000 // seconds
    const offsetDST = 3600 // seconds
    const offsetHours = (offsetUTC + offsetDST) / 3600
    expect(fmod(results.rise.utc.toNumber() + offsetHours, 24)).toBeCloseTo(3.43, 1)
    expect(fmod(results.transit.utc.toNumber() + offsetHours, 24)).toBeCloseTo(10.0, 1)
    expect(fmod(results.set.utc.toNumber() + offsetHours, 24)).toBeCloseTo(16.47, 1)
  })
})
