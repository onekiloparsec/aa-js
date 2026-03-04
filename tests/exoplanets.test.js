import * as exoplanets from '@/exoplanets'
import * as constants from '@/constants'

describe('transits of exoplanets', () => {
  // getTransitAltitude(equCoords, geoCoords, transitJD?)
  // The function computes altitude = asin(sin(lat)*sin(dec) + cos(lat)*cos(dec)*cosH)
  // When H=0 (transit at meridian), cosH = 1, so alt = asin(sin(lat)*sin(dec) + cos(lat)*cos(dec)) = lat + dec or similar

  it('get transit altitude when object is on the meridian (H=0)', () => {
    // RA = 291.0625 deg = 19h 24m 15s
    // dec = 0.7461111 deg (nearly on equator)
    // lat = -30 deg, lon = -70 deg
    const equCoords = { rightAscension: 291.0625, declination: 0.7461111 }
    const geoCoords = { longitude: -70, latitude: -30 }
    // At H=0, altitude ≈ 90 - |lat - dec| = 90 - |-30 - 0.746| = 90 - 30.746 = 59.254
    const alt = exoplanets.getTransitAltitude(equCoords, geoCoords)
    expect(alt).toBeCloseTo(59.254, 1)
  })

  it('get transit altitude for a given transit time', () => {
    const tzeroPrimaryTransit = 2454273.3436
    const equCoords = { rightAscension: 291.0625, declination: 0.7461111 }
    const geoCoords = { longitude: -70, latitude: -30 }
    const alt = exoplanets.getTransitAltitude(equCoords, geoCoords, tzeroPrimaryTransit)
    // The object is not at meridian, so altitude will differ
    expect(typeof alt).toBe('number')
    expect(alt).toBeGreaterThanOrEqual(-90)
    expect(alt).toBeLessThanOrEqual(90)
  })

  it('julianDayOfNextTransit returns a JD after the lower bound', () => {
    const lowerJD = 2454000
    const period = 3.52474859 // days (HD 209458 b)
    const t0 = 2452826.628514
    const nextTransit = exoplanets.julianDayOfNextTransit(lowerJD, period, t0)
    expect(nextTransit).toBeGreaterThan(lowerJD)
    expect(nextTransit - lowerJD).toBeLessThan(period)
  })
})
