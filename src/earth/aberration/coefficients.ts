import Decimal from '@/decimal'
import { Radian } from '@/types'

/** @private */
export type AberrationCoefficient = {
  L2: Radian
  L3: Radian
  L4: Radian
  L5: Radian
  L6: Radian
  L7: Radian
  L8: Radian
  Ldash: Radian
  D: Radian
  Mdash: Radian
  F: Radian
  xsin: Radian
  xsint: Radian
  xcos: Radian
  xcost: Radian
  ysin: Radian
  ysint: Radian
  ycos: Radian
  ycost: Radian
  zsin: Radian
  zsint: Radian
  zcos: Radian
  zcost: Radian
}

/** @private */
export type AberrationCoefficientNum = {
  L2: number
  L3: number
  L4: number
  L5: number
  L6: number
  L7: number
  L8: number
  Ldash: number
  D: number
  Mdash: number
  F: number
  xsin: number
  xsint: number
  xcos: number
  xcost: number
  ysin: number
  ysint: number
  ycos: number
  ycost: number
  zsin: number
  zsint: number
  zcos: number
  zcost: number
}

export const getAberrationCoefficients = function (useDecimals: boolean = true): (AberrationCoefficient | AberrationCoefficientNum)[] {
  return [
    //L2   L3   L4  L5  L6  L7  L8  Ldash D   Mdash F   xsin      xsint xcos    xcost ysin   ysint ycos     ycost zsin   zsint zcos    zcost
    [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1719914, -2, -25, 0, 25, -13, 1578089, 156, 10, 32, 684185, -358],
    [0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6434, 141, 28007, -107, 25697, -95, -5904, -130, 11141, -48, -2559, -55],
    [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 715, 0, 0, 0, 6, 0, -657, 0, -15, 0, -282, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 715, 0, 0, 0, 0, 0, -656, 0, 0, 0, -285, 0],
    [0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 486, -5, -236, -4, -216, -4, -446, 5, -94, 0, -193, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 159, 0, 0, 0, 2, 0, -147, 0, -6, 0, -61, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 26, 0, 0, 0, -59, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 39, 0, 0, 0, 0, 0, -36, 0, 0, 0, -16, 0],
    [0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 33, 0, -10, 0, -9, 0, -30, 0, -5, 0, -13, 0],
    [0, 2, 0, -1, 0, 0, 0, 0, 0, 0, 0, 31, 0, 1, 0, 1, 0, -28, 0, 0, 0, -12, 0],
    [0, 3, -8, 3, 0, 0, 0, 0, 0, 0, 0, 8, 0, -28, 0, 25, 0, 8, 0, 11, 0, 3, 0],
    [0, 5, -8, 3, 0, 0, 0, 0, 0, 0, 0, 8, 0, -28, 0, -25, 0, -8, 0, -11, 0, -3, 0],
    [2, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 21, 0, 0, 0, 0, 0, -19, 0, 0, 0, -8, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -19, 0, 0, 0, 0, 0, 17, 0, 0, 0, 8, 0],
    [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 17, 0, 0, 0, 0, 0, -16, 0, 0, 0, -7, 0],
    [0, 1, 0, -2, 0, 0, 0, 0, 0, 0, 0, 16, 0, 0, 0, 0, 0, 15, 0, 1, 0, 7, 0],
    [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 16, 0, 0, 0, 1, 0, -15, 0, -3, 0, -6, 0],
    [0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 11, 0, -1, 0, -1, 0, -10, 0, -1, 0, -5, 0],
    [2, -2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -11, 0, -10, 0, 0, 0, -4, 0, 0, 0],
    [0, 1, 0, -1, 0, 0, 0, 0, 0, 0, 0, -11, 0, -2, 0, -2, 0, 9, 0, -1, 0, 4, 0],
    [0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, -7, 0, -8, 0, -8, 0, 6, 0, -3, 0, 3, 0],
    [0, 3, 0, -2, 0, 0, 0, 0, 0, 0, 0, -10, 0, 0, 0, 0, 0, 9, 0, 0, 0, 4, 0],
    [1, -2, 0, 0, 0, 0, 0, 0, 0, 0, 0, -9, 0, 0, 0, 0, 0, -9, 0, 0, 0, -4, 0],
    [2, -3, 0, 0, 0, 0, 0, 0, 0, 0, 0, -9, 0, 0, 0, 0, 0, -8, 0, 0, 0, -4, 0],
    [0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, -9, 0, -8, 0, 0, 0, -3, 0, 0, 0],
    [2, -4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -9, 0, 8, 0, 0, 0, 3, 0, 0, 0],
    [0, 3, -2, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 0, 0, 0, -8, 0, 0, 0, -3, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 2, -1, 0, 8, 0, 0, 0, 0, 0, -7, 0, 0, 0, -3, 0],
    [8, -12, 0, 0, 0, 0, 0, 0, 0, 0, 0, -4, 0, -7, 0, -6, 0, 4, 0, -3, 0, 2, 0],
    [8, -14, 0, 0, 0, 0, 0, 0, 0, 0, 0, -4, 0, -7, 0, 6, 0, -4, 0, 3, 0, -2, 0],
    [0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, -6, 0, -5, 0, -4, 0, 5, 0, -2, 0, 2, 0],
    [3, -4, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 0, -1, 0, -2, 0, -7, 0, 1, 0, -4, 0],
    [0, 2, 0, -2, 0, 0, 0, 0, 0, 0, 0, 4, 0, -6, 0, -5, 0, -4, 0, -2, 0, -2, 0],
    [3, -3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -7, 0, -6, 0, 0, 0, -3, 0, 0, 0],
    [0, 2, -2, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, -5, 0, -4, 0, -5, 0, -2, 0, -2, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, -2, 0, 0, 5, 0, 0, 0, 0, 0, -5, 0, 0, 0, -2, 0],
  ].map(a => {
    return useDecimals ? {
      L2: new Decimal(a[0]),
      L3: new Decimal(a[1]),
      L4: new Decimal(a[2]),
      L5: new Decimal(a[3]),
      L6: new Decimal(a[4]),
      L7: new Decimal(a[5]),
      L8: new Decimal(a[6]),
      Ldash: new Decimal(a[7]),
      D: new Decimal(a[8]),
      Mdash: new Decimal(a[9]),
      F: new Decimal(a[10]),
      xsin: new Decimal(a[11]),
      xsint: new Decimal(a[12]),
      xcos: new Decimal(a[13]),
      xcost: new Decimal(a[14]),
      ysin: new Decimal(a[15]),
      ysint: new Decimal(a[16]),
      ycos: new Decimal(a[17]),
      ycost: new Decimal(a[18]),
      zsin: new Decimal(a[19]),
      zsint: new Decimal(a[20]),
      zcos: new Decimal(a[21]),
      zcost: new Decimal(a[22])
    } : {
      L2: a[0],
      L3: a[1],
      L4: a[2],
      L5: a[3],
      L6: a[4],
      L7: a[5],
      L8: a[6],
      Ldash: a[7],
      D: a[8],
      Mdash: a[9],
      F: a[10],
      xsin: a[11],
      xsint: a[12],
      xcos: a[13],
      xcost: a[14],
      ysin: a[15],
      ysint: a[16],
      ycos: a[17],
      ycost: a[18],
      zsin: a[19],
      zsint: a[20],
      zcos: a[21],
      zcost: a[22]
    }
  })
}
