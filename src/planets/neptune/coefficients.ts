import Decimal from '@/decimal'
import { PlanetCoefficient, PlanetCoefficientNum } from '@/types'

export const getCoefficientsL0 = function (useDecimals: boolean = true): (PlanetCoefficient | PlanetCoefficientNum)[] {
  return [
    [531188633, 0, 0],
    [1798476, 2.9010127, 38.1330356],
    [1019728, 0.4858092, 1.4844727],
    [124532, 4.830081, 36.648563],
    [42064, 5.41055, 2.96895],
    [37715, 6.09222, 35.16409],
    [33785, 1.24489, 76.26607],
    [16483, 0.00008, 491.55793],
    [9199, 4.9375, 39.6175],
    [8994, 0.2746, 175.1661],
    [4216, 1.9871, 73.2971],
    [3365, 1.0359, 33.6796],
    [2285, 4.2061, 4.4534],
    [1434, 2.7834, 74.7816],
    [900, 2.076, 109.946],
    [745, 3.190, 71.813],
    [506, 5.748, 114.399],
    [400, 0.350, 1021.249],
    [345, 3.462, 41.102],
    [340, 3.304, 77.751],
    [323, 2.248, 32.195],
    [306, 0.497, 0.521],
    [287, 4.505, 0.048],
    [282, 2.246, 146.594],
    [267, 4.889, 0.963],
    [252, 5.782, 388.465],
    [245, 1.247, 9.561],
    [233, 2.505, 137.033],
    [227, 1.797, 453.425],
    [170, 3.324, 108.461],
    [151, 2.192, 33.940],
    [150, 2.997, 5.938],
    [148, 0.859, 111.430],
    [119, 3.677, 2.448],
    [109, 2.416, 183.243],
    [103, 0.041, 0.261],
    [103, 4.404, 70.328],
    [102, 5.705, 0.112]
  ].map((a) => {
    return useDecimals ?
      { A: new Decimal(a[0]), B: new Decimal(a[1]), C: new Decimal(a[2]) } :
      { A: a[0], B: a[1], C: a[2] }
  })
}

export const getCoefficientsL1 = function (useDecimals: boolean = true): (PlanetCoefficient | PlanetCoefficientNum)[] {
  return [
    [3837687717.0, 0, 0],
    [16604, 4.86319, 1.48447],
    [15807, 2.27923, 38.13304],
    [3335, 3.6820, 76.2661],
    [1306, 3.6732, 2.9689],
    [605, 1.505, 35.164],
    [179, 3.453, 39.618],
    [107, 2.451, 4.453],
    [106, 2.755, 33.680],
    [73, 5.49, 36.65],
    [57, 1.86, 114.40],
    [57, 5.22, 0.52],
    [35, 4.52, 74.78],
    [32, 5.90, 77.75],
    [30, 3.67, 388.47],
    [29, 5.17, 9.56],
    [29, 5.17, 2.45],
    [26, 5.25, 168.05]
  ].map((a) => {
    return useDecimals ?
      { A: new Decimal(a[0]), B: new Decimal(a[1]), C: new Decimal(a[2]) } :
      { A: a[0], B: a[1], C: a[2] }
  })
}

export const getCoefficientsL2 = function (useDecimals: boolean = true): (PlanetCoefficient | PlanetCoefficientNum)[] {
  return [
    [53893, 0, 0],
    [296, 1.855, 1.484],
    [281, 1.191, 38.133],
    [270, 5.721, 76.266],
    [23, 1.21, 2.97],
    [9, 4.43, 35.16],
    [7, 0.54, 2.45]
  ].map((a) => {
    return useDecimals ?
      { A: new Decimal(a[0]), B: new Decimal(a[1]), C: new Decimal(a[2]) } :
      { A: a[0], B: a[1], C: a[2] }
  })
}

