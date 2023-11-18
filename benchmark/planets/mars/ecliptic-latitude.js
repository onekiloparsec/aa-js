import * as b from 'benny'
import { Mars } from '@'

export default b.suite(
  'Mars coordinates getEclipticLatitude',

  b.add('getEclipticLatitude high', () => {
    Mars.getEclipticLatitude(2451234.56)
  }),
  b.add('getEclipticLatitude low', () => {
    Mars.getEclipticLatitude(2451234.56, false)
  }),

  b.cycle(),
  b.complete(),
)
