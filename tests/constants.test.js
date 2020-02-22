import constants from '../src/constants'

test('Math.fmod positive', () => {
  expect(Math.fmod(0, 1)).toEqual(0)
  expect(Math.fmod(0.5, 1)).toEqual(0.5)
  expect(Math.fmod(10000.5, 1)).toEqual(0.5)
  expect(Math.fmod(0.99999, 1)).toEqual(0.99999)
  expect(Math.fmod(1, 1)).toEqual(0)
})


test('Math.fmod positive', () => {
  expect(Math.fmod(-0, 1)).toEqual(0)
  expect(Math.fmod(-0.5, 1)).toEqual(0.5)
  expect(Math.fmod(-10000.5, 1)).toEqual(0.5)
  expect(Math.fmod(-0.99999, 1)).toEqual(0.99999)
  expect(Math.fmod(-1, 1)).toEqual(0)
})