import coordinates from '../src/coordinates'

test('get altitude', () => {
  expect(coordinates.getHorizontalAltitude({})).toBe(-1)
  expect(coordinates.getHorizontalAltitude({ julianDay: 24550000 })).toBe(-1)
  expect(coordinates.getHorizontalAltitude({ julianDay: null, targetCoords: {}, siteCoords: {}})).toBe(-1)
})

