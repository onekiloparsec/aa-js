import { juliandays, Uranus } from '@'

describe('Uranus', () => {
  // Reference JD: 1992 December 20 (from AA examples chapter on outer planets)
  const jd = juliandays.getJulianDay(new Date(Date.UTC(1992, 11, 20)))

  test('radius vector is in expected range (17–21 AU)', () => {
    const r = Uranus.getRadiusVector(jd)
    expect(r).toBeGreaterThan(17)
    expect(r).toBeLessThan(21)
  })

  test('geocentric equatorial coordinates are within valid ranges', () => {
    const coords = Uranus.getApparentGeocentricEquatorialCoordinates(jd)
    expect(coords.rightAscension).toBeGreaterThanOrEqual(0)
    expect(coords.rightAscension).toBeLessThan(360)
    expect(coords.declination).toBeGreaterThanOrEqual(-90)
    expect(coords.declination).toBeLessThanOrEqual(90)
  })

  test('magnitude is in expected range for Uranus (~+5.5 to +6.0)', () => {
    const mag = Uranus.getMagnitude(jd)
    expect(mag).toBeGreaterThan(4)
    expect(mag).toBeLessThan(8)
  })

  test('illuminated fraction is close to 1 (outer planet)', () => {
    const f = Uranus.getIlluminatedFraction(jd)
    expect(f).toBeGreaterThan(0.99)
    expect(f).toBeLessThanOrEqual(1)
  })

  test('equatorial semi-diameter is positive and small (arcsec)', () => {
    const d = Uranus.getEquatorialSemiDiameter(jd)
    expect(d).toBeGreaterThan(1)
    expect(d).toBeLessThan(3)
  })

  test('rise/transit/set ordering is preserved', () => {
    const geoCoords = { longitude: 0, latitude: 48 }
    const rts = Uranus.getRiseTransitSet(jd, geoCoords)
    if (rts.rise.julianDay !== undefined && rts.set.julianDay !== undefined) {
      expect(rts.rise.julianDay).toBeLessThan(rts.transit.julianDay)
      expect(rts.transit.julianDay).toBeLessThan(rts.set.julianDay)
    }
  })

  test('geocentric distance is greater than Earth radius vector', () => {
    const delta = Uranus.getGeocentricDistance(jd)
    expect(delta).toBeGreaterThan(15)
    expect(delta).toBeLessThan(22)
  })
})
