const moon = require('../src/moon')

test('get moon mean longitude', () => {
    expect(moon.getMeanLongitude(245123456)).toBe(182.125250)
})

test('get moon mean elongation', () => {
    expect(moon.getMeanElongation(245123456)).toBe(175.56631)
})

test('get moon equatorial coordinates', () => {
    const m = new moon.Moon(245123456)
    expect(m.equatorialCoordinates()).toBe('equatorialCoordinates...')
})
