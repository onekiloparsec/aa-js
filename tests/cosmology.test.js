import cosmology from '../src/cosmology'

test('get age of the Universe', () => {
  expect(cosmology.getUniverseAge(59.6, 0.286, 0.714)).toBeCloseTo(16.021, 0.0001)
  expect(cosmology.getUniverseAge(69.6, 0.286, 0.714)).toBeCloseTo(13.721, 0.0001)
  expect(cosmology.getUniverseAge(79.6, 0.286, 0.714)).toBeCloseTo(11.998, 0.0001)
})

test('get age of the Universe at redshift', () => {
  expect(cosmology.getUniverseAgeAtRedshift(69.6, 0.286, 0.714, 0.1)).toBeCloseTo(12.411, 0.0001)
  expect(cosmology.getUniverseAgeAtRedshift(69.6, 0.286, 0.714, 1)).toBeCloseTo(5.903, 0.0001)
  expect(cosmology.getUniverseAgeAtRedshift(69.6, 0.286, 0.714, 2)).toBeCloseTo(3.316, 0.0001)
  expect(cosmology.getUniverseAgeAtRedshift(69.6, 0.286, 0.714, 3)).toBeCloseTo(2.171, 0.0001)
  expect(cosmology.getUniverseAgeAtRedshift(69.6, 0.286, 0.714, 10)).toBeCloseTo(0.478, 0.0001)
  expect(cosmology.getUniverseAgeAtRedshift(69.6, 0.286, 0.714, 100)).toBeCloseTo(16.633 / 1000, 0.0001)
  expect(cosmology.getUniverseAgeAtRedshift(69.6, 0.286, 0.714, 1000)).toBeCloseTo(0.434 / 1000, 0.0001)
})

test('get light travel time', () => {
  expect(cosmology.getLightTravelTime(69.6, 0.286, 0.714, 0.1)).toBeCloseTo(1.310, 0.0001)
  expect(cosmology.getLightTravelTime(69.6, 0.286, 0.714, 1)).toBeCloseTo(7.817, 0.0001)
  expect(cosmology.getLightTravelTime(69.6, 0.286, 0.714, 2)).toBeCloseTo(10.404, 0.0001)
  expect(cosmology.getLightTravelTime(69.6, 0.286, 0.714, 3)).toBeCloseTo(11.549, 0.0001)
  expect(cosmology.getLightTravelTime(69.6, 0.286, 0.714, 10)).toBeCloseTo(13.243, 0.0001)
  expect(cosmology.getLightTravelTime(69.6, 0.286, 0.714, 100)).toBeCloseTo(13.704, 0.0001)
  expect(cosmology.getLightTravelTime(69.6, 0.286, 0.714, 1000)).toBeCloseTo(13.720, 0.0001)
})