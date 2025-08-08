// utils/canvas/annotationUtils.ts

import { Group, Line, Path, Point, Rect, Text } from 'fabric'
import { calculateCircleAngle } from './.dev/canvasUtils'

export function removeAnnotations(canvas) {
  canvas
    .getObjects()
    .filter((obj) => obj._isMeasurement)
    .forEach((obj) => {
      canvas.remove(obj)
    })
}

/**
 * Internal utility to construct an arc+arrow-based angle annotation.
 */
export function createAngleAnnotationObj(ax, ay, px, py, bx, by, options = {}) {
  const {
    radius = 30,
    lineStroke = 1.5,
    arrowInLen = 6,
    arrowInAngle = 30,
    txtOffset = 12,
    color = '#9145E2',
  } = options

  const ux = ax - px,
    uy = ay - py
  const vx = bx - px,
    vy = by - py
  const lu = Math.hypot(ux, uy),
    lv = Math.hypot(vx, vy)
  if (!lu || !lv) return null

  const θ1 = Math.atan2(uy, ux),
    θ2 = Math.atan2(vy, vx)
  let δ = θ2 - θ1
  if (δ <= -Math.PI) δ += 2 * Math.PI
  else if (δ > Math.PI) δ -= 2 * Math.PI

  const isAngleInverted = δ >= 0
  const deg = Math.round((Math.abs(δ) * 180) / Math.PI)

  const sweepFlag = isAngleInverted ? 1 : 0
  const xS = px + radius * Math.cos(θ1)
  const yS = py + radius * Math.sin(θ1)
  const xE = px + radius * Math.cos(θ1 + δ)
  const yE = py + radius * Math.sin(θ1 + δ)

  const arc = new Path(
    [
      ['M', xS, yS],
      ['A', radius, radius, 0, 0, sweepFlag, xE, yE],
    ],
    {
      stroke: color,
      strokeWidth: lineStroke,
      fill: null,
      selectable: false,
    },
  )

  function makeArrowLines(x, y, tangentAngle) {
    const rad1 = tangentAngle + (arrowInAngle * Math.PI) / 180
    const rad2 = tangentAngle - (arrowInAngle * Math.PI) / 180
    return [rad1, rad2].map(
      (a) =>
        new Line([x, y, x + arrowInLen * Math.cos(a), y + arrowInLen * Math.sin(a)], {
          stroke: color,
          strokeWidth: lineStroke,
          strokeLineCap: 'round',
          selectable: false,
        }),
    )
  }

  const midAngle = θ1 + δ / 2
  const tx = px + (radius + txtOffset) * Math.cos(midAngle)
  const ty = py + (radius + txtOffset) * Math.sin(midAngle)
  let textAngle = (midAngle * 180) / Math.PI + 90
  if (textAngle > 90 || textAngle < -90) textAngle += 180

  const txt = new Text(`${deg}°`, {
    left: tx,
    top: ty,
    originX: 'center',
    originY: 'center',
    fontFamily: 'Roboto Flex',
    fontWeight: '500',
    fontSize: 8,
    lineHeight: 10 / 8,
    fill: 'white',
    angle: textAngle,
    selectable: false,
  })

  const bg = new Rect({
    left: tx,
    top: ty,
    width: txt.width + 4,
    height: 13,
    originX: 'center',
    originY: 'center',
    rx: 4,
    fill: color,
    angle: textAngle,
    selectable: false,
  })

  const [startA1, startA2] = makeArrowLines(xS, yS, θ1 + Math.PI / 2)
  const [endA1, endA2] = makeArrowLines(xE, yE, θ1 + δ - Math.PI / 2)

  const group = new Group([arc, startA1, startA2, endA1, endA2, bg, txt], {
    selectable: true,
    hasControls: false,
    hasBorders: false,
    lockRotation: true,
    lockScalingX: true,
    lockScalingY: true,
    lockMovementX: true,
    lockMovementY: true,
    _isMeasurement: true,
    _measurementType: 'angle',
  })

  group.mid = new Point(tx, ty)
  group.δAbs = Math.abs(δ)

  return { angAnno: group, deg, isAngleInverted }
}

/**
 * Applies styling to an annotation group.
 */
export function styleAnnotationGroup(group, mode = 'default') {
  const stylePresets = {
    default: { stroke: '#E50000', bgFill: '#E50000', textFill: 'white' },
    active: { stroke: '#3355FF', bgFill: '#3355FF', textFill: 'white' },
    highlight: {
      stroke: 'rgba(51, 85, 255, 1)',
      bgFill: 'rgba(51, 85, 255, 1)',
      textFill: 'white',
    },
  }

  const style = stylePresets[mode] || stylePresets.default

  group._objects.forEach((obj) => {
    if (obj instanceof Text) {
      obj.set({ fill: style.textFill })
    } else if (obj instanceof Rect) {
      obj.set({ fill: style.bgFill })
    } else {
      obj.set({ stroke: style.stroke })
    }
    obj.setCoords()
  })
}

/**
 * Creates an angle annotation group for a given circle.
 */
