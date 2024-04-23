import { Earth, juliandays } from '@'
import { transformUTC2TT } from '@/times'

describe('earth', () => {

  test('get earth ecliptic coordinates', () => {
    const jd = 2448908.5
    const ecl = Earth.getEclipticCoordinates(jd)
    expect(ecl.longitude).toBeCloseTo(19.90737199072482, 12)
    expect(ecl.latitude).toBeCloseTo(-0.00017901250407703628, 12)
  })

  test('get earth radius vector', () => {
    const jd = 2448908.5
    expect(Earth.getRadiusVector(jd)).toBeCloseTo(0.99760774951494113, 12)
  })

  // AA p.153
  test('get earth eccentricity', () => {
    const utcDate = new Date(Date.UTC(2028, 10, 13, 19))
    const jd = transformUTC2TT(juliandays.getJulianDay(utcDate))
    expect(Earth.getEccentricity(jd)).toBeCloseTo(0.016_696_49, 8)
  })

  // AA p.153
  test('get earth longitude of perihelion', () => {
    const utcDate = new Date(Date.UTC(2028, 10, 13, 19))
    const jd = transformUTC2TT(juliandays.getJulianDay(utcDate))
    expect(Earth.getLongitudeOfPerihelion(jd)).toBeCloseTo(103.434, 3)
  })

  // AA p82
  test('earth flattening corrections', () => {
    const palomar = { latitude: 33.356111, height: 1706 }
    const corrections = Earth.getFlatteningCorrections(palomar.height, palomar.latitude)
    expect(corrections.rhosinphi).toBeCloseTo(0.546861, 6)
    expect(corrections.rhocosphi).toBeCloseTo(0.836339, 6)
  })
})
