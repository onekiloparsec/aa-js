import * as b from 'benny'
import { Uranus } from '@'

export default b.suite(
  'Uranus coordinates getGeocentricEclipticLongitude',

  b.add('getEclipticLongitude high', () => {
    Uranus.getEclipticLongitude(2451234.56)
  }),
  b.add('getEclipticLongitude low', () => {
    Uranus.getEclipticLongitude(2451234.56, false)
  }),

  b.cycle(),
  b.complete(),
)
