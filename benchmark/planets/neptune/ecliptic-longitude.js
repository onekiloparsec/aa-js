import * as b from 'benny'
import { Neptune } from '@'

export default b.suite(
  'Neptune coordinates getGeocentricEclipticLongitude',

  b.add('getEclipticLongitude', () => {
    Neptune.getEclipticLongitude(2451234.56)
  }),

  b.cycle(),
  b.complete(),
)
