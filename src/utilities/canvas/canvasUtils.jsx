// "use client";
import { util, Point, Line, Path, Text, Group, Rect } from 'fabric'
// import { useCanvasContext } from "@/providers/canvasContextProvider";

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
 * Rotate any FabricJS objects _around_ rotationPoint by `angle` degrees.
 * Lines will have their endpoints rotated but will keep `angle = 0`.
 */
export function rotateObjectsAroundPoint(objects, rotationPoint, angle) {
  const angleRad = util.degreesToRadians(angle)

  objects.forEach((obj) => {
    if (obj.type === 'line' || obj instanceof Line) {
      // --- rotate the endpoints, leave angle at 0 ---
      const p1 = rotatePoint(obj.x1, obj.y1, rotationPoint, angleRad)
      const p2 = rotatePoint(obj.x2, obj.y2, rotationPoint, angleRad)
      obj.set({
        x1: p1.x,
        y1: p1.y,
        x2: p2.x,
        y2: p2.y,
        angle: 0, // ensure no residual rotation
      })
      obj.setCoords()
    } else {
      // --- generic object: rotate via center + angle property ---
      const center = obj.getCenterPoint()
      const dx = center.x - rotationPoint.x
      const dy = center.y - rotationPoint.y
      const rotatedX = dx * Math.cos(angleRad) - dy * Math.sin(angleRad)
      const rotatedY = dx * Math.sin(angleRad) + dy * Math.cos(angleRad)
      const newCenter = new Point(rotationPoint.x + rotatedX, rotationPoint.y + rotatedY)

      obj.set({
        angle: (obj.angle || 0) + angle,
      })
      obj.setPositionByOrigin(newCenter, 'center', 'center')
      obj.setCoords()
    }
  })
}

