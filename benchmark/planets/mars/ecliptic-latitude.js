import * as b from 'benny'
import { Mars } from '@'

export default b.suite(
  'Mars coordinates getEclipticLatitude',

  b.add('getEclipticLatitude', () => {
    Mars.getEclipticLatitude(2451234.56)
  }),

  b.cycle(),
  b.complete(),
)