export function createAngleAnnotationForCircle(circle, options = {}) {
  if (!(circle.line1 && circle.line2)) return null

  const defaultColor = options.color || '#9145E2'
  const P = circle.getCenterPoint()
  const A =
    circle.line1.circle1 === circle
      ? circle.line1.circle2.getCenterPoint()
      : circle.line1.circle1.getCenterPoint()
  const B =
    circle.line2.circle1 === circle
      ? circle.line2.circle2.getCenterPoint()
      : circle.line2.circle1.getCenterPoint()

  const { angAnno, deg, isAngleInverted } = createAngleAnnotationObj(A.x, A.y, P.x, P.y, B.x, B.y, {
    ...options,
    color: defaultColor,
  })

  if (!angAnno) return null

  angAnno.mainCircle = circle
  angAnno.isAngleInverted = isAngleInverted
  angAnno._measurementType = 'angle'
  angAnno.perPixelTargetFind = true
  circle.angleAnno = angAnno
  circle.angle = deg
  circle.isAngleInverted = isAngleInverted

  return angAnno
}

/**
 * Creates a length annotation group for a line.
 */
export function createLengthAnnotationForLine(
  canvas,
  line,
  prevAnno = null,
  nextAnno = null,
  options = {},
) {
  const { baseOffset = 10, color = '#E50000' } = options
  const { x1, y1, x2, y2 } = line
  const dx = x2 - x1,
    dy = y2 - y1
  const length = Math.hypot(dx, dy)
  if (length === 0) return null

  const n1 = { x: -dy / length, y: dx / length }
  const n2 = { x: dy / length, y: -dx / length }

  function countOnSide(normal) {
    let c = 0
    ;[prevAnno, nextAnno].forEach((anno) => {
      if (!anno) return
      const mx = (x1 + x2) / 2,
        my = (y1 + y2) / 2
      const vx = anno.mid.x - mx,
        vy = anno.mid.y - my
      if (vx * normal.x + vy * normal.y > 0) c++
    })
    return c
  }

  const c1 = countOnSide(n1),
    c2 = countOnSide(n2)
  let normal = c1 < c2 ? n1 : c2 < c1 ? n2 : n1

  const mx = (x1 + x2) / 2,
    my = (y1 + y2) / 2
  const p1 = new Point(x1 + normal.x * baseOffset, y1 + normal.y * baseOffset)
  const p2 = new Point(x2 + normal.x * baseOffset, y2 + normal.y * baseOffset)
  const q1 = new Point(p1.x, p1.y),
    q2 = new Point(p2.x, p2.y)

  const dimLine = new Line([q1.x, q1.y, q2.x, q2.y], {
    stroke: color,
    strokeWidth: 0.5,
    strokeLineCap: 'round',
    selectable: false,
  })

  function makeArrow(pt, dirX, dirY, inverted) {
    const tangent = Math.atan2(dirY, dirX)
    const arrowLen = 4
    const angles = inverted ? [30, -30] : [210, -210]
    return angles.map((a) => {
      const rad = (Math.PI / 180) * a + Math.PI
      return new Line(
        [
          pt.x,
          pt.y,
          pt.x + arrowLen * Math.cos(tangent + rad),
          pt.y + arrowLen * Math.sin(tangent + rad),
        ],
        {
          stroke: color,
          strokeWidth: 0.5,
          strokeLineCap: 'round',
          selectable: false,
        },
      )
    })
  }

  const ux = dx / length,
    uy = dy / length
  const [a1, a2] = makeArrow(q1, ux, uy)
  const [a3, a4] = makeArrow(q2, ux, uy, true)

  const tickLen = 5
  const tick1 = new Line(
    [
      p1.x - (normal.x * tickLen) / 2,
      p1.y - (normal.y * tickLen) / 2,
      p1.x + (normal.x * tickLen) / 2,
      p1.y + (normal.y * tickLen) / 2,
    ],
    {
      stroke: color,
      strokeWidth: 0.5,
      selectable: false,
      strokeLineCap: 'round',
    },
  )
  const tick2 = new Line(
    [
      p2.x - (normal.x * tickLen) / 2,
      p2.y - (normal.y * tickLen) / 2,
      p2.x + (normal.x * tickLen) / 2,
      p2.y + (normal.y * tickLen) / 2,
    ],
    {
      stroke: color,
      strokeWidth: 0.5,
      selectable: false,
      strokeLineCap: 'round',
    },
  )

  let angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI
  if (angleDeg > 90 || angleDeg < -90) angleDeg += 180

  const tx = mx + normal.x * baseOffset
  const ty = my + normal.y * baseOffset
  const txt = new Text(`${Math.round(length)}`, {
    left: tx,
    top: ty,
    originX: 'center',
    originY: 'center',
    fontFamily: 'Roboto Flex',
    fontWeight: '500',
    fontSize: 8,
    lineHeight: 10 / 8,
    fill: 'white',
    angle: angleDeg,
    selectable: false,
  })
  const bg = new Rect({
    left: tx,
    top: ty,
    originX: 'center',
    originY: 'center',
    width: txt.width + 4,
    height: 10,
    rx: 4,
    fill: color,
    angle: angleDeg,
    selectable: false,
  })

  const group = new Group([dimLine, tick1, tick2, a1, a2, a3, a4, bg, txt], {
    selectable: true,
    hasControls: false,
    hasBorders: false,
    lockRotation: true,
    lockScalingX: true,
    lockScalingY: true,
    lockMovementX: true,
    lockMovementY: true,
    _isMeasurement: true,
    _measurementType: 'length',
  })

  group.mainLine = line
  group.perPixelTargetFind = true

  return group
}
