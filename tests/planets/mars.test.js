import { Mars } from '@/planets'
import * as juliandays from '@/juliandays'


// See AA p.291, Example 42.a, see also SwiftAA
test('check physical details', () => {
  const UTCDate = new Date(Date.UTC(1992, 10, 9))
  const jd = juliandays.getJulianDay(UTCDate)

  const earthDec = Mars.getPlanetocentricDeclinationOfTheEarth(jd)
  expect(earthDec.toNumber()).toBeCloseTo(12.44)// deg

  const sunDec = Mars.getPlanetocentricDeclinationOfTheSun(jd)
  expect(sunDec.toNumber()).toBeCloseTo(-2.76)// deg

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

  const apparentDiameter = Mars.getEquatorialSemiDiameter(jd)
  expect(apparentDiameter.toNumber()).toBeCloseTo(10.75 / 2) // arcsec
})

