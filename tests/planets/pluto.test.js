import { juliandays, Pluto } from '@'

describe('Pluto', () => {
  // Reference JD: 1992 April 12
  const jd = juliandays.getJulianDay(new Date(Date.UTC(1992, 3, 12)))

  test('radius vector is in expected range (29–50 AU, eccentric orbit)', () => {
    const r = Pluto.getRadiusVector(jd)
    expect(r).toBeGreaterThan(28)
    expect(r).toBeLessThan(50)
  })

  test('geocentric ecliptic coordinates are in valid ranges', () => {
    const coords = Pluto.getGeocentricEclipticCoordinates(jd)
    expect(coords.longitude).toBeGreaterThanOrEqual(0)
    expect(coords.longitude).toBeLessThan(360)
    expect(coords.latitude).toBeGreaterThanOrEqual(-90)
    expect(coords.latitude).toBeLessThanOrEqual(90)
  })

  test('geocentric equatorial coordinates are in valid ranges', () => {
    const coords = Pluto.getApparentGeocentricEquatorialCoordinates(jd)
    expect(coords.rightAscension).toBeGreaterThanOrEqual(0)
    expect(coords.rightAscension).toBeLessThan(360)
    expect(coords.declination).toBeGreaterThanOrEqual(-90)
    expect(coords.declination).toBeLessThanOrEqual(90)
  })

  test('geocentric distance is in expected range (~29-50 AU)', () => {
    const delta = Pluto.getGeocentricDistance(jd)
    expect(delta).toBeGreaterThan(28)
    expect(delta).toBeLessThan(52)
  })

  test('magnitude is in expected range for Pluto (~+13 to +16)', () => {
    const mag = Pluto.getMagnitude(jd)
    expect(mag).toBeGreaterThan(12)
    expect(mag).toBeLessThan(18)
  })

  test('illuminated fraction is close to 1', () => {
    const f = Pluto.getIlluminatedFraction(jd)
    expect(f).toBeGreaterThan(0.999)
    expect(f).toBeLessThanOrEqual(1)
  })

  test('equatorial semi-diameter is very small (< 0.2 arcsec)', () => {
    const d = Pluto.getEquatorialSemiDiameter(jd)
    expect(d).toBeGreaterThan(0)
    expect(d).toBeLessThan(0.2)
  })

  test('rise/transit/set ordering is preserved', () => {
    const geoCoords = { longitude: 0, latitude: 48 }
    const rts = Pluto.getRiseTransitSet(jd, geoCoords)
    if (rts.rise.julianDay !== undefined && rts.set.julianDay !== undefined) {
      expect(rts.rise.julianDay).toBeLessThan(rts.transit.julianDay)
      expect(rts.transit.julianDay).toBeLessThan(rts.set.julianDay)
    }
  })
})
