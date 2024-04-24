import * as b from 'benny'
import { Jupiter } from '@'

export default b.suite(
  'Jupiter coordinates getApparentGeocentricEclipticCoordinates',

  b.add('getApparentGeocentricEclipticCoordinates', () => {
    Jupiter.getApparentGeocentricEclipticCoordinates(2448972)
  }),

  b.cycle(),
  b.complete(),
)
