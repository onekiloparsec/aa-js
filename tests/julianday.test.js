import julianday from '../src/julianday'

test('get julianday', () => {
  const UTCDate = new Date(Date.UTC(2016, 8, 17))
  expect(new julianday.JulianDay(UTCDate).value).toBe(2457648.5)
})

