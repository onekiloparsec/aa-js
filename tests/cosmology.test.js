import cosmology from '../src/cosmology'

test('get age of the Universe (Gyr)', () => {
  expect(cosmology.getUniverseAge(59.6, 0.286, 0.714)).toBeCloseTo(16.021, 3)
  expect(cosmology.getUniverseAge(69.6, 0.286, 0.714)).toBeCloseTo(13.721, 3)
  expect(cosmology.getUniverseAge(79.6, 0.286, 0.714)).toBeCloseTo(11.998, 3)
})

test('get age of the Universe at redshift (Gyr)', () => {
  expect(cosmology.getUniverseAgeAtRedshift(69.6, 0.286, 0.714, 0.1)).toBeCloseTo(12.411, 3)
  expect(cosmology.getUniverseAgeAtRedshift(69.6, 0.286, 0.714, 1)).toBeCloseTo(5.903, 3)
  expect(cosmology.getUniverseAgeAtRedshift(69.6, 0.286, 0.714, 2)).toBeCloseTo(3.316, 3)
  expect(cosmology.getUniverseAgeAtRedshift(69.6, 0.286, 0.714, 3)).toBeCloseTo(2.171, 3)
  expect(cosmology.getUniverseAgeAtRedshift(69.6, 0.286, 0.714, 10)).toBeCloseTo(0.478, 3)
  expect(cosmology.getUniverseAgeAtRedshift(69.6, 0.286, 0.714, 100)).toBeCloseTo(16.633 / 1000, 3)
  expect(cosmology.getUniverseAgeAtRedshift(69.6, 0.286, 0.714, 1000)).toBeCloseTo(0.434 / 1000, 3)
})

test('get light travel time (Gyr)', () => {
  expect(cosmology.getLightTravelTime(69.6, 0.286, 0.714, 0.1)).toBeCloseTo(1.310, 3)
  expect(cosmology.getLightTravelTime(69.6, 0.286, 0.714, 1)).toBeCloseTo(7.817, 3)
  expect(cosmology.getLightTravelTime(69.6, 0.286, 0.714, 2)).toBeCloseTo(10.404, 3)
  expect(cosmology.getLightTravelTime(69.6, 0.286, 0.714, 3)).toBeCloseTo(11.549, 3)
  expect(cosmology.getLightTravelTime(69.6, 0.286, 0.714, 10)).toBeCloseTo(13.243, 3)
  expect(cosmology.getLightTravelTime(69.6, 0.286, 0.714, 100)).toBeCloseTo(13.704, 3)
  expect(cosmology.getLightTravelTime(69.6, 0.286, 0.714, 1000)).toBeCloseTo(13.720, 3)
})

test('get comoving radial distance (Mpc)', () => {
  expect(cosmology.getComovingRadialDistance(69.6, 0.286, 0.714, 0.1)).toBeCloseTo(421.3, 1)
  expect(cosmology.getComovingRadialDistance(69.6, 0.286, 0.714, 1)).toBeCloseTo(3350.7, 1)
  expect(cosmology.getComovingRadialDistance(69.6, 0.286, 0.714, 2)).toBeCloseTo(5273.0, 1)
  expect(cosmology.getComovingRadialDistance(69.6, 0.286, 0.714, 3)).toBeCloseTo(6481.3, 1)
  // The three below aren't exactly the same as in Ned Wright web page results, but he uses a strange rounding implementation.
  expect(cosmology.getComovingRadialDistance(69.6, 0.286, 0.714, 10)).toBeCloseTo(9654.15, 1)
  expect(cosmology.getComovingRadialDistance(69.6, 0.286, 0.714, 100)).toBeCloseTo(12891.42, 1)
  expect(cosmology.getComovingRadialDistance(69.6, 0.286, 0.714, 1000)).toBeCloseTo(13936.88, 1)
})

test('get comoving volume within redshift', () => {
  expect(cosmology.getComovingVolumeWithinRedshift(69.6, 0.286, 0.714, 0.1)).toBeCloseTo(0.313, 3)
  expect(cosmology.getComovingVolumeWithinRedshift(69.6, 0.286, 0.714, 1)).toBeCloseTo(157.569, 3)
  expect(cosmology.getComovingVolumeWithinRedshift(69.6, 0.286, 0.714, 2)).toBeCloseTo(614.103, 3)
  expect(cosmology.getComovingVolumeWithinRedshift(69.6, 0.286, 0.714, 3)).toBeCloseTo(1140.389, 3)
  // The three below aren't exactly the same as in Ned Wright web page results, but he uses a strange rounding implementation.
  expect(cosmology.getComovingVolumeWithinRedshift(69.6, 0.286, 0.714, 10)).toBeCloseTo(3768.718, 3)
  expect(cosmology.getComovingVolumeWithinRedshift(69.6, 0.286, 0.714, 100)).toBeCloseTo(8972.731, 3)
  expect(cosmology.getComovingVolumeWithinRedshift(69.6, 0.286, 0.714, 1000)).toBeCloseTo(11337.247, 3)
})