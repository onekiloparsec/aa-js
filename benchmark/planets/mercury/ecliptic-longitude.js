import * as b from 'benny'
import { Mercury } from '@'

export default b.suite(
  'Mercury coordinates getGeocentricEclipticLongitude',

  b.add('getEclipticLongitude', () => {
    Mercury.getEclipticLongitude(2451234.56)
  }),

  b.cycle(),
  b.complete(),
)
