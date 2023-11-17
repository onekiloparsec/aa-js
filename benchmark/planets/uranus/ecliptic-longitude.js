import * as b from 'benny'
import { Uranus } from '@'

export default b.suite(
  'Uranus coordinates getGeocentricEclipticLongitude',

  b.add('getEclipticLongitude high', () => {
    Uranus.getEclipticLongitude(245123456)
  }),
  b.add('getEclipticLongitude low', () => {
    Uranus.getEclipticLongitude(245123456, false)
  }),

  b.cycle(),
  b.complete(),
)
