import * as b from 'benny'
import { Jupiter } from '@'

export default b.suite(
  'Jupiter coordinates getGeocentricEclipticLongitude',

  b.add('getEclipticLongitude high', () => {
    Jupiter.getEclipticLongitude(245123456)
  }),
  b.add('getEclipticLongitude low', () => {
    Jupiter.getEclipticLongitude(245123456, false)
  }),

  b.cycle(),
  b.complete(),
)
