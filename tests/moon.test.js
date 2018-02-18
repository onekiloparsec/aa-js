const moon = require('../src/moon')

test('get moon mean longitude', () => {
    expect(moon.getMeanLongitude(245123456)).toBe(182.125250)
})
