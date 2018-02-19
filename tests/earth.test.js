const earth = require('../src/earth')
const julianday = require('../src/julianday')
const constants = require('../src/constants')

test('get earth ecliptic coordinates', () => {
    const e = new earth.Earth(2448908.5)
    const ecl = e.eclipticCoordinates()
    expect(ecl.longitude).toBeCloseTo(19.907371990723732)
    expect(ecl.latitude).toBeCloseTo(-0.00017901250407703628)
})

test('get earth radius vector', () => {
    const e = new earth.Earth(2448908.5)
    expect(e.radiusVector()).toBeCloseTo(0.99760774951494113)
})

