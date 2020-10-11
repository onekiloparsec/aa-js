import * as earth from '../src/earth'

test('get earth ecliptic coordinates', () => {
  const jd = 2448908.5
  const ecl = earth.eclipticCoordinates(jd)
  expect(ecl.longitude).toBeCloseTo(19.907371990723732)
  expect(ecl.latitude).toBeCloseTo(-0.00017901250407703628)
})

test('get earth radius vector', () => {
  const jd = 2448908.5
  expect(earth.radiusVector(jd)).toBeCloseTo(0.99760774951494113)
})

