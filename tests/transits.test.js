import transits from '../src/transits'
import julianday from '../src/julianday'

describe('transits of exoplanets', () => {
  it('get transit for H = 0', () => {
    // Roughly: La Silla (Chile)
    const siteCoordinates = {latitude: -30, longitude: -70}
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

    const alt = transits.getTransitAltitude(targetCoordinates, siteCoordinates)
    expect(alt).toBeCloseTo(59.2538889, 5)
  })

  it('get transit for a given transit time', () => {
    // Roughly: La Silla (Chile)
    const siteCoordinates = {latitude: -30, longitude: -70}
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

    const alt = transits.getTransitAltitude(targetCoordinates, siteCoordinates, tzeroPrimaryTransit)
    expect(alt).toBeCloseTo(-47.615535, 5)
  })
})


test('circumpolar transit', () => {
  const siteCoordinates = {latitude: -70, longitude: 0}
  // Fake very low target
  const targetCoordinates = {
    'system': 'ICRS',
    'right_ascension': 0,
    'right_ascension_units': 'degrees',
    'declination': -89.23,
    'declination_units': 'degrees',
    'epoch': 2451545.0
  }

  const results = transits.getRiseSetTransitJulianDays(julianday.getJulianDay(), targetCoordinates, siteCoordinates)
  expect(results.isCircumpolar).toBeTruthy()
  expect(results.isTransitAboveHorizon).toBeTruthy()
  expect(results.isTransitAboveAltitude).toBeTruthy()
  expect(results.julianDayValueRise).toBeUndefined()
  expect(results.julianDayValueSet).toBeUndefined()
})


test('above horizon transit', () => {
  const siteCoordinates = {latitude: -5, longitude: 0}
  // HD 5980
  const targetCoordinates = {
    'system': 'ICRS',
    'right_ascension': 14.86,
    'right_ascension_units': 'degrees',
    'declination': -72.16,
    'declination_units': 'degrees',
    'epoch': 2451545.0
  }

  const date = new Date(2019, 8, 15)
  const results = transits.getRiseSetTransitJulianDays(julianday.getJulianDay(date), targetCoordinates, siteCoordinates)
  expect(results.isCircumpolar).toBeFalsy()
  expect(results.isTransitAboveHorizon).toBeTruthy()
  expect(results.isTransitAboveAltitude).toBeTruthy()
  expect(results.julianDayValueRise).toBeDefined()
  expect(results.julianDayValueSet).toBeDefined()
  expect(results.julianDayValueRise < results.julianDayValueTransit).toBeTruthy()
  expect(results.julianDayValueTransit < results.julianDayValueSet).toBeTruthy()
  expect(results.julianDayValueTransit - results.julianDayValueRise < 1).toBeTruthy()
  expect(results.julianDayValueSet - results.julianDayValueTransit < 1).toBeTruthy()
})
