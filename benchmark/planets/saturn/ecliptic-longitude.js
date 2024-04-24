import * as b from 'benny'
import { Saturn } from '@'

export default b.suite(
  'Saturn coordinates getGeocentricEclipticLongitude',

  b.add('getEclipticLongitude', () => {
    Saturn.getEclipticLongitude(2451234.56)
  }),

  b.cycle(),
  b.complete(),
)
