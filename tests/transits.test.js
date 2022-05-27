import { DEG2H, julianDay, transits } from '../src/'

describe('transits of exoplanets', () => {
  it('get transit for H = 0', () => {
    // Roughly: La Silla (Chile)
    // const siteCoordinates = { latitude: -30, longitude: -70 }
    // // Corot 10 b
    // const targetCoordinates = {
    //   'system': 'ICRS',
    //   'right_ascension': 291.0625,
    //   'right_ascension_units': 'degrees',
    //   'declination': 0.7461111,
    //   'declination_units': 'degrees',
    //   'epoch': 2451545.0
    // }
    // const tzero_primary_transit = 2454273.3436

    const alt = transits.getTransitAltitude(291.0625 * DEG2H, 0.7461111, -70, -30)
    expect(alt).toBeCloseTo(59.2538889, 5)
  })

  it('get transit for a given transit time', () => {
    // Roughly: La Silla (Chile)
    // const siteCoordinates = { latitude: -30, longitude: -70 }
    // // Corot 10 b
    // const targetCoordinates = {
    //   'system': 'ICRS',
    //   'right_ascension': 291.0625,
    //   'right_ascension_units': 'degrees',
    //   'declination': 0.7461111,
    //   'declination_units': 'degrees',
    //   'epoch': 2451545.0
    // }
    const tzeroPrimaryTransit = 2454273.3436
    const alt = transits.getTransitAltitude(291.0625 * DEG2H, 0.7461111, -70, -30, tzeroPrimaryTransit)
    expect(alt).toBeCloseTo(-47.615535, 5)
  })
})


test('circumpolar transit', () => {
  // const siteCoordinates = { latitude: -70, longitude: 0 }
  // // Fake very low target
  // const targetCoordinates = {
  //   'system': 'ICRS',
  //   'right_ascension': 0,
  //   'right_ascension_units': 'degrees',
  //   'declination': -89.23,
  //   'declination_units': 'degrees',
  //   'epoch': 2451545.0
  // }

  const results = transits.getRiseSetTransitTimes(julianDay.getJulianDay(), 0, -89.23, 0, -70)
  expect(results.transit.isCircumpolar).toBeTruthy()
  expect(results.transit.isAboveHorizon).toBeTruthy()
  expect(results.transit.isAboveAltitude).toBeTruthy()
  expect(results.rise.utc).toBeUndefined()
  expect(results.set.utc).toBeUndefined()
})


// See AA p 103
test('approximate Venus on 1988 March 20 at Boston', () => {
  // const siteCoordinates = { latitude: 42.3333, longitude: -71.0833 }
  // const targetCoordinates = {
  //   'system': 'ICRS',
  //   'right_ascension': 41.73129,
  //   'right_ascension_units': 'degrees',
  //   'declination': 18.44092,
  //   'declination_units': 'degrees',
  //   'epoch': 2451545.0
  // }

  const date = new Date(Date.UTC(1988, 2, 20))
  const results = transits.getRiseSetTransitTimes(julianDay.getJulianDay(date), 41.73129 * DEG2H, 18.44092, -71.0833, 42.3333)

  expect(results.transit.isCircumpolar).toBeFalsy()
  expect(results.transit.isAboveHorizon).toBeTruthy()
  expect(results.transit.isAboveAltitude).toBeTruthy()
  expect(results.rise.utc).toBeCloseTo(12.43608, 0.000001)
  expect(results.transit.utc).toBeCloseTo(19.6716, 0.000001)
  expect(results.set.utc).toBeCloseTo(2.90712, 0.000001)
  expect(results.rise.julianDay < results.transit.julianDay).toBeTruthy()
  expect(results.transit.julianDay < results.set.julianDay).toBeTruthy()
})
