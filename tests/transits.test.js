import transits from '../src/transits'
import julianday from '../src/julianday'

describe('transits of exoplanets', () => {
  it('get transit for H = 0', () => {
    // Roughly: La Silla (Chile)
    const siteCoordinates = { latitude: -30, longitude: -70 }
    // Corot 10 b
    const targetCoordinates = {
      'system': 'ICRS',
      'right_ascension': 291.0625,
      'right_ascension_units': 'degrees',
      'declination': 0.7461111,
      'declination_units': 'degrees',
      'epoch': 2451545.0
    }
    // const tzero_primary_transit = 2454273.3436

    const alt = transits.transitAltitude(targetCoordinates, siteCoordinates)
    expect(alt).toBeCloseTo(59.2538889, 5)
  })

  it('get transit for a given transit time', () => {
    // Roughly: La Silla (Chile)
    const siteCoordinates = { latitude: -30, longitude: -70 }
    // Corot 10 b
    const targetCoordinates = {
      'system': 'ICRS',
      'right_ascension': 291.0625,
      'right_ascension_units': 'degrees',
      'declination': 0.7461111,
      'declination_units': 'degrees',
      'epoch': 2451545.0
    }
    const tzeroPrimaryTransit = 2454273.3436

    const alt = transits.transitAltitude(targetCoordinates, siteCoordinates, tzeroPrimaryTransit)
    expect(alt).toBeCloseTo(-47.615535, 5)
  })
})


test('circumpolar transit', () => {
  const siteCoordinates = { latitude: -70, longitude: 0 }
  // Fake very low target
  const targetCoordinates = {
    'system': 'ICRS',
    'right_ascension': 0,
    'right_ascension_units': 'degrees',
    'declination': -89.23,
    'declination_units': 'degrees',
    'epoch': 2451545.0
  }

  const results = transits.riseSetTransitJulianDays(julianday.julianDay(), targetCoordinates, siteCoordinates)
  expect(results.isCircumpolar).toBeTruthy()
  expect(results.isTransitAboveHorizon).toBeTruthy()
  expect(results.isTransitAboveAltitude).toBeTruthy()
  expect(results.utcRise).toBeUndefined()
  expect(results.utcSet).toBeUndefined()
})


// See AA p 103
test('approximate Venus on 1988 March 20 at Boston', () => {
  const siteCoordinates = { latitude: 42.3333, longitude: -71.0833 }

  const targetCoordinates = {
    'system': 'ICRS',
    'right_ascension': 41.73129,
    'right_ascension_units': 'degrees',
    'declination': 18.44092,
    'declination_units': 'degrees',
    'epoch': 2451545.0
  }

  const date = new Date(Date.UTC(1988, 2, 20))
  const results = transits.riseSetTransitJulianDays(julianday.julianDay(date), targetCoordinates, siteCoordinates)

  expect(results.isCircumpolar).toBeFalsy()
  expect(results.isTransitAboveHorizon).toBeTruthy()
  expect(results.isTransitAboveAltitude).toBeTruthy()
  expect(results.utcRise).toBeCloseTo(12.43608, 0.000001)
  expect(results.utcTransit).toBeCloseTo(19.6716, 0.000001)
  expect(results.utcSet).toBeCloseTo(2.90712, 0.000001)
  expect(results.julianDayRise < results.julianDayTransit).toBeTruthy()
  expect(results.julianDayTransit < results.julianDaySet).toBeTruthy()
})
