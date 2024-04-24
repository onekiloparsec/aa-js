import * as b from 'benny'
import { Uranus } from '@'

export default b.suite(
  'Uranus coordinates getApparentGeocentricEquatorialCoordinates',

  b.add('getApparentGeocentricEquatorialCoordinates', () => {
    Uranus.getApparentGeocentricEquatorialCoordinates(2448972)
  }),

  b.cycle(),
  b.complete(),
)
