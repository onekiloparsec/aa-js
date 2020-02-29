import cosmology from '../src/cosmology'

test('get age of the Universe', () => {
  expect(cosmology.getUniverseAge(59.6, 0.286, 0.714)).toBeCloseTo(16.021, 0.001)
  expect(cosmology.getUniverseAge(69.6, 0.286, 0.714)).toBeCloseTo(13.721, 0.001)
  expect(cosmology.getUniverseAge(79.6, 0.286, 0.714)).toBeCloseTo(11.998, 0.001)
})