export function createAngleAnnotationObj(ax, ay, px, py, bx, by, options = {}) {
  let {
    radius = 30,
    lineStroke = 1.5,
    arrowInLen = 6,
    arrowInAngle = 30,
    txtOffset = 12,
    color = '#9145E2',
  } = options
  // compute vectors & lengths
  const ux = ax - px,
    uy = ay - py,
    vx = bx - px,
    vy = by - py
  const lu = Math.hypot(ux, uy),
    lv = Math.hypot(vx, vy)
  if (!lu || !lv) return null

  // angles & delta
  const θ1 = Math.atan2(uy, ux),
    θ2 = Math.atan2(vy, vx)
  let δ = θ2 - θ1
  if (δ <= -Math.PI) δ += 2 * Math.PI
  else if (δ > Math.PI) δ -= 2 * Math.PI

  const isAngleInverted = δ >= 0 ? true : false

  const deg = Math.round((Math.abs(δ) * 180) / Math.PI)

  if (30 < deg && deg < 45) {
    txtOffset = 20
    arrowInLen = 5
  } else if (deg < 31) {
    txtOffset = 35
    arrowInLen = 4
  }

  // check for (approximately) 90°
  const EPS = 0.005 // ~0.3°
  if (Math.abs(Math.abs(δ) - Math.PI / 2) < EPS) {
    // right‐angle marker
    const markerLen = radius * 0.8 // adjust for size
    const uNx = ux / lu,
      uNy = uy / lu
    const vNx = vx / lv,
      vNy = vy / lv

    // points: along each arm, and the corner of the little square
    const p_u = new Point(px + uNx * markerLen, py + uNy * markerLen)
    const p_v = new Point(px + vNx * markerLen, py + vNy * markerLen)
    const p_uv = new Point(px + (uNx + vNx) * markerLen, py + (uNy + vNy) * markerLen)

    const line1 = new Line([p_u.x, p_u.y, p_uv.x, p_uv.y], {
      stroke: color,
      strokeLineCap: 'round',
      strokeWidth: lineStroke,
      selectable: false,
    })
    const line2 = new Line([p_v.x, p_v.y, p_uv.x, p_uv.y], {
      stroke: color,
      strokeLineCap: 'round',
      strokeWidth: lineStroke,
      selectable: false,
    })

    const angAnno = new Group([line1, line2], {
      selectable: true,

      hasControls: false,
      hasBorders: false,
      lockRotation: true,
      lockScalingX: true,
      lockScalingY: true,
      lockMovementX: true,
      lockMovementY: true,

      _isMeasurement: true,
      _measurementType: 'angle_right',
    })

    angAnno.mid = p_u
    angAnno.δAbs = Math.abs(δ)

    return { angAnno, deg, isAngleInverted }
  }

  // … else fall back to your curved‐arc + arrows + text version …

  // 1) curved arc
  const startAngle = θ1,
    endAngle = θ1 + δ,
    sweepFlag = δ >= 0 ? 1 : 0
  const xS = px + radius * Math.cos(startAngle),
    yS = py + radius * Math.sin(startAngle),
    xE = px + radius * Math.cos(endAngle),
    yE = py + radius * Math.sin(endAngle)

  const arc = new Path(
    [
      ['M', xS, yS],
      ['A', radius, radius, 0, 0, sweepFlag, xE, yE],
    ],
    {
      stroke: color,
      strokeWidth: lineStroke,
      strokeLineCap: 'round',
      selectable: false,
      fill: null,
    },
  )

  // 2) arrows at ends
  const arrowLen = arrowInLen,
    arrowAngle = arrowInAngle * (Math.PI / 180)

  function makeArrowLines(x, y, tangent) {
    const a1 = tangent + arrowAngle,
      a2 = tangent - arrowAngle
    return [
      new Line([x, y, x + arrowLen * Math.cos(a1), y + arrowLen * Math.sin(a1)], {
        stroke: color,
        strokeWidth: lineStroke,
        strokeLineCap: 'round',
        selectable: false,
      }),
      new Line([x, y, x + arrowLen * Math.cos(a2), y + arrowLen * Math.sin(a2)], {
        stroke: color,
        strokeWidth: lineStroke,
        strokeLineCap: 'round',
        selectable: false,
      }),
    ]
  }
  const tangentStart = startAngle + (δ >= 0 ? Math.PI / 2 : -Math.PI / 2),
    tangentEnd = endAngle - (δ >= 0 ? Math.PI / 2 : -Math.PI / 2)
  const [s1, s2] = makeArrowLines(xS, yS, tangentStart),
    [e1, e2] = makeArrowLines(xE, yE, tangentEnd)

  // 3) text + background
  const mid = (startAngle + endAngle) / 2,
    txtOff = radius + txtOffset,
    tx = px + txtOff * Math.cos(mid),
    ty = py + txtOff * Math.sin(mid)
  let textAngleDeg = (mid * 180) / Math.PI + 90
  if (textAngleDeg > 90 || textAngleDeg < -90) textAngleDeg += 180

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
    angle: textAngleDeg,
    selectable: false,
  })

  const padding = 3,
    bgW = txt.width + padding * 2,
    bgRect = new Rect({
      width: bgW,
      height: 13,
      rx: 4,
      fill: color,
      originX: 'center',
      originY: 'center',
      left: tx,
      top: ty,
      angle: textAngleDeg,
      selectable: false,
    })

  // 4) group & return
  const angAnno = new Group([arc, s1, s2, e1, e2, bgRect, txt], {
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

  angAnno.mid = new Point(tx, ty) // where you placed the label
  angAnno.δAbs = Math.abs(δ)

  return { angAnno, deg, isAngleInverted }
}

export function createLengthAnnotation(
  line,
  prevAngleAnno = null,
  nextAngleAnno = null,
  baseOffset = 20,
  textGap = 2,
  color = '#E50000',
) {
  const { x1, y1, x2, y2 } = line
  const dx = x2 - x1,
    dy = y2 - y1
  const length = Math.hypot(dx, dy)
  if (length === 0) return null

  // ——— 1) build two normals, one on each side ———
  const n1 = { x: -dy / length, y: dx / length }
  const n2 = { x: dy / length, y: -dx / length }

  // ——— 2) count how many angle‐labels would “sit” on each side ———
  function countOnSide(normal) {
    let count = 0
    ;[prevAngleAnno, nextAngleAnno].forEach((anno) => {
      if (!anno) return
      // vector from line‐mid to angle‐label mid:
      const mx = (x1 + x2) / 2,
        my = (y1 + y2) / 2
      const vx = anno.mid.x - mx,
        vy = anno.mid.y - my
      if (vx * normal.x + vy * normal.y > 0) count++
    })
    return count
  }

  const c1 = countOnSide(n1),
    c2 = countOnSide(n2)
  let normal
  if (c1 < c2) normal = n1
  else if (c2 < c1) normal = n2
  else {
    // tie → side of the larger adjacent angle
    const aPrev = prevAngleAnno?.δAbs || 0
    const aNext = nextAngleAnno?.δAbs || 0

    // pick whichever is bigger; if still tie default to n1
    const chosenAnno = aPrev >= aNext ? prevAngleAnno : nextAngleAnno
    if (chosenAnno) {
      chosenAnno.mainCircle

      // see which normal that anno.mid sits on
      const mx = (x1 + x2) / 2,
        my = (y1 + y2) / 2
      const dot = (chosenAnno.mid.x - mx) * n1.x + (chosenAnno.mid.y - my) * n1.y
      normal = dot > 0 ? n1 : n2
    } else {
      normal = n1
    }
  }

  // ——— 3) compute text position & rotation ———
  const mx = (x1 + x2) / 2,
    my = (y1 + y2) / 2
  const totalOffset = baseOffset + textGap
  const tx = mx + normal.x * totalOffset
  const ty = my + normal.y * totalOffset

  // text rotation along the line
  let angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI
  if (angleDeg > 90 || angleDeg < -90) angleDeg += 180

  // ——— 4) create the Text + background ———
  const str = `${Math.round(length)}`
  const txt = new Text(str, {
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

  const padding = 2
  const bgW = txt.width + padding * 2
  const bgH = 10
  const bg = new Rect({
    left: tx,
    top: ty,
    originX: 'center',
    originY: 'center',
    width: bgW,
    height: bgH,
    rx: 4,
    fill: 'red', // or your preferred color
    angle: angleDeg, // match text rotation
    selectable: false,
  })

  // ——— 5) group & return ———
  const lengthAnno = new Group([bg, txt], {
    selectable: false,
    _isMeasurement: true,
    _measurementType: 'length',
  })

  return lengthAnno
}

/**
 * Given a circle object with .getCenterPoint(), .line1 and .line2,
 * returns the signed angle δ (in radians), its absolute value in degrees,
 * and whether the angle is “inverted” (i.e. δ ≥ 0).
 */
export function calculateCircleAngle(circle) {
  if (!(circle.line1 && circle.line2)) return
  const P = circle.getCenterPoint() // { x, y }

  // grab the two lines
  const L1 = circle.line1
  const L2 = circle.line2

  // find the “far” endpoints A and B
  const A = L1.circle1 === circle ? L1.circle2.getCenterPoint() : L1.circle1.getCenterPoint()
  const B = L2.circle1 === circle ? L2.circle2.getCenterPoint() : L2.circle1.getCenterPoint()

  // vectors from P to A and P to B
  const ux = A.x - P.x,
    uy = A.y - P.y,
    vx = B.x - P.x,
    vy = B.y - P.y

  // if either vector is zero, we can’t form an angle
  const lu = Math.hypot(ux, uy),
    lv = Math.hypot(vx, vy)
  if (lu === 0 || lv === 0) {
    return null
  }

  // compute raw angles
  const θ1 = Math.atan2(uy, ux),
    θ2 = Math.atan2(vy, vx)

  // signed delta in (−π, π]
  let δ = θ2 - θ1
  if (δ <= -Math.PI) δ += 2 * Math.PI
  else if (δ > Math.PI) δ -= 2 * Math.PI

  const isAngleInverted = δ >= 0
  const deg = Math.round((Math.abs(δ) * 180) / Math.PI)

  return {
    delta: δ, // signed angle in radians
    deg, // absolute angle in degrees
    isAngleInverted, // true if δ ≥ 0, false otherwise
  }
}

export function getAllCircles(canvas) {
  // const { canvasInstance , objectsZoomScale,} = useCanvasContext();
  // const canvas = canvasInstance.current;
  if (!canvas) return

  const circles = canvas.getObjects().filter((obj) => obj.type === 'circle')
  return circles
}

export function getAllMainLines(canvas) {
  // const { canvasInstance , objectsZoomScale,} = useCanvasContext();
  // const canvas = canvasInstance.current;
  if (!canvas) return
  const mainLines = canvas.getObjects().filter((o) => o.type === 'line' && o.hitboxLine)
  return mainLines
}

export const scaleLine = (line, newLength) => {
  const oldLength = calculateLineLength(line)
  const scaleFactor = newLength / oldLength
  const deltaX = (line.x2 - line.x1) * (scaleFactor - 1)
  const deltaY = (line.y2 - line.y1) * (scaleFactor - 1)

  console.log(line.x1, line.x2, line.hitboxLine.x1, line.hitboxLine.x2)

  line.set({
    x2: line.x2 + deltaX,
    y2: line.y2 + deltaY,
  })

  line.setCoords()

  return { deltaX, deltaY }
}

export const moveObjects = (selectedLine, deltaX, deltaY) => {
  let obj = selectedLine
  obj.hitboxLine.set({
    x1: obj.x1,
    y1: obj.y1,
    x2: obj.x2,
    y2: obj.y2,
  })
  while (obj) {
    if (obj.type === 'line') {
      obj = obj.circle2
      obj.set({
        left: obj.left + deltaX,
        top: obj.top + deltaY,
      })
      obj.line1 &&
        obj.line1.set({ x2: obj.left, y2: obj.top }) &&
        obj.line1.hitboxLine.set({ x2: obj.left, y2: obj.top })
      obj.line2 &&
        obj.line2.set({ x1: obj.left, y1: obj.top }) &&
        obj.line2.hitboxLine.set({ x1: obj.left, y1: obj.top })
    } else if (obj.type === 'circle') {
      obj = obj.line2
      obj &&
        obj &&
        obj.set({
          x1: obj.x1 + deltaX,
          y1: obj.y1 + deltaY,
          x2: obj.x2 + deltaX,
          y2: obj.y2 + deltaY,
        })
    }
    obj && obj.setCoords()
  }
}

export function hasAnyOverlap(canvas, side = null) {
  // Collect only your “real” lines

  let lines

  if (side === 'A') {
    lines = canvas.getObjects().filter((o) => o.type === 'line' && o.hitboxLine)
  } else if (side === 'B') {
    lines = canvas.getObjects().filter((o) => o.type === 'line' && o.hitboxLine_B)
  } else {
    lines = canvas.getObjects().filter((o) => o.type === 'line' && o.hitboxLine)
  }

  console.log(lines)
  // Standard segment–segment intersection test
  function segmentsIntersect(l1, l2) {
    const x1 = l1.x1,
      y1 = l1.y1,
      x2 = l1.x2,
      y2 = l1.y2
    const x3 = l2.x1,
      y3 = l2.y1,
      x4 = l2.x2,
      y4 = l2.y2
    const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4)
    if (denom === 0) return false // parallel or colinear
    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom
    const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denom
    return t >= 0 && t <= 1 && u >= 0 && u <= 1
  }

  for (const line of lines) {
    // Build a Set of its neighbors (which we allow to touch)
    const neighbors = new Set()
    if (line.circle1?.line1) neighbors.add(line.circle1.line1)
    if (line.circle2?.line2) neighbors.add(line.circle2.line2)

    for (const other of lines) {
      if (other === line) continue // skip itself
      if (neighbors.has(other)) continue // skip immediate neighbors

      if (segmentsIntersect(line, other)) {
        return true // found a bad overlap
      }
    }
  }

  return false // no problematic intersections
}
