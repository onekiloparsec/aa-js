import * as b from 'benny'
import { Venus } from '@'

export default b.suite(
  'Venus coordinates getApparentGeocentricEclipticCoordinates',

  b.add('getApparentGeocentricEclipticCoordinates', () => {
    Venus.getApparentGeocentricEclipticCoordinates(2448972)
  }),

  b.cycle(),
  b.complete(),
)
