import { Earth } from '@/earth'

test('get earth ecliptic coordinates', () => {
  const jd = 2448908.5
  const ecl = Earth.getEclipticCoordinates(jd)
  expect(ecl.longitude.toNumber()).toBeCloseTo(19.90737199072482, 12)
  expect(ecl.latitude.toNumber()).toBeCloseTo(-0.00017901250407703628, 12)
})

test('get earth radius vector', () => {
  const jd = 2448908.5
  expect(Earth.getRadiusVector(jd).toNumber()).toBeCloseTo(0.99760774951494113, 12)
})

// AA p82
test('earth flattening corrections', () => {
  const palomar = { latitude: 33.356111, height: 1706 }
  const corrections = Earth.getFlatteningCorrections(palomar.height, palomar.latitude)
  expect(corrections.rhosinphi.toNumber()).toBeCloseTo(0.546861, 6)
  expect(corrections.rhocosphi.toNumber()).toBeCloseTo(0.836339, 6)
})
