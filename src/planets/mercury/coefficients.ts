import Decimal from '@/decimal'
import { PlanetCoefficient, PlanetCoefficientNum } from '@/types'

export const getCoefficientsL0 = function (useDecimals: boolean = true): (PlanetCoefficient | PlanetCoefficientNum)[] {
  return [
    [440250710, 0, 0],
    [40989415, 1.48302034, 26087.90314157],
    [5046294, 4.4778549, 52175.8062831],
    [855347, 1.165203, 78263.709425],
    [165590, 4.119692, 104351.612566],
    [34562, 0.77931, 130439.51571],
    [7583, 3.7135, 156527.4188],
    [3560, 1.5120, 1109.3786],
    [1803, 4.1033, 5661.3320],
    [1726, 0.3583, 182615.3220],
    [1590, 2.9951, 25028.5212],
    [1365, 4.5992, 27197.2817],
    [1017, 0.8803, 31749.2352],
    [714, 1.541, 24978.525],
    [644, 5.303, 21535.950],
    [451, 6.050, 51116.424],
    [404, 3.282, 208703.225],
    [352, 5.242, 20426.571],
    [345, 2.792, 15874.618],
    [343, 5.765, 955.600],
    [339, 5.863, 25558.212],
    [325, 1.337, 53285.185],
    [273, 2.495, 529.691],
    [264, 3.917, 57837.138],
    [260, 0.987, 4551.953],
    [239, 0.113, 1059.382],
    [235, 0.267, 11322.664],
    [217, 0.660, 13521.751],
    [209, 2.092, 47623.853],
    [183, 2.629, 27043.503],
    [182, 2.434, 25661.305],
    [176, 4.536, 51066.428],
    [173, 2.452, 24498.830],
    [142, 3.360, 37410.567],
    [138, 0.291, 10213.286],
    [125, 3.721, 39609.655],
    [118, 2.781, 77204.327],
    [106, 4.206, 19804.827]
  ].map((a) => {
    return useDecimals ?
      { A: new Decimal(a[0]), B: new Decimal(a[1]), C: new Decimal(a[2]) } :
      { A: a[0], B: a[1], C: a[2] }
  })
}

export const getCoefficientsL1 = function (useDecimals: boolean = true): (PlanetCoefficient | PlanetCoefficientNum)[] {
  return [
    [2608814706223.0, 0, 0],
    [1126008, 6.2170397, 26087.9031416],
    [303471, 3.055655, 52175.806283],
    [80538, 6.10455, 78263.70942],
    [21245, 2.83532, 104351.61257],
    [5592, 5.8268, 130439.5157],
    [1472, 2.5185, 156527.4188],
    [388, 5.480, 182615.322],
    [352, 3.052, 1109.379],
    [103, 2.149, 208703.225],
    [94, 6.12, 27197.28],
    [91, 0.00, 24978.52],
    [52, 5.62, 5661.33],
    [44, 4.57, 25028.52],
    [28, 3.04, 51066.43],
    [27, 5.09, 234791.13]
  ].map((a) => {
    return useDecimals ?
      { A: new Decimal(a[0]), B: new Decimal(a[1]), C: new Decimal(a[2]) } :
      { A: a[0], B: a[1], C: a[2] }
  })
}

export const getCoefficientsL2 = function (useDecimals: boolean = true): (PlanetCoefficient | PlanetCoefficientNum)[] {
  return [
    [53050, 0, 0],
    [16904, 4.69072, 26087.90314],
    [7397, 1.3474, 52175.8063],
    [3018, 4.4564, 78263.7094],
    [1107, 1.2623, 104351.6126],
    [378, 4.320, 130439.516],
    [123, 1.069, 156527.419],
    [39, 4.08, 182615.32],
    [15, 4.63, 1109.38],
    [12, 0.79, 208703.23]
  ].map((a) => {
    return useDecimals ?
      { A: new Decimal(a[0]), B: new Decimal(a[1]), C: new Decimal(a[2]) } :
      { A: a[0], B: a[1], C: a[2] }
  })
}

export const getCoefficientsL3 = function (useDecimals: boolean = true): (PlanetCoefficient | PlanetCoefficientNum)[] {
  return [
    [188, 0.035, 52175.806],
    [142, 3.125, 26087.903],
    [97, 3.00, 78263.71],
    [44, 6.02, 104351.61],
    [35, 0, 0],
    [18, 2.78, 130439.52],
    [7, 5.82, 156527.42],
    [3, 2.57, 182615.32]
  ].map((a) => {
    return { A: new Decimal(a[0]), B: new Decimal(a[1]), C: new Decimal(a[2]) }
  })
}

export const getCoefficientsL4 = function (useDecimals: boolean = true): (PlanetCoefficient | PlanetCoefficientNum)[] {
  return [
    [114, 3.1416, 0],
    [3, 2.03, 26087.90],
    [2, 1.42, 78263.71],
    [2, 4.50, 52175.81],
    [1, 4.50, 104351.61],
    [1, 1.27, 130439.52]
  ].map((a) => {
    return { A: new Decimal(a[0]), B: new Decimal(a[1]), C: new Decimal(a[2]) }
  })
}

export const getCoefficientsL5 = function (useDecimals: boolean = true): (PlanetCoefficient | PlanetCoefficientNum)[] {
  return [
    [1, 3.14, 0]
  ].map((a) => {
    return { A: new Decimal(a[0]), B: new Decimal(a[1]), C: new Decimal(a[2]) }
  })
}

