import { juliandays, Jupiter } from '@'
import { transformUTC2TT } from '@/times'

describe('Jupiter getCentralMeridianLongitudes', () => {
  const jd = juliandays.getJulianDay(new Date(Date.UTC(1992, 11, 16)))

  test('returns object with all four longitude fields', () => {
    const cms = Jupiter.getCentralMeridianLongitudes(jd)
    expect(typeof cms.geometricSystemI).toBe('number')
    expect(typeof cms.geometricSystemII).toBe('number')
    expect(typeof cms.apparentSystemI).toBe('number')
    expect(typeof cms.apparentSystemII).toBe('number')
  })

  test('system I and II longitudes are within [0, 360)', () => {
    const cms = Jupiter.getCentralMeridianLongitudes(jd)
    for (const key of ['geometricSystemI', 'geometricSystemII', 'apparentSystemI', 'apparentSystemII']) {
      expect(cms[key]).toBeGreaterThanOrEqual(0)
      expect(cms[key]).toBeLessThan(360)
    }
  })
})

describe('Jupiter planetocentric declinations', () => {
  const jd = juliandays.getJulianDay(new Date(Date.UTC(1992, 11, 16)))

  test('getPlanetocentricDeclinationOfTheSun returns a valid degree', () => {
    const ds = Jupiter.getPlanetocentricDeclinationOfTheSun(jd)
    expect(ds).toBeGreaterThanOrEqual(-90)
    expect(ds).toBeLessThanOrEqual(90)
  })

  test('getPlanetocentricDeclinationOfTheEarth returns a valid degree', () => {
    const de = Jupiter.getPlanetocentricDeclinationOfTheEarth(jd)
    expect(de).toBeGreaterThanOrEqual(-90)
    expect(de).toBeLessThanOrEqual(90)
  })
})

describe('Jupiter', () => {
  test('check apparent diameter', () => {
    const jd = 2448972.50068
    const apparentDiameter = Jupiter.getPolarSemiDiameter(jd)
    expect(apparentDiameter).toBeCloseTo(16.23, 1) // arcsec
  })

  // See AA p295, Ex 43.a
  test('check physical details', () => {
    const UTCDate = new Date(Date.UTC(1992, 11, 16))
    const jd = juliandays.getJulianDay(UTCDate)
    expect(jd).toEqual(2448972.5)
    const jd0 = transformUTC2TT(jd)
    expect(jd0).toEqual(2448972.5006850003)
    // TODO: rewrite Jupiter details based on what is done for Saturn ring system.
  })

  test('check consistency of radius vector', () => {
    const jd = 2448972.50068
    const r1 = Jupiter.getRadiusVector(jd)
    const r2 = Jupiter.getRadiusVector(jd, false)
    expect(r1).toBeCloseTo(r2, 6)
    expect(r1).toBeGreaterThan(4)
    expect(r1).toBeLessThan(6.5)
  })
})

