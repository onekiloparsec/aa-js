/**
 @module Coordinates
 */
import { HorizontalCoordinates, Point } from '@/types'
import { DEG2RAD, RAD2DEG } from '@/constants'
import { fmod360 } from '@/utils'

/**
 * Transform a point (x,y) of the sky projected on a disk to horizontal coordinates.
 * @param {Point} point The point on the disk, relative to its center
 * @param {Point} center The center of the disk, relative to a relative origin
 * @param {number} radius The radius of the disk.
 * @returns {HorizontalCoordinates}
 */
export function transformPointToHorizontal (point: Point, center: Point, radius: number): HorizontalCoordinates {
  const x = point.x - center.x
  const y = point.y - center.y
  const d = Math.sqrt(x * x + y * y)
  return {
    azimuth: fmod360(-1 * (Math.atan2(y, x) * RAD2DEG) - 270),
    altitude: 90.0 * (1 - d / radius)
  }
}

/**
 * Transform horizontal coordinates to a point (x,y) of the sky projected on a disk.
 * @param {HorizontalCoordinates} horCoords The horizontal coordinates of the target
 * @param {Point} center The center of the disk, relative to a relative origin
 * @param {number} radius The radius of the disk.
 * @returns {Point}
 */
export function transformHorizontalToPoint (horCoords: HorizontalCoordinates, center: Point, radius: number): Point {
  const x = (90 - horCoords.altitude) * Math.cos((horCoords.azimuth - 90) * DEG2RAD) / 90 * radius
  const y = (90 - horCoords.altitude) * Math.sin((horCoords.azimuth - 90) * DEG2RAD) / 90 * radius
  if (x > radius || y > radius || horCoords.altitude < 0.0) {
    return { x: 0, y: 0 }
  }
  return { x: Math.round(center.x + x), y: Math.round(center.y - y) }
}
