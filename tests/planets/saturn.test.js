import { juliandays, Saturn } from '@'

describe('Saturn', () => {
  test('check magnitude', () => {
    const jd = juliandays.getJulianDay(new Date(Date.UTC(1992, 11, 20)))
    // Old formula gives -3.8. No value provided in AA for new formulae.
    expect(Saturn.getMagnitude(jd)).toBeCloseTo(0.74, 1)
  })

  test('check ring system', () => {
    const jd = juliandays.getJulianDay(new Date(Date.UTC(1992, 11, 16)))
    const details = Saturn.getRingSystemDetails(jd)
    expect(details.saturnicentricSunEarthLongitudesDifference).toBeCloseTo(4.198, 2)
    expect(details.northPolePositionAngle).toBeCloseTo(6.741, 2)
  })

  test('ring major axis > 0 and minor axis >= 0', () => {
    const jd = juliandays.getJulianDay(new Date(Date.UTC(1992, 11, 16)))
    const ring = Saturn.getRingSystemDetails(jd)
    expect(ring.majorAxis).toBeGreaterThan(0)
    expect(ring.minorAxis).toBeGreaterThanOrEqual(0)
    expect(ring.minorAxis).toBeLessThanOrEqual(ring.majorAxis)
  })

  test('minor axis is near zero during ring plane crossing (~2025)', () => {
    const jd = juliandays.getJulianDay(new Date(Date.UTC(2025, 2, 1)))
    const ring = Saturn.getRingSystemDetails(jd)
    expect(ring.minorAxis).toBeGreaterThanOrEqual(0)
    expect(ring.minorAxis).toBeLessThan(2)
  })
})
