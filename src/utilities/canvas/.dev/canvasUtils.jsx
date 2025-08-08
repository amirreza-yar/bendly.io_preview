// canvasUtils.ts

import { util, Point, Line, Path, Text, Group, Rect } from 'fabric'

/**
 * Calculates the Euclidean distance between line endpoints.
 */
export const calculateLineLength = (line) => {
  const { x1, y1, x2, y2 } = line
  const dx = x2 - x1
  const dy = y2 - y1
  return Math.sqrt(dx * dx + dy * dy)
}

function rotatePoint(x, y, origin, angleRad) {
  const dx = x - origin.x
  const dy = y - origin.y
  return {
    x: origin.x + dx * Math.cos(angleRad) - dy * Math.sin(angleRad),
    y: origin.y + dx * Math.sin(angleRad) + dy * Math.cos(angleRad),
  }
}

/**
 * Rotates multiple Fabric objects around a given point.
 */
export function rotateObjectsAroundPoint(objects, rotationPoint, angle) {
  const angleRad = util.degreesToRadians(angle)

  objects.forEach((obj) => {
    if (obj.type === 'line' || obj instanceof Line) {
      const p1 = rotatePoint(obj.x1, obj.y1, rotationPoint, angleRad)
      const p2 = rotatePoint(obj.x2, obj.y2, rotationPoint, angleRad)
      obj.set({ x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y, angle: 0 })
    } else {
      const center = obj.getCenterPoint()
      const dx = center.x - rotationPoint.x
      const dy = center.y - rotationPoint.y
      const rotatedX = dx * Math.cos(angleRad) - dy * Math.sin(angleRad)
      const rotatedY = dx * Math.sin(angleRad) + dy * Math.cos(angleRad)
      const newCenter = new Point(rotationPoint.x + rotatedX, rotationPoint.y + rotatedY)
      obj.set({ angle: (obj.angle || 0) + angle })
      obj.setPositionByOrigin(newCenter, 'center', 'center')
    }
    obj.setCoords()
  })
}

/**
 * Calculates the signed angle between two lines at a circle vertex.
 */
export function calculateCircleAngle(circle) {
  if (!(circle.line1 && circle.line2)) return null
  const P = circle.getCenterPoint()
  const A =
    circle.line1.circle1 === circle
      ? circle.line1.circle2.getCenterPoint()
      : circle.line1.circle1.getCenterPoint()
  const B =
    circle.line2.circle1 === circle
      ? circle.line2.circle2.getCenterPoint()
      : circle.line2.circle1.getCenterPoint()
  const ux = A.x - P.x,
    uy = A.y - P.y
  const vx = B.x - P.x,
    vy = B.y - P.y
  const lu = Math.hypot(ux, uy),
    lv = Math.hypot(vx, vy)
  if (lu === 0 || lv === 0) return null
  const θ1 = Math.atan2(uy, ux),
    θ2 = Math.atan2(vy, vx)
  let δ = θ2 - θ1
  if (δ <= -Math.PI) δ += 2 * Math.PI
  else if (δ > Math.PI) δ -= 2 * Math.PI
  return {
    delta: δ,
    deg: Math.round((Math.abs(δ) * 180) / Math.PI),
    isAngleInverted: δ >= 0,
  }
}

/**
 * Returns all circles on the canvas.
 */
export function getAllCircles(canvas) {
  return canvas?.getObjects().filter((obj) => obj.type === 'circle') || []
}

/**
 * Returns all main lines with hitboxes on the canvas.
 */
export function getAllMainLines(canvas) {
  return canvas?.getObjects().filter((o) => o.type === 'line' && o.hitboxLine) || []
}

/**
 * Scales a line while maintaining its direction.
 */
export const scaleLine = (line, newLength) => {
  const oldLength = calculateLineLength(line)
  const scaleFactor = newLength / oldLength
  const deltaX = (line.x2 - line.x1) * (scaleFactor - 1)
  const deltaY = (line.y2 - line.y1) * (scaleFactor - 1)
  line.set({ x2: line.x2 + deltaX, y2: line.y2 + deltaY })
  line.setCoords()
  return { deltaX, deltaY }
}

/**
 * Moves connected objects forward by delta, propagating through links.
 */
export const moveObjects = (selectedLine, deltaX, deltaY) => {
  let obj = selectedLine
  obj.hitboxLine.set({ x1: obj.x1, y1: obj.y1, x2: obj.x2, y2: obj.y2 })
  while (obj) {
    if (obj.type === 'line') {
      obj = obj.circle2
      obj.set({ left: obj.left + deltaX, top: obj.top + deltaY })
      obj.line1?.set({ x2: obj.left, y2: obj.top })
      obj.line1?.hitboxLine?.set({ x2: obj.left, y2: obj.top })
      obj.line2?.set({ x1: obj.left, y1: obj.top })
      obj.line2?.hitboxLine?.set({ x1: obj.left, y1: obj.top })
    } else if (obj.type === 'circle') {
      obj = obj.line2
      obj?.set({
        x1: obj.x1 + deltaX,
        y1: obj.y1 + deltaY,
        x2: obj.x2 + deltaX,
        y2: obj.y2 + deltaY,
      })
    }
    obj?.setCoords()
  }
}

/**
 * Checks for line intersection excluding neighboring lines.
 */
export function hasAnyOverlap(canvas) {
  const lines = canvas.getObjects().filter((o) => o.type === 'line' && o.hitboxLine)

  function segmentsIntersect(l1, l2) {
    const { x1, y1, x2, y2 } = l1
    const { x1: x3, y1: y3, x2: x4, y2: y4 } = l2
    const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4)
    if (denom === 0) return false
    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom
    const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denom
    return t >= 0 && t <= 1 && u >= 0 && u <= 1
  }

  for (const line of lines) {
    const neighbors = new Set()
    if (line.circle1?.line1) neighbors.add(line.circle1.line1)
    if (line.circle2?.line2) neighbors.add(line.circle2.line2)
    for (const other of lines) {
      if (other === line || neighbors.has(other)) continue
      if (segmentsIntersect(line, other)) return true
    }
  }

  return false
}

/**
 * Recolors the children of an annotation group based on role.
 */
export function customizeAnnotationStyle(annoGroup, { stroke, fill, bgFill, textFill }) {
  annoGroup._objects.forEach((obj) => {
    if (obj instanceof Text) {
      if (textFill) obj.set('fill', textFill)
    } else if (obj instanceof Rect) {
      if (bgFill) obj.set('fill', bgFill)
    } else {
      if (stroke) obj.set('stroke', stroke)
    }
    obj.setCoords()
  })
}

/**
 * Repositions a circle and syncs its connected lines.
 */
export function moveCircle(circle, position) {
  if (position) {
    const { x, y } = position
    circle.set({ left: x, top: y })
  }
  const { left, top } = circle
  circle.line1?.set({ x2: left, y2: top })
  circle.line1?.setCoords()
  circle.line2?.set({ x1: left, y1: top })
  circle.line2?.setCoords()
  circle.setCoords()
}

/**
 * Repositions the hitbox lines connected to a circle.
 */
export function repositionHitboxLine(circle) {
  const { left, top } = circle
  circle.line1?.hitboxLine?.set({ x2: left, y2: top })
  circle.line1?.hitboxLine?.setCoords()
  circle.line2?.hitboxLine?.set({ x1: left, y1: top })
  circle.line2?.hitboxLine?.setCoords()
}