export const getCoefficientsL3 = function (useDecimals: boolean = true): (PlanetCoefficient | PlanetCoefficientNum)[] {
  return [
    [31, 0, 0],
    [15, 1.35, 76.27],
    [12, 6.04, 1.48],
    [12, 6.11, 38.13]
  ].map((a) => {
    return useDecimals ?
      { A: new Decimal(a[0]), B: new Decimal(a[1]), C: new Decimal(a[2]) } :
      { A: a[0], B: a[1], C: a[2] }
  })
}

export const getCoefficientsL4 = function (useDecimals: boolean = true): (PlanetCoefficient | PlanetCoefficientNum)[] {
  return [
    [114, 3.142, 0]
  ].map((a) => {
    return useDecimals ?
      { A: new Decimal(a[0]), B: new Decimal(a[1]), C: new Decimal(a[2]) } :
      { A: a[0], B: a[1], C: a[2] }
  })
}

export const getCoefficientsB0 = function (useDecimals: boolean = true): (PlanetCoefficient | PlanetCoefficientNum)[] {
  return [
    [3088623, 1.4410437, 38.1330356],
    [27780, 5.91272, 76.26607],
    [27624, 0, 0],
    [15448, 3.50877, 39.61751],
    [15355, 2.52124, 36.64856],
    [2000, 1.5100, 74.7816],
    [1968, 4.3778, 1.4845],
    [1015, 3.2156, 35.1641],
    [606, 2.802, 73.297],
    [595, 2.129, 41.102],
    [589, 3.187, 2.969],
    [402, 4.169, 114.399],
    [280, 1.682, 77.751],
    [262, 3.767, 213.299],
    [254, 3.271, 453.425],
    [206, 4.257, 529.691],
    [140, 3.530, 137.033]
  ].map((a) => {
    return useDecimals ?
      { A: new Decimal(a[0]), B: new Decimal(a[1]), C: new Decimal(a[2]) } :
      { A: a[0], B: a[1], C: a[2] }
  })
}

export const getCoefficientsB1 = function (useDecimals: boolean = true): (PlanetCoefficient | PlanetCoefficientNum)[] {
  return [
    [227279, 3.807931, 38.133036],
    [1803, 1.9758, 76.2661],
    [1433, 3.1416, 0],
    [1386, 4.8256, 36.6486],
    [1073, 6.0805, 39.6175],
    [148, 3.858, 74.782],
    [136, 0.478, 1.484],
    [70, 6.19, 35.16],
    [52, 5.05, 73.30],
    [43, 0.31, 114.40],
    [37, 4.89, 41.10],
    [37, 5.76, 2.97],
    [26, 5.22, 213.30]
  ].map((a) => {
    return useDecimals ?
      { A: new Decimal(a[0]), B: new Decimal(a[1]), C: new Decimal(a[2]) } :
      { A: a[0], B: a[1], C: a[2] }
  })
}

export const getCoefficientsB2 = function (useDecimals: boolean = true): (PlanetCoefficient | PlanetCoefficientNum)[] {
  return [
    [9691, 5.5712, 38.1330],
    [79, 3.63, 76.27],
    [72, 0.45, 36.65],
    [59, 3.14, 0],
    [30, 1.61, 39.62],
    [6, 5.61, 74.78]
  ].map((a) => {
    return useDecimals ?
      { A: new Decimal(a[0]), B: new Decimal(a[1]), C: new Decimal(a[2]) } :
      { A: a[0], B: a[1], C: a[2] }
  })
}

export const getCoefficientsB3 = function (useDecimals: boolean = true): (PlanetCoefficient | PlanetCoefficientNum)[] {
  return [
    [273, 1.017, 38.133],
    [2, 0, 0],
    [2, 2.37, 36.65],
    [2, 5.33, 76.27]
  ].map((a) => {
    return useDecimals ?
      { A: new Decimal(a[0]), B: new Decimal(a[1]), C: new Decimal(a[2]) } :
      { A: a[0], B: a[1], C: a[2] }
  })
}

export const getCoefficientsB4 = function (useDecimals: boolean = true): (PlanetCoefficient | PlanetCoefficientNum)[] {
  return [
    [6, 2.67, 38.13]
  ].map((a) => {
    return useDecimals ?
      { A: new Decimal(a[0]), B: new Decimal(a[1]), C: new Decimal(a[2]) } :
      { A: a[0], B: a[1], C: a[2] }
  })
}

