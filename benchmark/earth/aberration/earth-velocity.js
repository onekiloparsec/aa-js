import * as b from 'benny'
import { Earth } from '@'

export default b.suite(
  'Earth aberration getEarthVelocity',

  b.add('getEclipticLongitude', () => {
    Earth.getEarthVelocity(2451234.56)
  }),

  b.cycle(),
  b.complete(),
)
