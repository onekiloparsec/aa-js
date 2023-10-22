import * as distances from '@/distances'

describe('distances', () => {
  it('can convert parsecs to parallaxes', () => {
    expect(distances.getParallaxFromParsecs(1).toNumber()).toEqual(1)
    expect(distances.getParallaxFromParsecs(10).toNumber()).toBeCloseTo(0.1, 10)
    expect(distances.getParallaxFromParsecs(100).toNumber()).toBeCloseTo(0.01, 10)
  })

  it('can convert parallaxes to parsecs', () => {
    expect(distances.getParsecsFromParallax(1).toNumber()).toEqual(1)
    expect(distances.getParsecsFromParallax(0.1).toNumber()).toBeCloseTo(10, 9)
    expect(distances.getParsecsFromParallax(0.01).toNumber()).toBeCloseTo(100, 8)
  })

  it('can convert distance modulus to parsecs', () => {
    expect(distances.getParsecsFromDistanceModulus(10).toNumber()).toEqual(1000)
  })

  it('can convert parsecs to distance modulus', () => {
    expect(distances.getDistanceModulusFromParsecs(1000).toNumber()).toEqual(10)
  })
})
