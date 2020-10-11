import { fmod } from '../src/utils'

test('fmod positive', () => {
  expect(fmod(0, 1)).toEqual(0)
  expect(fmod(0.5, 1)).toEqual(0.5)
  expect(fmod(10000.5, 1)).toEqual(0.5)
  expect(fmod(0.99999, 1)).toEqual(0.99999)
  expect(fmod(1, 1)).toEqual(0)
})


test('fmod positive', () => {
  expect(fmod(-0, 1)).toEqual(0)
  expect(fmod(-0.5, 1)).toEqual(0.5)
  expect(fmod(-10000.5, 1)).toEqual(0.5)
  expect(fmod(-0.99999, 1)).toEqual(0.00001)
  expect(fmod(-1, 1)).toEqual(0)
})