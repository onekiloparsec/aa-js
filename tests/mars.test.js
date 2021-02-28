import * as mars from '../src/mars'
import * as julianday from '../src/julianday'


// See AA p.291, Example 42.a, see also SwiftAA
test('check physical details', () => {
  const UTCDate = new Date(Date.UTC(1992, 10, 9))
  const jd = julianday.getJulianDay(UTCDate)

  const earthDec = mars.getPlanetocentricDeclinationOfTheEarth(jd)
  expect(earthDec).toBeCloseTo(12.44)// deg

  const sunDec = mars.getPlanetocentricDeclinationOfTheSun(jd)
  expect(sunDec).toBeCloseTo(-2.76)// deg

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

  const apparentDiameter = mars.getApparentDiameter(jd)
  expect(apparentDiameter).toBeCloseTo(10.75) // arcsec
})

