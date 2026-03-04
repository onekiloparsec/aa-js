import { juliandays, Neptune } from '@'

describe('Neptune', () => {
  // Reference JD: 1992 December 20
  const jd = juliandays.getJulianDay(new Date(Date.UTC(1992, 11, 20)))

  test('radius vector is in expected range (29–31 AU)', () => {
    const r = Neptune.getRadiusVector(jd)
    expect(r).toBeGreaterThan(29)
    expect(r).toBeLessThan(31)
  })

  test('geocentric equatorial coordinates are within valid ranges', () => {
    const coords = Neptune.getApparentGeocentricEquatorialCoordinates(jd)
    expect(coords.rightAscension).toBeGreaterThanOrEqual(0)
    expect(coords.rightAscension).toBeLessThan(360)
    expect(coords.declination).toBeGreaterThanOrEqual(-90)
    expect(coords.declination).toBeLessThanOrEqual(90)
  })

  test('magnitude is in expected range for Neptune (~+7.8 to +8.2)', () => {
    const mag = Neptune.getMagnitude(jd)
    expect(mag).toBeGreaterThan(6)
    expect(mag).toBeLessThan(10)
  })

  test('illuminated fraction is essentially 1 (very distant)', () => {
    const f = Neptune.getIlluminatedFraction(jd)
    expect(f).toBeGreaterThan(0.999)
    expect(f).toBeLessThanOrEqual(1)
  })

  test('equatorial semi-diameter is positive and small (arcsec)', () => {
    const d = Neptune.getEquatorialSemiDiameter(jd)
    expect(d).toBeGreaterThan(0.8)
    expect(d).toBeLessThan(2)
  })

  test('geocentric distance is in valid range', () => {
    const delta = Neptune.getGeocentricDistance(jd)
    expect(delta).toBeGreaterThan(28)
    expect(delta).toBeLessThan(32)
  })

  test('rise/transit/set ordering is preserved', () => {
    const geoCoords = { longitude: 0, latitude: 48 }
    const rts = Neptune.getRiseTransitSet(jd, geoCoords)
    if (rts.rise.julianDay !== undefined && rts.set.julianDay !== undefined) {
      expect(rts.rise.julianDay).toBeLessThan(rts.transit.julianDay)
      expect(rts.transit.julianDay).toBeLessThan(rts.set.julianDay)
    }
  })
})
