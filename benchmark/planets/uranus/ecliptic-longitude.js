import * as b from 'benny'
import { Uranus } from '@'

export default b.suite(
  'Uranus coordinates getGeocentricEclipticLongitude',

  b.add('getEclipticLongitude', () => {
    Uranus.getEclipticLongitude(2451234.56)
  }),

  b.cycle(),
  b.complete(),
)
