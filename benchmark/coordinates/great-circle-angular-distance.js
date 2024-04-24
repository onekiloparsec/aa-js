import * as b from 'benny'
import * as coordinates from '@/coordinates.ts'

const thetaPersei = { rightAscension: 41.511331, declination: 49.3545 }
const coordsVenus = { rightAscension: 41.73129, declination: 18.44092 }

b.suite(
  'coordinates getGreatCircleAngularDistance',

  b.add('getGreatCircleAngularDistance', () => {
    coordinates.getGreatCircleAngularDistance(thetaPersei, coordsVenus)
  }),

  b.cycle(),
  b.complete()
)

