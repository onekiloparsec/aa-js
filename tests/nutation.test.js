import { juliandays, nutation } from 'src'

// See AA p.148, Example 22.a
test('check heliocentric coordinates of Venus', () => {
  const jd = juliandays.getJulianDay(new Date(Date.UTC(1987, 3, 10, 0, 0, 0)))
  expect(jd).toEqual(2446895.5)
  expect(nutation.getNutationInLongitude(jd)).toBeCloseTo(-3.788, 3)
  expect(nutation.getNutationInObliquity(jd)).toBeCloseTo(9.443, 3)
  expect(nutation.getMeanObliquityOfEcliptic(jd)).toBeCloseTo(23 + 26 / 60 + 27.407 / 3600, 6)
  expect(nutation.getTrueObliquityOfEcliptic(jd)).toBeCloseTo(23 + 26 / 60 + 36.850 / 3600, 6)
})

