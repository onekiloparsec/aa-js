import * as b from 'benny'
import { Neptune } from '@'

export default b.suite(
  'Neptune coordinates getGeocentricEclipticLongitude',

  b.add('getEclipticLongitude high', () => {
    Neptune.getEclipticLongitude(2451234.56)
  }),
  b.add('getEclipticLongitude low', () => {
    Neptune.getEclipticLongitude(2451234.56, false)
  }),

  b.cycle(),
  b.complete(),
)
