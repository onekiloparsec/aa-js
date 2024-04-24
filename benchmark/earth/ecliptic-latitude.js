import * as b from 'benny'
import { Earth, Equinox } from '@'

export default b.suite(
  'Earth coordinates getEclipticLatitude',

  b.add('getEclipticLatitude', () => {
    Earth.getEclipticLatitude(2451234.56)
  }),

  b.cycle(),
  b.complete(),
)
