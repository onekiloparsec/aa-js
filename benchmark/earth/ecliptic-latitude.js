import * as b from 'benny'
import { Earth, Equinox } from '@'

export default b.suite(
  'Earth coordinates getEclipticLatitude',

  b.add('getEclipticLatitude high', () => {
    Earth.getEclipticLatitude(2451234.56)
  }),
  b.add('getEclipticLatitude low', () => {
    Earth.getEclipticLatitude(2451234.56, Equinox.MeanOfTheDate, false)
  }),

  b.cycle(),
  b.complete(),
)
