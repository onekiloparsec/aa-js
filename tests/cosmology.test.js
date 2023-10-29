import * as cosmology from '@/cosmology'

describe('cosmology', () => {
  test('get age of the Universe (Gyr)', () => {
    expect(cosmology.getUniverseAge(59.6, 0.286, 0.714).toNumber()).toBeCloseTo(16.021, 3)
    expect(cosmology.getUniverseAge(69.6, 0.286, 0.714).toNumber()).toBeCloseTo(13.721, 3)
    expect(cosmology.getUniverseAge(79.6, 0.286, 0.714).toNumber()).toBeCloseTo(11.998, 3)
  })

  test('get age of the Universe at redshift (Gyr)', () => {
    expect(cosmology.getUniverseAgeAtRedshift(69.6, 0.286, 0.714, 0).toNumber()).toBeCloseTo(13.721, 3)
    expect(cosmology.getUniverseAgeAtRedshift(69.6, 0.286, 0.714, 0.1).toNumber()).toBeCloseTo(12.411, 3)
    expect(cosmology.getUniverseAgeAtRedshift(69.6, 0.286, 0.714, 1).toNumber()).toBeCloseTo(5.903, 3)
    expect(cosmology.getUniverseAgeAtRedshift(69.6, 0.286, 0.714, 2).toNumber()).toBeCloseTo(3.316, 3)
    expect(cosmology.getUniverseAgeAtRedshift(69.6, 0.286, 0.714, 3).toNumber()).toBeCloseTo(2.171, 3)
    expect(cosmology.getUniverseAgeAtRedshift(69.6, 0.286, 0.714, 10).toNumber()).toBeCloseTo(0.478, 3)
    expect(cosmology.getUniverseAgeAtRedshift(69.6, 0.286, 0.714, 100).toNumber()).toBeCloseTo(16.633 / 1000, 3)
    expect(cosmology.getUniverseAgeAtRedshift(69.6, 0.286, 0.714, 1000).toNumber()).toBeCloseTo(0.434 / 1000, 3)
  })

  test('get light travel time (Gyr)', () => {
    expect(cosmology.getLightTravelTime(69.6, 0.286, 0.714, 0).toNumber()).toEqual(0)
    expect(cosmology.getLightTravelTime(69.6, 0.286, 0.714, 0.1).toNumber()).toBeCloseTo(1.310, 3)
    expect(cosmology.getLightTravelTime(69.6, 0.286, 0.714, 1).toNumber()).toBeCloseTo(7.817, 3)
    expect(cosmology.getLightTravelTime(69.6, 0.286, 0.714, 2).toNumber()).toBeCloseTo(10.404, 3)
    expect(cosmology.getLightTravelTime(69.6, 0.286, 0.714, 3).toNumber()).toBeCloseTo(11.549, 3)
    expect(cosmology.getLightTravelTime(69.6, 0.286, 0.714, 10).toNumber()).toBeCloseTo(13.243, 3)
    expect(cosmology.getLightTravelTime(69.6, 0.286, 0.714, 100).toNumber()).toBeCloseTo(13.704, 3)
    expect(cosmology.getLightTravelTime(69.6, 0.286, 0.714, 1000).toNumber()).toBeCloseTo(13.720, 3)
  })

  test('get comoving radial distance (Mpc)', () => {
    expect(cosmology.getComovingRadialDistance(69.6, 0.286, 0.714, 0).toNumber()).toEqual(0)
    expect(cosmology.getComovingRadialDistance(69.6, 0.286, 0.714, 0.1).toNumber()).toBeCloseTo(421.3, 1)
    expect(cosmology.getComovingRadialDistance(69.6, 0.286, 0.714, 1).toNumber()).toBeCloseTo(3350.7, 1)
    expect(cosmology.getComovingRadialDistance(69.6, 0.286, 0.714, 2).toNumber()).toBeCloseTo(5273.0, 1)
    expect(cosmology.getComovingRadialDistance(69.6, 0.286, 0.714, 3).toNumber()).toBeCloseTo(6481.3, 1)
    // The three below aren't exactly the same as in Ned Wright web page results, but he uses a strange rounding implementation.
    expect(cosmology.getComovingRadialDistance(69.6, 0.286, 0.714, 10).toNumber()).toBeCloseTo(9654.15, 1)
    expect(cosmology.getComovingRadialDistance(69.6, 0.286, 0.714, 100).toNumber()).toBeCloseTo(12891.42, 1)
    expect(cosmology.getComovingRadialDistance(69.6, 0.286, 0.714, 1000).toNumber()).toBeCloseTo(13936.88, 1)
  })

  test('get comoving volume within redshift', () => {
    expect(cosmology.getComovingVolumeWithinRedshift(69.6, 0.286, 0.714, 0).toNumber()).toEqual(0)
    expect(cosmology.getComovingVolumeWithinRedshift(69.6, 0.286, 0.714, 0.1).toNumber()).toBeCloseTo(0.313, 3)
    expect(cosmology.getComovingVolumeWithinRedshift(69.6, 0.286, 0.714, 1).toNumber()).toBeCloseTo(157.569, 3)
    expect(cosmology.getComovingVolumeWithinRedshift(69.6, 0.286, 0.714, 2).toNumber()).toBeCloseTo(614.103, 3)
    expect(cosmology.getComovingVolumeWithinRedshift(69.6, 0.286, 0.714, 3).toNumber()).toBeCloseTo(1140.389, 3)
    // The three below aren't exactly the same as in Ned Wright web page results, but he uses a strange rounding implementation.
    expect(cosmology.getComovingVolumeWithinRedshift(69.6, 0.286, 0.714, 10).toNumber()).toBeCloseTo(3768.718, 3)
    expect(cosmology.getComovingVolumeWithinRedshift(69.6, 0.286, 0.714, 100).toNumber()).toBeCloseTo(8972.731, 3)
    expect(cosmology.getComovingVolumeWithinRedshift(69.6, 0.286, 0.714, 1000).toNumber()).toBeCloseTo(11337.247, 3)
  })

  test('get angular size distance (Mpc)', () => {
    expect(cosmology.getAngularSizeDistance(69.6, 0.286, 0.714, 0).toNumber()).toEqual(0)
    expect(cosmology.getAngularSizeDistance(69.6, 0.286, 0.714, 0.1).toNumber()).toBeCloseTo(383.0, 1)
    expect(cosmology.getAngularSizeDistance(69.6, 0.286, 0.714, 1).toNumber()).toBeCloseTo(1675.3, 1)
    expect(cosmology.getAngularSizeDistance(69.6, 0.286, 0.714, 2).toNumber()).toBeCloseTo(1757.6, 1)
    expect(cosmology.getAngularSizeDistance(69.6, 0.286, 0.714, 3).toNumber()).toBeCloseTo(1620.3, 1)
    expect(cosmology.getAngularSizeDistance(69.6, 0.286, 0.714, 10).toNumber()).toBeCloseTo(877.6, 1)
    expect(cosmology.getAngularSizeDistance(69.6, 0.286, 0.714, 100).toNumber()).toBeCloseTo(127.6, 1)
    expect(cosmology.getAngularSizeDistance(69.6, 0.286, 0.714, 1000).toNumber()).toBeCloseTo(13.92, 2)
  })

  test('get angular size scale (kpc/")', () => {
    expect(cosmology.getAngularSizeScale(69.6, 0.286, 0.714, 0).toNumber()).toEqual(0)
    expect(cosmology.getAngularSizeScale(69.6, 0.286, 0.714, 0.1).toNumber()).toBeCloseTo(1.857, 1)
    expect(cosmology.getAngularSizeScale(69.6, 0.286, 0.714, 1).toNumber()).toBeCloseTo(8.122, 1)
    expect(cosmology.getAngularSizeScale(69.6, 0.286, 0.714, 2).toNumber()).toBeCloseTo(8.521, 1)
    expect(cosmology.getAngularSizeScale(69.6, 0.286, 0.714, 3).toNumber()).toBeCloseTo(7.855, 1)
    expect(cosmology.getAngularSizeScale(69.6, 0.286, 0.714, 10).toNumber()).toBeCloseTo(4.255, 1)
    expect(cosmology.getAngularSizeScale(69.6, 0.286, 0.714, 100).toNumber()).toBeCloseTo(0.619, 1)
    expect(cosmology.getAngularSizeScale(69.6, 0.286, 0.714, 1000).toNumber()).toBeCloseTo(0.067, 2)
  })

  test('get luminosity distance (Mpc)', () => {
    expect(cosmology.getLuminosityDistance(69.6, 0.286, 0.714, 0).toNumber()).toEqual(0)
    expect(cosmology.getLuminosityDistance(69.6, 0.286, 0.714, 0.1).toNumber()).toBeCloseTo(463.4, 1)
    expect(cosmology.getLuminosityDistance(69.6, 0.286, 0.714, 1).toNumber()).toBeCloseTo(6701.2, 1)
    expect(cosmology.getLuminosityDistance(69.6, 0.286, 0.714, 2).toNumber()).toBeCloseTo(15818.5, 1)
    expect(cosmology.getLuminosityDistance(69.6, 0.286, 0.714, 3).toNumber()).toBeCloseTo(25924.3, 1)
    expect(cosmology.getLuminosityDistance(69.6, 0.286, 0.714, 10).toNumber()).toBeCloseTo(106188.0, 1)
    // The two below aren't exactly the same as in Ned Wright web page results, but he uses a strange rounding implementation.
    expect(cosmology.getLuminosityDistance(69.6, 0.286, 0.714, 100).toNumber()).toBeCloseTo(1301867, 0)
    expect(cosmology.getLuminosityDistance(69.6, 0.286, 0.714, 1000).toNumber()).toBeCloseTo(13948729, 0)
  })
})
