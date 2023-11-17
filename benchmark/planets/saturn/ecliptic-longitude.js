import * as b from 'benny'
import { Saturn } from '@'

export default b.suite(
  'Saturn coordinates getGeocentricEclipticLongitude',

  b.add('getEclipticLongitude high', () => {
    Saturn.getEclipticLongitude(245123456)
  }),
  b.add('getEclipticLongitude low', () => {
    Saturn.getEclipticLongitude(245123456, false)
  }),

  b.cycle(),
  b.complete(),
)
