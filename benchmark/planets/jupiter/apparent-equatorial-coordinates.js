import * as b from 'benny'
import { Jupiter } from '@'

export default b.suite(
  'Jupiter coordinates getApparentGeocentricEquatorialCoordinates',

  b.add('getEclipticLongitude high', () => {
    Jupiter.getApparentGeocentricEquatorialCoordinates(245123456)
  }),
  b.add('getEclipticLongitude low', () => {
    Jupiter.getApparentGeocentricEquatorialCoordinates(245123456, false)
  }),

  b.cycle(),
  b.complete(),
)
