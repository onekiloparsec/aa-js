const moon = require('../src/moon')
const julianday = require('../src/julianday')
const constants = require('../src/constants')

test('get moon mean longitude', () => {
    expect(moon.getMeanLongitude(245123456)).toBe(182.125250)
})

test('get moon mean elongation', () => {
    expect(moon.getMeanElongation(245123456)).toBe(175.56631)
})

test('get moon equatorial coordinates', () => {
    const UTCDate = new Date(Date.UTC(1992, 3, 12))
    const jd = new julianday.JulianDay(UTCDate)
    const m = new moon.Moon(jd.value)
    const equ = m.equatorialCoordinates()
    expect(equ.rightAscension).toBeCloseTo(134.688470 * constants.DEGREES_TO_HOURS)
    expect(equ.declination).toBeCloseTo(13.768368)
})


