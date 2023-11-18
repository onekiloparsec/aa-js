import * as b from 'benny'
import { Mercury } from '@'

export default b.suite(
  'Mercury coordinates getEclipticLatitude',

  b.add('getEclipticLatitude high', () => {
    Mercury.getEclipticLatitude(2451234.56)
  }),
  b.add('getEclipticLatitude low', () => {
    Mercury.getEclipticLatitude(2451234.56, false)
  }),

  b.cycle(),
  b.complete(),
)
