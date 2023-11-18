import * as b from 'benny'
import { Mercury } from '@'

export default b.suite(
  'Mercury coordinates getGeocentricEclipticLongitude',

  b.add('getEclipticLongitude high', () => {
    Mercury.getEclipticLongitude(2451234.56)
  }),
  b.add('getEclipticLongitude low', () => {
    Mercury.getEclipticLongitude(2451234.56, false)
  }),

  b.cycle(),
  b.complete(),
)
