import * as b from 'benny'
import { Earth } from '@'

export default b.suite(
  'Earth aberration getEarthVelocity',

  b.add('getEclipticLongitude high', () => {
    Earth.getEarthVelocity(2451234.56)
  }),
  b.add('getEclipticLongitude low', () => {
    Earth.getEarthVelocity(2451234.56, false)
  }),

  b.cycle(),
  b.complete(),
)
