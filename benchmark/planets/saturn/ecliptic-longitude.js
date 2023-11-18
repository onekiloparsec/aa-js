import * as b from 'benny'
import { Saturn } from '@'

export default b.suite(
  'Saturn coordinates getGeocentricEclipticLongitude',

  b.add('getEclipticLongitude high', () => {
    Saturn.getEclipticLongitude(2451234.56)
  }),
  b.add('getEclipticLongitude low', () => {
    Saturn.getEclipticLongitude(2451234.56, false)
  }),

  b.cycle(),
  b.complete(),
)
