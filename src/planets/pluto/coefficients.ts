import Decimal from '@/decimal'

export type ArgumentCoefficient = {
  J: Decimal, S: Decimal, P: Decimal
}
export type ArgumentCoefficientNum = {
  J: number, S: number, P: number
}
export type CoordsCoefficient = {
  A: Decimal, B: Decimal
}
export type CoordsCoefficientNum = {
  A: number, B: number
}

export const getArgumentCoefficients = function (useDecimals: boolean = true): (ArgumentCoefficient | ArgumentCoefficientNum)[] {
  return [
    [0, 0, 1],
    [0, 0, 2],
    [0, 0, 3],
    [0, 0, 4],
    [0, 0, 5],
    [0, 0, 6],
    [0, 1, -1],
    [0, 1, 0],
    [0, 1, 1],
    [0, 1, 2],
    [0, 1, 3],
    [0, 2, -2],
    [0, 2, -1],
    [0, 2, 0],
    [1, -1, 0],
    [1, -1, 1],
    [1, 0, -3],
    [1, 0, -2],
    [1, 0, -1],
    [1, 0, 0],
    [1, 0, 1],
    [1, 0, 2],
    [1, 0, 3],
    [1, 0, 4],
    [1, 1, -3],
    [1, 1, -2],
    [1, 1, -1],
    [1, 1, 0],
    [1, 1, 1],
    [1, 1, 3],
    [2, 0, -6],
    [2, 0, -5],
    [2, 0, -4],
    [2, 0, -3],
    [2, 0, -2],
    [2, 0, -1],
    [2, 0, 0],
    [2, 0, 1],
    [2, 0, 2],
    [2, 0, 3],
    [3, 0, -2],
    [3, 0, -1],
    [3, 0, 0]
  ].map((a) => {
    return useDecimals ?
      { J: new Decimal(a[0]), S: new Decimal(a[1]), P: new Decimal(a[2]) } :
      { J: a[0], S: a[1], P: a[2] }
  })
}

export const getLongitudeCoefficients = function (useDecimals: boolean = true): (CoordsCoefficient | CoordsCoefficientNum)[] {
  return [
    [-19799805, 19850055],
    [897144, -4954829],
    [611149, 1211027],
    [-341243, -189585],
    [129287, -34992],
    [-38164, 30893],
    [20442, -9987],
    [-4063, -5071],
    [-6016, -3336],
    [-3956, 3039],
    [-667, 3572],
    [1276, 501],
    [1152, -917],
    [630, -1277],
    [2571, -459],
    [899, -1449],
    [-1016, 1043],
    [-2343, -1012],
    [7042, 788],
    [1199, -338],
    [418, -67],
    [120, -274],
    [-60, -159],
    [-82, -29],
    [-36, -29],
    [-40, 7],
    [-14, 22],
    [4, 13],
    [5, 2],
    [-1, 0],
    [2, 0],
    [-4, 5],
    [4, -7],
    [14, 24],
    [-49, -34],
    [163, -48],
    [9, -24],
    [-4, 1],
    [-3, 1],
    [1, 3],
    [-3, -1],
    [5, -3],
    [0, 0]
  ].map((a) => {
    return useDecimals ?
      { A: new Decimal(a[0]), B: new Decimal(a[1]) } :
      { A: a[0], B: a[1] }
  })
}

export const getLatitudeCoefficients = function (useDecimals: boolean = true): (CoordsCoefficient | CoordsCoefficientNum)[] {
  return [
    [-5452852, -14974862],
    [3527812, 1672790],
    [-1050748, 327647],
    [178690, -292153],
    [18650, 100340],
    [-30697, -25823],
    [4878, 11248],
    [226, -64],
    [2030, -836],
    [69, -604],
    [-247, -567],
    [-57, 1],
    [-122, 175],
    [-49, -164],
    [-197, 199],
    [-25, 217],
    [589, -248],
    [-269, 711],
    [185, 193],
    [315, 807],
    [-130, -43],
    [5, 3],
    [2, 17],
    [2, 5],
    [2, 3],
    [3, 1],
    [2, -1],
    [1, -1],
    [0, -1],
    [0, 0],
    [0, -2],
    [2, 2],
    [-7, 0],
    [10, -8],
    [-3, 20],
    [6, 5],
    [14, 17],
    [-2, 0],
    [0, 0],
    [0, 0],
    [0, 1],
    [0, 0],
    [1, 0]
  ].map((a) => {
    return useDecimals ?
      { A: new Decimal(a[0]), B: new Decimal(a[1]) } :
      { A: a[0], B: a[1] }
  })
}

export const getRadiusCoefficients = function (useDecimals: boolean = true): (CoordsCoefficient | CoordsCoefficientNum)[] {
  return [
    [66865439, 68951812],
    [-11827535, -332538],
    [1593179, -1438890],
    [-18444, 483220],
    [-65977, -85431],
    [31174, -6032],
    [-5794, 22161],
    [4601, 4032],
    [-1729, 234],
    [-415, 702],
    [239, 723],
    [67, -67],
    [1034, -451],
    [-129, 504],
    [480, -231],
    [2, -441],
    [-3359, 265],
    [7856, -7832],
    [36, 45763],
    [8663, 8547],
    [-809, -769],
    [263, -144],
    [-126, 32],
    [-35, -16],
    [-19, -4],
    [-15, 8],
    [-4, 12],
    [5, 6],
    [3, 1],
    [6, -2],
    [2, 2],
    [-2, -2],
    [14, 13],
    [-63, 13],
    [136, -236],
    [273, 1065],
    [251, 149],
    [-25, -9],
    [9, -2],
    [-8, 7],
    [2, -10],
    [19, 35],
    [10, 3]
  ].map((a) => {
    return useDecimals ?
      { A: new Decimal(a[0]), B: new Decimal(a[1]) } :
      { A: a[0], B: a[1] }
  })
}
