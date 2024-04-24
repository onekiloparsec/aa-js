import * as b from 'benny'
import { Mars } from '@'

export default b.suite(
  'Mars coordinates getGeocentricEclipticLongitude',

  b.add('getEclipticLongitude', () => {
    Mars.getEclipticLongitude(2451234.56)
  }),

  b.cycle(),
  b.complete(),
)
