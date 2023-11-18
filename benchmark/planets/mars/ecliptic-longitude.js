import * as b from 'benny'
import { Mars } from '@'

export default b.suite(
  'Mars coordinates getGeocentricEclipticLongitude',

  b.add('getEclipticLongitude high', () => {
    Mars.getEclipticLongitude(2451234.56)
  }),
  b.add('getEclipticLongitude low', () => {
    Mars.getEclipticLongitude(2451234.56, false)
  }),

  b.cycle(),
  b.complete(),
)