export const getCoefficientsR0 = function (useDecimals: boolean = true): (PlanetCoefficient | PlanetCoefficientNum)[] {
  return [
    [3007013206.0, 0, 0],
    [27062259, 1.32999459, 38.13303564],
    [1691764, 3.2518614, 36.6485629],
    [807831, 5.185928, 1.484473],
    [537761, 4.521139, 35.164090],
    [495726, 1.571057, 491.557929],
    [274572, 1.845523, 175.166060],
    [135134, 3.372206, 39.617508],
    [121802, 5.797544, 76.266071],
    [100895, 0.377027, 73.297126],
    [69792, 3.79617, 2.96895],
    [46688, 5.74938, 33.67962],
    [24594, 0.50802, 109.94569],
    [16939, 1.59422, 71.81265],
    [14230, 1.07786, 74.78160],
    [12012, 1.92062, 1021.24889],
    [8395, 0.6782, 146.5943],
    [7572, 1.0715, 388.4652],
    [5721, 2.5906, 4.4534],
    [4840, 1.9069, 41.1020],
    [4483, 2.9057, 529.6910],
    [4421, 1.7499, 108.4612],
    [4354, 0.6799, 32.1951],
    [4270, 3.4134, 453.4249],
    [3381, 0.8481, 183.2428],
    [2881, 1.9860, 137.0330],
    [2879, 3.6742, 350.3321],
    [2636, 3.0976, 213.2991],
    [2530, 5.7984, 490.0735],
    [2523, 0.4863, 493.0424],
    [2306, 2.8096, 70.3282],
    [2087, 0.6186, 33.9402]
  ].map((a) => {
    return useDecimals ?
      { A: new Decimal(a[0]), B: new Decimal(a[1]), C: new Decimal(a[2]) } :
      { A: a[0], B: a[1], C: a[2] }
  })
}

export const getCoefficientsR1 = function (useDecimals: boolean = true): (PlanetCoefficient | PlanetCoefficientNum)[] {
  return [
    [236339, 0.704980, 38.133036],
    [13220, 3.32015, 1.48447],
    [8622, 6.2163, 35.1641],
    [2702, 1.8814, 39.6175],
    [2155, 2.0943, 2.9689],
    [2153, 5.1687, 76.2661],
    [1603, 0, 0],
    [1464, 1.1842, 33.6796],
    [1136, 3.9189, 36.6486],
    [898, 5.241, 388.465],
    [790, 0.533, 168.053],
    [760, 0.021, 182.280],
    [607, 1.077, 1021.249],
    [572, 3.401, 484.444],
    [561, 2.887, 498.671]
  ].map((a) => {
    return useDecimals ?
      { A: new Decimal(a[0]), B: new Decimal(a[1]), C: new Decimal(a[2]) } :
      { A: a[0], B: a[1], C: a[2] }
  })
}

export const getCoefficientsR2 = function (useDecimals: boolean = true): (PlanetCoefficient | PlanetCoefficientNum)[] {
  return [
    [4247, 5.8991, 38.1330],
    [218, 0.346, 1.484],
    [163, 2.239, 168.053],
    [156, 4.594, 182.280],
    [127, 2.848, 35.164]
  ].map((a) => {
    return useDecimals ?
      { A: new Decimal(a[0]), B: new Decimal(a[1]), C: new Decimal(a[2]) } :
      { A: a[0], B: a[1], C: a[2] }
  })
}

export const getCoefficientsR3 = function (useDecimals: boolean = true): (PlanetCoefficient | PlanetCoefficientNum)[] {
  return [
    [166, 4.552, 38.133]
  ].map((a) => {
    return useDecimals ?
      { A: new Decimal(a[0]), B: new Decimal(a[1]), C: new Decimal(a[2]) } :
      { A: a[0], B: a[1], C: a[2] }
  })
}
