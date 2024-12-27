import * as distances from '@/js/distances'

describe('distances', () => {
  it('can convert parsecs to parallaxes', () => {
    expect(distances.getParallaxFromParsecs(1)).toEqual(1)
    expect(distances.getParallaxFromParsecs(10)).toBeCloseTo(0.1, 10)
    expect(distances.getParallaxFromParsecs(100)).toBeCloseTo(0.01, 10)
  })

  it('can convert parallaxes to parsecs', () => {
    expect(distances.getParsecsFromParallax(1)).toEqual(1)
    expect(distances.getParsecsFromParallax(0.1)).toBeCloseTo(10, 9)
    expect(distances.getParsecsFromParallax(0.01)).toBeCloseTo(100, 8)
  })

  it('can convert distance modulus to parsecs', () => {
    expect(distances.getParsecsFromDistanceModulus(10)).toEqual(1000)
  })

  it('can convert parsecs to distance modulus', () => {
    expect(distances.getDistanceModulusFromParsecs(1000)).toEqual(10)
  })
})
