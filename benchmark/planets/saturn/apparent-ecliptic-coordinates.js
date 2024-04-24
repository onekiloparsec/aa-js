import * as b from 'benny'
import { Saturn } from '@'

export default b.suite(
  'Saturn coordinates getApparentGeocentricEclipticCoordinates',

  b.add('getApparentGeocentricEclipticCoordinates', () => {
    Saturn.getApparentGeocentricEclipticCoordinates(2448972)
  }),

  b.cycle(),
  b.complete(),
)
