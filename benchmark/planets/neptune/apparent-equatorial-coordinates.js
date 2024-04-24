import * as b from 'benny'
import { Neptune } from '@'

export default b.suite(
  'Neptune coordinates getApparentGeocentricEquatorialCoordinates',

  b.add('getApparentGeocentricEquatorialCoordinates', () => {
    Neptune.getApparentGeocentricEquatorialCoordinates(2448972)
  }),

  b.cycle(),
  b.complete(),
)
