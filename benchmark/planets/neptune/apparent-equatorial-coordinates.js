import * as b from 'benny'
import { Neptune } from '@'

export default b.suite(
  'Neptune coordinates getApparentGeocentricEquatorialCoordinates',

  b.add('getApparentGeocentricEquatorialCoordinates high', () => {
    Neptune.getApparentGeocentricEquatorialCoordinates(2448972)
  }),
  b.add('getApparentGeocentricEquatorialCoordinates low', () => {
    Neptune.getApparentGeocentricEquatorialCoordinates(2448972, false)
  }),

  b.cycle(),
  b.complete(),
)
