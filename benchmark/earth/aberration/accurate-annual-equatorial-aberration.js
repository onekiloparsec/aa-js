import * as b from 'benny'
import { Earth } from '@'
import { getDecimalValue } from '@/sexagesimal'

const ra = getDecimalValue(16, 54, 0.14) // in hours
const dec = getDecimalValue(-39, 50, 44.9)
const equCoords = { rightAscension: ra* H2DEG, declination: dec }

export default b.suite(
  'Earth aberration getAccurateAnnualEquatorialAberration',

  b.add('getAccurateAnnualEquatorialAberration high', () => {
    Earth.getAccurateAnnualEquatorialAberration(2451234.56, equCoords)
  }),
  b.add('getAccurateAnnualEquatorialAberration low', () => {
    Earth.getAccurateAnnualEquatorialAberration(2451234.56, equCoords, false)
  }),

  b.cycle(),
  b.complete(),
)
