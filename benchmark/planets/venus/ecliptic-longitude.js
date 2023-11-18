import * as b from 'benny'
import { Venus } from '@'

export default b.suite(
  'Venus coordinates getGeocentricEclipticLongitude',

  b.add('getEclipticLongitude high', () => {
    Venus.getEclipticLongitude(2451234.56)
  }),
  b.add('getEclipticLongitude low', () => {
    Venus.getEclipticLongitude(2451234.56, false)
  }),

  b.cycle(),
  b.complete(),
)
