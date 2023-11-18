import * as b from 'benny'
import { Decimal } from '@'

const value = new Decimal(Math.random())
const valueNum = value.toNumber()

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

  b.cycle(),
  b.complete(),
)
