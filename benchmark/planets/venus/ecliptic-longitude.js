import * as b from 'benny'
import { Venus } from '@'

export default b.suite(
  'Venus coordinates getGeocentricEclipticLongitude',

  b.add('getEclipticLongitude', () => {
    Venus.getEclipticLongitude(2451234.56)
  }),

  b.cycle(),
  b.complete(),
)
