import * as b from 'benny'
import { Neptune } from '@'

export default b.suite(
  'Neptune coordinates getEclipticLatitude',

  b.add('getEclipticLatitude', () => {
    Neptune.getEclipticLatitude(2451234.56)
  }),

  b.cycle(),
  b.complete(),
)
