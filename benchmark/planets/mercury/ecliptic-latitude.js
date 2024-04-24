import * as b from 'benny'
import { Mercury } from '@'

export default b.suite(
  'Mercury coordinates getEclipticLatitude',

  b.add('getEclipticLatitude', () => {
    Mercury.getEclipticLatitude(2451234.56)
  }),

  b.cycle(),
  b.complete(),
)