export const getCoefficientsB0 = function (useDecimals: boolean = true): (PlanetCoefficient | PlanetCoefficientNum)[] {
  return [
    [11737529, 1.98357499, 26087.90314157],
    [2388077, 5.0373896, 52175.8062831],
    [1222840, 3.1415927, 0],
    [543252, 1.796444, 78263.709425],
    [129779, 4.832325, 104351.612566],
    [31867, 1.58088, 130439.51571],
    [7963, 4.6097, 156527.4188],
    [2014, 1.3532, 182615.3220],
    [514, 4.378, 208703.225],
    [209, 2.020, 24978.525],
    [208, 4.918, 27197.282],
    [132, 1.119, 234791.128],
    [121, 1.813, 53285.185],
    [100, 5.657, 20426.571]
  ].map((a) => {
    return { A: new Decimal(a[0]), B: new Decimal(a[1]), C: new Decimal(a[2]) }
  })
}

export const getCoefficientsB1 = function (useDecimals: boolean = true): (PlanetCoefficient | PlanetCoefficientNum)[] {
  return [
    [429151, 3.501698, 26087.903142],
    [146234, 3.141593, 0],
    [22675, 0.01515, 52175.80628],
    [10895, 0.48540, 78263.70942],
    [6353, 3.4294, 104351.6126],
    [2496, 0.1605, 130439.5157],
    [860, 3.185, 156527.419],
    [278, 6.210, 182615.322],
    [86, 2.95, 208703.23],
    [28, 0.29, 27197.28],
    [26, 5.98, 234791.13]
  ].map((a) => {
    return { A: new Decimal(a[0]), B: new Decimal(a[1]), C: new Decimal(a[2]) }
  })
}

export const getCoefficientsB2 = function (useDecimals: boolean = true): (PlanetCoefficient | PlanetCoefficientNum)[] {
  return [
    [11831, 4.79066, 26087.90314],
    [1914, 0, 0],
    [1045, 1.2122, 52175.8063],
    [266, 4.434, 78263.709],
    [170, 1.623, 104351.613],
    [96, 4.80, 130439.52],
    [45, 1.61, 156527.42],
    [18, 4.67, 182615.32],
    [7, 1.43, 208703.23]
  ].map((a) => {
    return { A: new Decimal(a[0]), B: new Decimal(a[1]), C: new Decimal(a[2]) }
  })
}

export const getCoefficientsB3 = function (useDecimals: boolean = true): (PlanetCoefficient | PlanetCoefficientNum)[] {
  return [
    [235, 0.354, 26087.903],
    [161, 0, 0],
    [19, 4.36, 52175.81],
    [6, 2.51, 78263.71],
    [5, 6.14, 104351.61],
    [3, 3.12, 130439.52],
    [2, 6.27, 156527.42]
  ].map((a) => {
    return { A: new Decimal(a[0]), B: new Decimal(a[1]), C: new Decimal(a[2]) }
  })
}

export const getCoefficientsB4 = function (useDecimals: boolean = true): (PlanetCoefficient | PlanetCoefficientNum)[] {
  return [
    [4, 1.75, 26087.90],
    [1, 3.14, 0]
  ].map((a) => {
    return { A: new Decimal(a[0]), B: new Decimal(a[1]), C: new Decimal(a[2]) }
  })
}

export const getCoefficientsR0 = function (useDecimals: boolean = true): (PlanetCoefficient | PlanetCoefficientNum)[] {
  return [
    [39528272, 0, 0],
    [7834132, 6.1923372, 26087.9031416],
    [795526, 2.959897, 52175.806283],
    [121282, 6.010642, 78263.709425],
    [21922, 2.77820, 104351.61257],
    [4354, 5.8289, 130439.5157],
    [918, 2.597, 156527.419],
    [290, 1.424, 25028.521],
    [260, 3.028, 27197.282],
    [202, 5.647, 182615.322],
    [201, 5.592, 31749.235],
    [142, 6.253, 24978.525],
    [100, 3.734, 21535.950]
  ].map((a) => {
    return { A: new Decimal(a[0]), B: new Decimal(a[1]), C: new Decimal(a[2]) }
  })
}

export const getCoefficientsR1 = function (useDecimals: boolean = true): (PlanetCoefficient | PlanetCoefficientNum)[] {
  return [
    [217348, 4.656172, 26087.903142],
    [44142, 1.42386, 52175.80628],
    [10094, 4.47466, 78263.70942],
    [2433, 1.2423, 104351.6126],
    [1624, 0, 0],
    [604, 4.293, 130439.516],
    [153, 1.061, 156527.419],
    [39, 4.11, 182615.32]
  ].map((a) => {
    return { A: new Decimal(a[0]), B: new Decimal(a[1]), C: new Decimal(a[2]) }
  })
}

export const getCoefficientsR2 = function (useDecimals: boolean = true): (PlanetCoefficient | PlanetCoefficientNum)[] {
  return [
    [3118, 3.0823, 26087.9031],
    [1245, 6.1518, 52175.8063],
    [425, 2.926, 78263.709],
    [136, 5.980, 104351.613],
    [42, 2.75, 130439.52],
    [22, 3.14, 0],
    [13, 5.80, 156527.42]
  ].map((a) => {
    return { A: new Decimal(a[0]), B: new Decimal(a[1]), C: new Decimal(a[2]) }
  })
}

export const getCoefficientsR3 = function (useDecimals: boolean = true): (PlanetCoefficient | PlanetCoefficientNum)[] {
  return [
    [33, 1.68, 26087.90],
    [24, 4.63, 52175.81],
    [12, 1.39, 78263.71],
    [5, 4.44, 104351.61],
    [2, 1.21, 130439.52]
  ].map((a) => {
    return { A: new Decimal(a[0]), B: new Decimal(a[1]), C: new Decimal(a[2]) }
  })
}
