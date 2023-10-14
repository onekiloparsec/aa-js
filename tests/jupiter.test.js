import { Jupiter } from '../src'

test('check physical details', () => {
  const jd = 2448972.50068

  const apparentDiameter = Jupiter.getPolarSemiDiameter(jd)
  expect(apparentDiameter).toBeCloseTo(16.23, 1) // arcsec
})

