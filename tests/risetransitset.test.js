import { fmod, H2DEG, juliandays, STANDARD_ALTITUDE_STARS, Sun, Venus } from '@'
import { getAccurateRiseTransitSetTimes, getRiseTransitSetTimes } from '@/risetransitset'
import { getDecimalValue, getSexagesimalValue } from '@/sexagesimal'
import { getJulianDayMidnight } from '@/juliandays'

describe('rise transit & sets', () => {
  test('circumpolar transit', () => {
    const jd = juliandays.getJulianDay()
    const results = getRiseTransitSetTimes(
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
    const results = getRiseTransitSetTimes(
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
    const results = getRiseTransitSetTimes(jd, coordsVenus, coordsBoston)
    expect(results.transit.isCircumpolar).toBeFalsy()
    expect(results.transit.isAboveHorizon).toBeTruthy()
    expect(results.transit.isAboveAltitude).toBeTruthy()
    expect(results.rise.utc).toBeCloseTo(24 * 0.51766, 1)
    expect(results.transit.utc).toBeCloseTo(24 * 0.81980, 1)
    expect(results.set.utc).toBeCloseTo(24 * 0.12130, 2)
    expect(results.rise.julianDay < results.transit.julianDay).toBeTruthy()
    expect(results.transit.julianDay < results.set.julianDay).toBeTruthy()
  })

  // See AA, pp 103 & 104
  test('accurate Venus on 1988 March 20 at Boston', () => {
    const date = new Date(Date.UTC(1988, 2, 20, 0, 0, 0))
    const jd = juliandays.getJulianDay(date)
    const coordsBoston = { latitude: 42.3333, longitude: -71.0833 }

    const Theta0 = juliandays.getLocalSiderealTime(getJulianDayMidnight(jd), 0) * H2DEG
    expect(Theta0).toBeCloseTo(177.742_08, 2)

    // In TD not UT, see AA p.103
    const venus = [
      { rightAscension: getDecimalValue(2, 42, 43.25) * H2DEG, declination: getDecimalValue(18, 2, 54.4) },
      { rightAscension: getDecimalValue(2, 46, 55.51) * H2DEG, declination: getDecimalValue(18, 26, 27.3) },
      { rightAscension: getDecimalValue(2, 51, 7.69) * H2DEG, declination: getDecimalValue(18, 18, 49, 38.7) }
    ]
    const results = getAccurateRiseTransitSetTimes(jd, venus, coordsBoston, STANDARD_ALTITUDE_STARS, 2)
    expect(results.transit.isCircumpolar).toBeFalsy()
    expect(results.transit.isAboveHorizon).toBeTruthy()
    expect(results.transit.isAboveAltitude).toBeTruthy()

    // Our results don't agree perfectly with AA decimals?
    let { radix, minutes } = getSexagesimalValue(results.rise.utc)
    expect(radix).toEqual(12)
    expect(minutes).toEqual(26); // in AA, it is 25

    ({ radix, minutes } = getSexagesimalValue(results.transit.utc))
    expect(radix).toEqual(19)
    expect(minutes).toEqual(40); // in AA, it is 41

    ({ radix, minutes } = getSexagesimalValue(results.set.utc))
    expect(radix).toEqual(2)
    expect(minutes).toEqual(54)

    expect(results.rise.julianDay < results.transit.julianDay).toBeTruthy()
    expect(results.transit.julianDay < results.set.julianDay).toBeTruthy()
  })

  // See also AA p 103 for inspiration
  test('approximate Venus on 2023 October 14 at UMBC', () => {
    // We should normally use the Topocentric coordinates of Venus, not the Geocentric ones.
    // Yet the topocentric corrections are usually small (< 30").
    // Note, months are 0-based, hence 9 = october.
    const jd0 = juliandays.getJulianDay(new Date(Date.UTC(2023, 9, 14, 0, 0)))
    const umbc = { longitude: -76.70978311382578, latitude: 39.25443537644697 }
    const coords = Venus.getGeocentricEquatorialCoordinates(jd0)
    const results = getRiseTransitSetTimes(jd0, coords, umbc)
    // See https://www.arcsecond.io/observingsites/cac8b50e-5602-467d-a98f-59358ab29077
    const offsetUTC = -18000 // seconds
    const offsetDST = 3600 // seconds
    const offsetHours = (offsetUTC + offsetDST) / 3600
    expect(fmod(results.rise.utc + offsetHours, 24)).toBeCloseTo(3.48, 1)//Originally 3.43?
    expect(fmod(results.transit.utc + offsetHours, 24)).toBeCloseTo(10.0, 1)
    expect(fmod(results.set.utc + offsetHours, 24)).toBeCloseTo(16.52, 1)//Originally 16.47
  })

  // See also AA p 103 for inspiration
  test('accurate Venus on 2023 October 14 at UMBC', () => {
    // We should normally use the Topocentric coordinates of Venus, not the Geocentric ones.
    // Yet the topocentric corrections are usually small (< 30").
    // Note, months are 0-based, hence 9 = october.
    const jd0 = juliandays.getJulianDay(new Date(Date.UTC(2023, 9, 14, 0, 0)))
    const umbc = { longitude: -76.70978311382578, latitude: 39.25443537644697 }
    const coords0 = Venus.getGeocentricEquatorialCoordinates(jd0 - 1)
    const coords1 = Venus.getGeocentricEquatorialCoordinates(jd0)
    const coords2 = Venus.getGeocentricEquatorialCoordinates(jd0 + 1)
    const results = getAccurateRiseTransitSetTimes(jd0, [coords0, coords1, coords2], umbc)
    // See https://www.arcsecond.io/observingsites/cac8b50e-5602-467d-a98f-59358ab29077
    const offsetUTC = -18000 // seconds
    const offsetDST = 3600 // seconds
    const offsetHours = (offsetUTC + offsetDST) / 3600
    expect(fmod(results.rise.utc + offsetHours, 24)).toBeCloseTo(3.48, 1)//Originally 3.43?
    expect(fmod(results.transit.utc + offsetHours, 24)).toBeCloseTo(10.0, 1)
    expect(fmod(results.set.utc + offsetHours, 24)).toBeCloseTo(16.52, 1)//Originally 16.47
  })

  test('arcsecond night slider unit test', () => {
    const night = {
      site: {
        coordinates: { longitude: -72.34, latitude: -29.455, altitude: 2200 },
        address: { time_zone_id: 'America/Santiago', time_zone_utc_offset: -14400 }
      },
      date: '2021-11-02T02:24:37.000Z',
      tracking: false,
      locked: false,
      limits: 'day',
      scale: 1,
      slide: 0.5,
      threshold: 1,
      shift: 0,
      isValid: null,
      getKey: null
    }
    const jd = juliandays.getJulianDay(night.date)
    const jd0 = juliandays.getJulianDayMidnightDynamicalTime(jd)
    const sunCoords = Sun.getApparentGeocentricEquatorialCoordinates(jd0, false)
    const results = getRiseTransitSetTimes(jd, sunCoords, night.site.coordinates, -0.8333, false)
    expect(results.transit.isCircumpolar).toBeFalsy()
    expect(results.transit.isAboveHorizon).toBeTruthy()
    expect(results.transit.isAboveAltitude).toBeTruthy()
    expect(results.rise.julianDay < results.transit.julianDay).toBeTruthy()
    expect(results.transit.julianDay < results.set.julianDay).toBeTruthy()
  })

  test('sun rise transit set', () => {
    const geoCoords = { longitude: -72.34, latitude: -29.455, altitude: 2200 }
    const jd = juliandays.getJulianDay()
    const jd0 = juliandays.getJulianDayMidnightDynamicalTime(jd)
    const sunCoords = Sun.getApparentGeocentricEquatorialCoordinates(jd0, false)
    const resultsManual = getRiseTransitSetTimes(jd, sunCoords, geoCoords, -0.8333, false)
    const resultsSun = Sun.getRiseTransitSet(jd, geoCoords, false)
    expect(resultsManual.transit.isCircumpolar).toEqual(resultsSun.transit.isCircumpolar)
    expect(resultsManual.transit.isAboveHorizon).toEqual(resultsSun.transit.isAboveHorizon)
    expect(resultsManual.transit.isAboveAltitude).toEqual(resultsSun.transit.isAboveAltitude)
    expect(resultsManual.rise.utc).toEqual(resultsSun.rise.utc)
    expect(resultsManual.transit.utc).toEqual(resultsSun.transit.utc)
    expect(resultsManual.set.utc).toEqual(resultsSun.set.utc)
    expect(resultsManual.rise.julianDay).toEqual(resultsSun.rise.julianDay)
    expect(resultsManual.transit.julianDay).toEqual(resultsSun.transit.julianDay)
  })
})
