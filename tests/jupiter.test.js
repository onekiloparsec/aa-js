import { Jupiter } from '../src'

// See AA p.291, Example 42.a, see also SwiftAA
test('check physical details', () => {
  const jd = 2448972.50068

  // const earthDec = Jupiter.getPlanetocentricDeclinationOfTheEarth(jd)
  // expect(earthDec).toBeCloseTo(-2.48)// deg
  //
  // const sunDec = Jupiter.getPlanetocentricDeclinationOfTheSun(jd)
  // expect(sunDec).toBeCloseTo(-2.20)// deg

  // const posAngle = mars.positionAngleOfNorthernRotationPole(jd)
  // expect(posAngle).toBeCloseTo(347.64)// deg
  //
  // const longCentralMeridian = mars.aerographicLongitudeOfCentralMeridian(jd)
  // expect(longCentralMeridian).toBeCloseTo(111.55)// deg
  //
  // const angDefectIllum = mars.angularAmountOfGreatestDefectOfIllumination(jd)
  // expect(angDefectIllum).toBeCloseTo(1.06) // arcsec
  //
  // const posDefectIllum = mars.positionAngleOfGreatestDefectOfIllumination(jd)
  // expect(posDefectIllum).toBeCloseTo(279.91) // deg

  const apparentDiameter = Jupiter.getPolarSemiDiameter(jd)
  expect(apparentDiameter).toBeCloseTo(16.23, 1) // arcsec
})

