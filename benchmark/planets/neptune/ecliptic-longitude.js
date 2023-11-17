import * as b from 'benny'
import { Neptune } from '@'

export default b.suite(
  'Neptune coordinates getGeocentricEclipticLongitude',

  b.add('getEclipticLongitude high', () => {
    Neptune.getEclipticLongitude(245123456)
  }),
  b.add('getEclipticLongitude low', () => {
    Neptune.getEclipticLongitude(245123456, false)
  }),

  b.cycle(),
  b.complete(),
)
