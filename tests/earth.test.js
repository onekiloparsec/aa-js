import { Earth } from '@/earth'

test('get earth ecliptic coordinates', () => {
  const jd = 2448908.5
  const ecl = Earth.getEclipticCoordinates(jd)
  expect(ecl.longitude).toBeCloseTo(19.907371990723732, 12)
  expect(ecl.latitude).toBeCloseTo(-0.00017901250407703628, 12)
})

test('get earth radius vector', () => {
  const jd = 2448908.5
  expect(Earth.getRadiusVector(jd)).toBeCloseTo(0.99760774951494113, 12)
})

// AA p82
test('earth flattening corrections', () => {
  const palomar = { latitude: 33.356111, height: 1706 }
  const corrections = Earth.getFlatteningCorrections(palomar.height, palomar.latitude)
  expect(corrections.rhosinphi).toBeCloseTo(0.546861, 6)
  expect(corrections.rhocosphi).toBeCloseTo(0.836339, 6)
})
