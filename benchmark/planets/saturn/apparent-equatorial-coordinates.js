import * as b from 'benny'
import { Saturn } from '@'

export default b.suite(
  'Saturn coordinates getApparentGeocentricEquatorialCoordinates',

  b.add('getApparentGeocentricEquatorialCoordinates', () => {
    Saturn.getApparentGeocentricEquatorialCoordinates(2448972)
  }),

  b.cycle(),
  b.complete(),
)
