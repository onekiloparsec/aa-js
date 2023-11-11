import { getJulianDay } from '@/juliandays'
import { H2DEG } from '@/constants'
import { getFlatteningCorrections } from '@/earth/coordinates'
import { getDecimalValue } from '@/sexagesimal'
import {
  getDeclinationFromEcliptic,
  getEclipticLatitudeFromEquatorial,
  getEclipticLongitudeFromEquatorial,
  getParallacticAngle,
  getRightAscensionFromEcliptic,
  transformEquatorialToTopocentric
} from '@/coordinates'
import { Mars } from '@/planets/mars'

describe('coordinates', () => {
  test('parallactic angle before meridian', () => {
    const utcDate = new Date(Date.UTC(2017, 5, 14, 2, 0, 0.0))
    const jd = getJulianDay(utcDate)

    // gro_j1655_40, see below
    const ra = getDecimalValue(16, 54, 0.14) // in hours
    const dec = getDecimalValue(-39, 50, 44.9)

    // http://www.ls.eso.org/lasilla/Telescopes/2p2/D1p5M/
    const lng = getDecimalValue(-70, 44, 7.662) // east-positive
    const lat = getDecimalValue(-29, 15, 14.235)

    // See https://www.eso.org/sci/observing/tools/calendar/ParAng.html to check values.
    const refAngle = -78.1

    expect(getParallacticAngle(jd, ra, dec, lng, lat).toNumber()).toBeCloseTo(refAngle, 0)
  })

  test('parallactic angle after meridian', () => {
    const utcDate = new Date(Date.UTC(2017, 5, 14, 6, 0, 0.0))
    let jd = getJulianDay(utcDate)

    // gro_j1655_40, see below
    let ra = getDecimalValue(16, 54, 0.14) // in hours
    let dec = getDecimalValue(-39, 50, 44.9)

    // http://www.ls.eso.org/lasilla/Telescopes/2p2/D1p5M/
    let lng = getDecimalValue(-70, 44, 7.662) // east-positive
    let lat = getDecimalValue(-29, 15, 14.235)

    // Slightly adjusted values. Ref might not be 100% accurate...
    // Looking for improved reference values...
    let refAngle = 74.4

    expect(getParallacticAngle(jd, ra, dec, lng, lat).toNumber()).toBeCloseTo(refAngle, 0)
  })

// See AA p95, Ex 13.a
  test('transform equatorial to ecliptic', () => {
    const pollux = { rightAscension: 7 + 45 / 60 + 18.946 / 3600, declination: 28 + 1 / 60 + 34.26 / 3600 }
    const lambda = getEclipticLongitudeFromEquatorial(pollux.rightAscension, pollux.declination)
    expect(lambda.toNumber()).toBeCloseTo(113.215629, 6)
    const beta = getEclipticLatitudeFromEquatorial(pollux.rightAscension, pollux.declination)
    expect(beta.toNumber()).toBeCloseTo(6.684170, 6)
  })


// See AA p95, Ex 13.a
  test('transform ecliptic to equatorial', () => {
    const pollux = { rightAscension: 7 + 45 / 60 + 18.946 / 3600, declination: 28 + 1 / 60 + 34.26 / 3600 }
    const alpha = getRightAscensionFromEcliptic(113.215630, 6.684170)
    expect(alpha).toBeCloseTo(pollux.rightAscension, 6)
    const delta = getDeclinationFromEcliptic(113.215630, 6.684170)
    expect(delta).toBeCloseTo(pollux.declination, 6)
  })


//See AA p.280-281, Ex 40.a
  test('transformation from equatorial to topocentric', () => {
    const date = new Date(Date.UTC(2003, 7, 28, 3, 17, 0))
    const jd = getJulianDay(date)
    const palomar = { longitude: getDecimalValue(7, 47, 27, false) * H2DEG, latitude: 33.356111, height: 1706 }
    const corrections = getFlatteningCorrections(palomar.height, palomar.latitude)
    expect(corrections.rhocosphi.toNumber()).toBeCloseTo(0.836339, 6)
    expect(corrections.rhosinphi.toNumber()).toBeCloseTo(0.546861, 6)
    const coordsAlt = Mars.getGeocentricEquatorialCoordinates(jd)
    expect(coordsAlt.rightAscension.hoursToDegrees().toDP(6)).toBeCloseTo(339.530208, 2)
    expect(coordsAlt.declination.toDP(6).toNumber()).toBeCloseTo(-15.771083, 3)
    const coords = { rightAscension: getDecimalValue(22, 38, 7.25), declination: getDecimalValue(-15, 46, 15.9) }
    const distance = Mars.getGeocentricDistance(jd)
    expect(distance.toNumber()).toBeCloseTo(0.37276, 4)
    const topoCoords = transformEquatorialToTopocentric(jd, coords, distance, palomar)
    expect(topoCoords.rightAscension.toNumber()).toBeCloseTo(getDecimalValue(22, 38, 8.54), 3)
    expect(topoCoords.declination.toNumber()).toBeCloseTo(getDecimalValue(-15, 46, 30), 2)
  })
})
