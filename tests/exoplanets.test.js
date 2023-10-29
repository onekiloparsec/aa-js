import * as exoplanets from '@/exoplanets'
import * as constants from '@/constants'

describe('transits of exoplanets', () => {
  it('get transit for H = 0', () => {
    const alt = exoplanets.getTransitAltitude(291.0625 * constants.DEG2H, 0.7461111, -70, -30)
    expect(alt).toBeCloseTo(59.2538889, 5)
  })

  it('get transit for a given transit time', () => {
    const tzeroPrimaryTransit = 2454273.3436
    const alt = exoplanets.getTransitAltitude(291.0625 * constants.DEG2H, 0.7461111, -70, -30, tzeroPrimaryTransit)
    expect(alt).toBeCloseTo(-47.615535, 5)
  })
})
