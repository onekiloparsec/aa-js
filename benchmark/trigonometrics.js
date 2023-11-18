import * as b from 'benny'
import { Decimal, DEG2RAD } from '@'

const value = new Decimal(Math.random())
const valueNum = value.toNumber()
const deg2rad = DEG2RAD.toNumber()

export default b.suite(
  'trigonometrics decimals numbers',

  b.add('Decimal.cos with Decimal value', () => {
    Decimal.cos(value)
  }),
  b.add('Decimal.cos with number value', () => {
    Decimal.cos(valueNum)
  }),
  b.add('Math.cos with Decimal value.toNumber()', () => {
    Math.cos(value.toNumber())
  }),
  b.add('Math.cos with number value', () => {
    Math.cos(valueNum)
  }),

  b.add('value deg2rad decimals then toNumber', () => {
    value.degreesToRadians().toNumber()
  }),
  b.add('value toNumber then deg2rad num', () => {
    value.toNumber() * deg2rad
  }),
  b.add('valueNum deg2rad', () => {
    valueNum * deg2rad
  }),

  b.cycle(),
  b.complete(),
)
