import * as b from 'benny'
import { Earth } from '@'
import { getDecimalValue } from '@/sexagesimal'

const ra = getDecimalValue(16, 54, 0.14) // in hours
const dec = getDecimalValue(-39, 50, 44.9)
const equCoords = { rightAscension: ra.hoursToDegrees(), declination: dec }

export default b.suite(
  'Earth aberration getNutationEquatorialAberration',

  b.add('getNutationEquatorialAberration high', () => {
    Earth.getNutationEquatorialAberration(2451234.56, equCoords)
  }),
  b.add('getNutationEquatorialAberration low', () => {
    Earth.getNutationEquatorialAberration(2451234.56, equCoords, false)
  }),

  b.cycle(),
  b.complete(),
)
