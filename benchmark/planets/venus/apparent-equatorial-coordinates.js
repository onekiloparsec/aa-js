import * as b from 'benny'
import { Venus } from '@'

export default b.suite(
  'Venus coordinates getApparentGeocentricEquatorialCoordinates',

  b.add('getApparentGeocentricEquatorialCoordinates', () => {
    Venus.getApparentGeocentricEquatorialCoordinates(2448972)
  }),

  b.cycle(),
  b.complete(),
)
