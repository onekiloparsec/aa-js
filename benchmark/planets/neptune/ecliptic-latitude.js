import * as b from 'benny'
import { Neptune } from '@'

export default b.suite(
  'Neptune coordinates getEclipticLatitude',

  b.add('getEclipticLatitude high', () => {
    Neptune.getEclipticLatitude(2451234.56)
  }),
  b.add('getEclipticLatitude low', () => {
    Neptune.getEclipticLatitude(2451234.56, false)
  }),

  b.cycle(),
  b.complete(),
)
