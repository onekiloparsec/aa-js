import * as b from 'benny'
import { Venus } from '@'

export default b.suite(
  'Venus coordinates getEclipticLatitude',

  b.add('getEclipticLatitude', () => {
    Venus.getEclipticLatitude(2451234.56)
  }),

  b.cycle(),
  b.complete(),
)
