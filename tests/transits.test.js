import transits from '../src/transits'

test('get transit for H = 0', () => {
  // Roughly: La Silla
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

  const alt = transits.getTransitAltitude(targetCoordinates, siteCoordinates)
  expect(alt).toBeCloseTo(59.2538889, 5)
})

test('get transit for a given transit time', () => {
  // Roughly: La Silla
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

  const alt = transits.getTransitAltitude(targetCoordinates, siteCoordinates, tzeroPrimaryTransit)
  expect(alt).toBeCloseTo(-47.615535, 5)
})
