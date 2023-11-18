/**
 @module Coordinates
 */
import Decimal from '@/decimal'
import { HorizontalCoordinates, HorizontalCoordinatesNum, Point, PointNum } from '@/types'
import { ZERO } from '@/constants'
import { fmod360 } from '@/utils'

/**
 * Transform a point (x,y) of the sky projected on a disk to horizontal coordinates.
 * @param {Point | PointNum} point The point on the disk, relative to its center
 * @param {Point | PointNum} center The center of the disk, relative to a relative origin
 * @param {number} radius The radius of the disk.
 * @returns {HorizontalCoordinates}
 */
export function transformPointToHorizontal (point: Point | PointNum, center: Point | PointNum, radius: number): HorizontalCoordinates {
  const x = new Decimal(point.x).minus(center.x)
  const y = new Decimal(point.y).minus(center.y)
  const d = x.pow(2).plus(y.pow(2)).sqrt()
  return {
    azimuth: fmod360(new Decimal(-1).mul(Decimal.atan2(y, x).radiansToDegrees()).minus(270)),
    altitude: new Decimal(90.0).mul((new Decimal(1).minus(d.dividedBy(radius))))
  }
}

/**
 * Transform horizontal coordinates to a point (x,y) of the sky projected on a disk.
 * @param {HorizontalCoordinates | HorizontalCoordinatesNum} horCoords The horizontal coordinates of the target
 * @param {Point} center The center of the disk, relative to a relative origin
 * @param {number} radius The radius of the disk.
 * @returns {Point}
 */
export function transformHorizontalToPoint (horCoords: HorizontalCoordinates | HorizontalCoordinatesNum, center: Point, radius: number): Point {
  const ninety = new Decimal(90)

  const x = ninety.minus(horCoords.altitude)
    .mul(Decimal.cos((new Decimal(horCoords.azimuth).minus(ninety)).degreesToRadians()))
    .dividedBy(ninety)
    .mul(radius)

  const y = ninety.minus(horCoords.altitude)
    .mul(Decimal.sin((new Decimal(horCoords.azimuth).minus(ninety))).degreesToRadians())
    .dividedBy(ninety)
    .mul(radius)

  if (x.greaterThan(radius) || y.greaterThan(radius) || new Decimal(horCoords.altitude).lessThan(ZERO)) {
    return { x: ZERO, y: ZERO }
  }

  return { x: new Decimal(center.x).plus(x), y: new Decimal(center.y).minus(y) }
}
