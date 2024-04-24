import * as b from 'benny'
import { Mercury } from '@'

export default b.suite(
  'Mercury coordinates getApparentGeocentricEclipticCoordinates',

  b.add('getApparentGeocentricEclipticCoordinates', () => {
    Mercury.getApparentGeocentricEclipticCoordinates(2448972)
  }),

  b.cycle(),
  b.complete(),
)
