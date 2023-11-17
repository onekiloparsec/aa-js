import * as b from 'benny'
import { Mars } from '@'

export default b.suite(
  'Mars coordinates getGeocentricEclipticLongitude',

  b.add('getEclipticLongitude high', () => {
    Mars.getEclipticLongitude(245123456)
  }),
  b.add('getEclipticLongitude low', () => {
    Mars.getEclipticLongitude(245123456, false)
  }),

  b.cycle(),
  b.complete(),
)
