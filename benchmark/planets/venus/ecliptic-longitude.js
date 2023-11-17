import * as b from 'benny'
import { Venus } from '@'

export default b.suite(
  'Venus coordinates getGeocentricEclipticLongitude',

  b.add('getEclipticLongitude high', () => {
    Venus.getEclipticLongitude(245123456)
  }),
  b.add('getEclipticLongitude low', () => {
    Venus.getEclipticLongitude(245123456, false)
  }),

  b.cycle(),
  b.complete(),
)
