import * as b from 'benny'
import { Earth, sexagesimal } from '@'

const ra = sexagesimal.getDecimalValue(16, 54, 0.14) // in hours
const dec = sexagesimal.getDecimalValue(-39, 50, 44.9)
const equCoords = { rightAscension: ra* H2DEG, declination: dec }

export default b.suite(
  'Earth aberration getAnnualEquatorialAberration',

  b.add('getAnnualEquatorialAberration', () => {
    Earth.getAnnualEquatorialAberration(2451234.56, equCoords)
  }),

  b.cycle(),
  b.complete(),
)
