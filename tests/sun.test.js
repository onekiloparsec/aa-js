const sun = require('../src/sun')
const julianday = require('../src/julianday')
const constants = require('../src/constants')

test('get sun equatorial coordinates', () => {
    const UTCDate = new Date(Date.UTC(1993, 9, 13))
    const jd = new julianday.JulianDay(UTCDate)
    const s = new sun.Sun(jd.value)
    const equ = s.equatorialCoordinates()
    expect(equ.rightAscension).toBeCloseTo(13.225389)
    expect(equ.declination).toBeCloseTo(-7.78507)
})


