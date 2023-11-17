import * as b from 'benny'
import { Mercury } from '@'

export default b.suite(
  'Mercury coordinates getGeocentricEclipticLongitude',

  b.add('getEclipticLongitude high', () => {
    Mercury.getEclipticLongitude(245123456)
  }),
  b.add('getEclipticLongitude low', () => {
    Mercury.getEclipticLongitude(245123456, false)
  }),

  b.cycle(),
  b.complete(),
)
