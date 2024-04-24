import * as b from 'benny'
import { Mercury } from '@'

export default b.suite(
  'Mercury coordinates getApparentGeocentricEquatorialCoordinates',

  b.add('getApparentGeocentricEquatorialCoordinates', () => {
    Mercury.getApparentGeocentricEquatorialCoordinates(2448972)
  }),

  b.cycle(),
  b.complete(),
)
