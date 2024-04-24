import * as b from 'benny'
import { Earth, Equinox } from '@'

export default b.suite(
  'Earth coordinates getEclipticLongitude',

  b.add('getEclipticLongitude', () => {
    Earth.getEclipticLongitude(2451234.56)
  }),

  b.cycle(),
  b.complete(),
)
