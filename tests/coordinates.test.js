import { getJulianDay } from '@/juliandays'
import { H2DEG } from '@/constants'
import { getFlatteningCorrections } from '@/earth/coordinates'
import { getDecimalValue } from '@/sexagesimal'
import {
  getDeclinationFromEcliptic,
  getEclipticLatitudeFromEquatorial,
  getEclipticLongitudeFromEquatorial,
  getGreatCircleAngularDistance,
  getParallacticAngle,
  getRightAscensionFromEcliptic,
  precessEquatorialCoordinates,
  transformEquatorialToTopocentric
} from '@/coordinates'
import { Earth } from '@/earth'
import { Mars } from '@/planets/mars'

describe('coordinates', () => {
  test('parallactic angle before meridian', () => {
    const utcDate = new Date(Date.UTC(2017, 5, 14, 2, 0, 0.0))
    const jd = getJulianDay(utcDate)

    // gro_j1655_40, see below
    const ra = getDecimalValue(16, 54, 0.14) // in hours
    const dec = getDecimalValue(-39, 50, 44.9)
    const equCoords = { rightAscension: ra * H2DEG, declination: dec }

    // http://www.ls.eso.org/lasilla/Telescopes/2p2/D1p5M/
    const lng = getDecimalValue(-70, 44, 7.662) // east-positive
    const lat = getDecimalValue(-29, 15, 14.235)
    const geoCoords = { longitude: lng, latitude: lat }

    // See https://www.eso.org/sci/observing/tools/calendar/ParAng.html to check values.
    const refAngle = -78.1

    expect(getParallacticAngle(jd, equCoords, geoCoords)).toBeCloseTo(refAngle, 0)
    expect(getParallacticAngle(jd, equCoords, geoCoords, false)).toBeCloseTo(refAngle, 0)
  })

  test('parallactic angle after meridian', () => {
    const utcDate = new Date(Date.UTC(2017, 5, 14, 6, 0, 0.0))
    let jd = getJulianDay(utcDate)

    // gro_j1655_40, see below
    let ra = getDecimalValue(16, 54, 0.14) // in hours
    let dec = getDecimalValue(-39, 50, 44.9)
    const equCoords = { rightAscension: ra * H2DEG, declination: dec }

    // http://www.ls.eso.org/lasilla/Telescopes/2p2/D1p5M/
    let lng = getDecimalValue(-70, 44, 7.662) // east-positive
    let lat = getDecimalValue(-29, 15, 14.235)
    const geoCoords = { longitude: lng, latitude: lat }

    // Slightly adjusted values. Ref might not be 100% accurate...
    // Looking for improved reference values...
    let refAngle = 74.4

    expect(getParallacticAngle(jd, equCoords, geoCoords)).toBeCloseTo(refAngle, 0)
    expect(getParallacticAngle(jd, equCoords, geoCoords, false)).toBeCloseTo(refAngle, 0)
  })

  // See AA p95, Ex 13.a
  test('transform equatorial to ecliptic', () => {
    const pollux = {
      rightAscension: getDecimalValue(7, 45, 18.946) * H2DEG,
      declination: getDecimalValue(28, 1, 34.26)
    }
    const lambda = getEclipticLongitudeFromEquatorial(pollux)
    expect(lambda).toBeCloseTo(113.215629, 6)
    const beta = getEclipticLatitudeFromEquatorial(pollux)
    expect(beta).toBeCloseTo(6.684170, 6)
  })


  // See AA p95, Ex 13.a
  test('transform ecliptic to equatorial', () => {
    const pollux = {
      rightAscension: getDecimalValue(7, 45, 18.946) * H2DEG,
      declination: getDecimalValue(28, 1, 34.26)
    }
    const ecliptic = {
      longitude: 113.215630,
      latitude: 6.684170
    }
    const alpha = getRightAscensionFromEcliptic(ecliptic)
    expect(alpha).toBeCloseTo(pollux.rightAscension, 5)
    const delta = getDeclinationFromEcliptic(ecliptic)
    expect(delta).toBeCloseTo(pollux.declination, 6)
  })

  //See AA p.280-281, Ex 40.a
  test('transformation from equatorial to topocentric', () => {
    const date = new Date(Date.UTC(2003, 7, 28, 3, 17, 0))
    const jd = getJulianDay(date)
    const palomar = {
      longitude: getDecimalValue(-7, 47, 27) * H2DEG,
      latitude: 33.356111,
      height: 1706
    }
    const corrections = getFlatteningCorrections(palomar.height, palomar.latitude)
    expect(corrections.rhocosphi).toBeCloseTo(0.836339, 6)
    expect(corrections.rhosinphi).toBeCloseTo(0.546861, 6)

    const coordsAlt = Mars.getGeocentricEquatorialCoordinates(jd)
    expect(coordsAlt.rightAscension).toBeCloseTo(339.530208, 2)
    expect(coordsAlt.declination).toBeCloseTo(-15.771083, 3)

    const coords = {
      rightAscension: getDecimalValue(22, 38, 7.25) * H2DEG,
      declination: getDecimalValue(-15, 46, 15.9)
    }
    const distance = Mars.getGeocentricDistance(jd)
    expect(distance).toBeCloseTo(0.37276, 4)

    const topoCoords = transformEquatorialToTopocentric(jd, coords, distance, palomar)
    expect(topoCoords.rightAscension).toBeCloseTo(getDecimalValue(22, 38, 8.54) * H2DEG, 4)
    expect(topoCoords.declination).toBeCloseTo(getDecimalValue(-15, 46, 30), 4)
  })

  test('topocentric Moon RA differs from geocentric (Moon parallax ~1°)', () => {
    const jd = getJulianDay(new Date(Date.UTC(2003, 7, 28)))
    const geocentric = Earth.Moon.getApparentGeocentricEquatorialCoordinates(jd)
    const moonDist = Earth.Moon.getRadiusVectorInKilometer(jd) / 149597870.7 // km to AU
    const geoCoords = { longitude: -70, latitude: -29.25, height: 2400 }
    const topo = transformEquatorialToTopocentric(jd, geocentric, moonDist, geoCoords)
    expect(Math.abs(topo.rightAscension - geocentric.rightAscension)).toBeGreaterThan(0)
    expect(Math.abs(topo.rightAscension - geocentric.rightAscension)).toBeLessThan(2)
  })

  test('test angular distance', () => {
    const alphaBoo = {
      rightAscension: getDecimalValue(14, 15, 39.7) * H2DEG,
      declination: getDecimalValue(19, 10, 57)
    }
    const alphaVir = {
      rightAscension: getDecimalValue(13, 25, 11.6) * H2DEG,
      declination: getDecimalValue(-11, 9, 41)
    }
    expect(getGreatCircleAngularDistance(alphaBoo, alphaVir)).toBeCloseTo(32.7930, 4)
  })
})

describe('precession', () => {
  test('precession over 50 years moves Polaris RA by a detectable amount', () => {
    const coords = { rightAscension: 37.95, declination: 89.264 }
    const jd2000 = getJulianDay(new Date(Date.UTC(2000, 0, 1)))
    const jd2050 = getJulianDay(new Date(Date.UTC(2050, 0, 1)))
    const precessed = precessEquatorialCoordinates(coords, jd2000, jd2050)
    expect(precessed.rightAscension).not.toBeCloseTo(coords.rightAscension, 0)
  })

  test('precession applied then reversed recovers original coordinates', () => {
    const coords = { rightAscension: 180, declination: 45 }
    const jd2000 = getJulianDay(new Date(Date.UTC(2000, 0, 1)))
    const jd2050 = getJulianDay(new Date(Date.UTC(2050, 0, 1)))
    const forward = precessEquatorialCoordinates(coords, jd2000, jd2050)
    const back = precessEquatorialCoordinates(forward, jd2050, jd2000)
    const normalizeRA = (ra) => ((ra % 360) + 360) % 360
    expect(normalizeRA(back.rightAscension)).toBeCloseTo(normalizeRA(coords.rightAscension), 3)
    expect(back.declination).toBeCloseTo(coords.declination, 3)
  })
})
