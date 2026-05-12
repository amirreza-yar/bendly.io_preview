import { G } from '@svgdotjs/svg.js';
import { graphStore } from '../store/store'; // import your zustand store
import type { GraphData, Mode } from '../types/types';
import { BaseSvgRenderer } from './base/renderer';

export class SvgRenderer extends BaseSvgRenderer {
  nodesLayer: G;
  edgesLayer: G;
  annotationLayer: G;
  extraLayer: G;

  constructor(el: HTMLElement) {
    super(el);

    this.extraLayer = this.draw.group();
    this.edgesLayer = this.draw.group();
    this.nodesLayer = this.draw.group();
    this.annotationLayer = this.draw.group();

    graphStore.getState().setEngineReady(true);
  }

  private getCombinedBBox() {
    const layers = [this.edgesLayer, this.nodesLayer];

    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;

    let hasContent = false;

    for (const layer of layers) {
      if (!layer || layer.children().length === 0) continue;

      const box = layer.bbox(); // WORLD coordinates
      if (!isFinite(box.x) || !isFinite(box.y)) continue;

      hasContent = true;
      minX = Math.min(minX, box.x);
      minY = Math.min(minY, box.y);
      maxX = Math.max(maxX, box.x + box.width);
      maxY = Math.max(maxY, box.y + box.height);
    }

    if (!hasContent) return null;

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    };
  }

  // public centerRenderedContentAnimated(
  //   paddingTopPx = 70,
  //   paddingBottomPx = 80,
  //   paddingSidePx = 40,
  //   durationMs = 300,
  // ) {
  //   const bbox = this.getCombinedBBox();
  //   if (!bbox) return;

  //   const rect = this.container.getBoundingClientRect();
  //   if (rect.width === 0 || rect.height === 0) return;

  //   const currentVB = this.draw.viewbox();

  //   // current scale: world → pixels
  //   const scale = rect.width / currentVB.width * 2;

  //   // convert pixel padding → world units
  //   const padTopWorld = paddingTopPx / scale ;
  //   const padBottomWorld = paddingBottomPx / scale ;
  //   const padSideWorld = paddingSidePx / scale ;

  //   const paddedWidth = bbox.width + padSideWorld * 2;
  //   const paddedHeight = bbox.height + padTopWorld + padBottomWorld;

  //   const fitScale = Math.min(rect.width / paddedWidth, rect.height / paddedHeight);

  //   const targetWidth = rect.width / fitScale;
  //   const targetHeight = rect.height / fitScale;

  //   const contentCenterX = bbox.x + bbox.width / 2;

  //   const contentTop = bbox.y - padTopWorld;
  //   const contentBottom = bbox.y + bbox.height + padBottomWorld;
  //   const contentCenterY = (contentTop + contentBottom) / 2;

  //   const target = {
  //     x: contentCenterX - targetWidth / 2,
  //     y: contentCenterY - targetHeight / 2,
  //     width: targetWidth,
  //     height: targetHeight,
  //   };


  //   const startVB = { ...currentVB };

  //   const startScale = rect.width / startVB.width;
  //   const targetScale = rect.width / target.width;
  //   const startTime = performance.now();

  //   console.log(target, scale, currentVB, rect, startScale, targetScale)

  //   const easeInOutCubic = (t: number) =>
  //     t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  //   const animate = (now: number) => {
  //     const t = Math.min(1, (now - startTime) / durationMs);
  //     const k = easeInOutCubic(t);

  //     const vb = {
  //       x: startVB.x + (target.x - startVB.x) * k,
  //       y: startVB.y + (target.y - startVB.y) * k,
  //       width: startVB.width + (target.width - startVB.width) * k,
  //       height: startVB.height + (target.height - startVB.height) * k,
  //     };

  //     const scale = startScale + (targetScale - startScale) * k;

  //     const store = graphStore.getState();
  //     store.setViewBox(vb);
  //     store.setScale(scale);

  //     if (t < 1) requestAnimationFrame(animate);
  //   };

  //   requestAnimationFrame(animate);
  // }

  // public centerRenderedContentAnimated(
  //   paddingTopPx = -2000,
  //   paddingBottomPx = 50,
  //   paddingSidePx = 0,
  //   durationMs = 300,
  // ) {
  //   const bbox = this.getCombinedBBox();
  //   if (!bbox) return;

  //   const rect = this.container.getBoundingClientRect();
  //   if (rect.width === 0 || rect.height === 0) return;

  //   const currentVB = { ...this.draw.viewbox() };

  //   // Fit scale based only on bbox + desired padding, not current zoom.
  //   const scaleX = (rect.width - 2 * paddingSidePx) / bbox.width;
  //   const scaleY = (rect.height - paddingTopPx - paddingBottomPx) / bbox.height;
  //   const targetScale = Math.min(scaleX, scaleY);

  //   if (!isFinite(targetScale) || targetScale <= 0) return;

  //   const targetWidth = rect.width / targetScale;
  //   const targetHeight = rect.height / targetScale;

  //   const padTopWorld = paddingTopPx / targetScale;
  //   const padBottomWorld = paddingBottomPx / targetScale;

  //   const bboxCenterX = bbox.x + bbox.width / 2;
  //   const bboxCenterY = bbox.y + bbox.height / 2;

  //   const target = {
  //     x: bboxCenterX - targetWidth / 2,
  //     y: bboxCenterY - targetHeight / 2 + (padBottomWorld - padTopWorld) / 2,
  //     width: targetWidth,
  //     height: targetHeight,
  //   };

  //   const startTime = performance.now();
  //   const startVB = { ...currentVB };

  //   const startScale = rect.width / startVB.width;
  //   const targetScaleFromVB = rect.width / target.width;

  //   const easeInOutCubic = (t: number) =>
  //     t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  //   const animate = (now: number) => {
  //     const t = Math.min(1, (now - startTime) / durationMs);
  //     const k = easeInOutCubic(t);

  //     const vb = {
  //       x: startVB.x + (target.x - startVB.x) * k,
  //       y: startVB.y + (target.y - startVB.y) * k,
  //       width: startVB.width + (target.width - startVB.width) * k,
  //       height: startVB.height + (target.height - startVB.height) * k,
  //     };

  //     const scale = startScale + (targetScaleFromVB - startScale) * k;

  //     const store = graphStore.getState();
  //     store.setViewBox(vb);
  //     store.setScale(scale);

  //     if (t < 1) requestAnimationFrame(animate);
  //   };

  //   requestAnimationFrame(animate);
  // }

  // public centerRenderedContentAnimated(sidePad = 30, topPad = 100, bottomPad = 80, durationMs = 300) {
  //   const bbox = this.getCombinedBBox();
  //   if (!bbox) return;

  //   const rect = this.container.getBoundingClientRect();
  //   if (rect.width === 0 || rect.height === 0) return;

  //   const startVB = { ...this.draw.viewbox() };

  //   // Scale needed to fit content perfectly inside viewport
  //   const scaleX = rect.width / bbox.width;
  //   const scaleY = rect.height / bbox.height;

  //   // Use smaller scale so whole drawing fits
  //   const fitScale = Math.min(scaleX, scaleY);

  //   // Convert viewport size back into world units
  //   const targetWidth = rect.width / fitScale;
  //   const targetHeight = rect.height / fitScale;

  //   // Center bbox inside target viewbox
  //   const bboxCenterX = bbox.x + bbox.width / 2;
  //   const bboxCenterY = bbox.y + bbox.height / 2;

  //   const target = {
  //     x: bboxCenterX - targetWidth / 2 - sidePad,
  //     y: bboxCenterY - targetHeight / 2,
  //     width: targetWidth,
  //     height: targetHeight,
  //   };

  //   const startScale = rect.width / startVB.width;
  //   const targetScale = rect.width / target.width;

  //   const startTime = performance.now();

  //   const easeInOutCubic = (t: number) =>
  //     t < 0.5
  //       ? 4 * t * t * t
  //       : 1 - Math.pow(-2 * t + 2, 3) / 2;

  //   const animate = (now: number) => {
  //     const t = Math.min(1, (now - startTime) / durationMs);
  //     const k = easeInOutCubic(t);

  //     const vb = {
  //       x: startVB.x + (target.x - startVB.x) * k,
  //       y: startVB.y + (target.y - startVB.y) * k,
  //       width:
  //         startVB.width + (target.width - startVB.width) * k,
  //       height:
  //         startVB.height + (target.height - startVB.height) * k,
  //     };

  //     const scale =
  //       startScale + (targetScale - startScale) * k;

  //     const store = graphStore.getState();

  //     store.setViewBox(vb);
  //     store.setScale(scale);

  //     if (t < 1) {
  //       requestAnimationFrame(animate);
  //     }
  //   };

  //   requestAnimationFrame(animate);
  // }


  public centerRenderedContentAnimated(
    paddingTopPx = 40,
    paddingBottomPx = 40,
    paddingSidePx = 40,
    durationMs = 300,
  ) {
    const bbox = this.getCombinedBBox();
    if (!bbox) return;

    const rect = this.container.getBoundingClientRect();

    if (rect.width <= 0 || rect.height <= 0) return;

    // Available screen area after padding
    const availableWidth =
      rect.width - paddingSidePx * 2;

    const availableHeight =
      rect.height - paddingTopPx - paddingBottomPx;

    if (availableWidth <= 0 || availableHeight <= 0) {
      return;
    }

    // Scale needed to fit content into padded area
    const scaleX = availableWidth / bbox.width;
    const scaleY = availableHeight / bbox.height;

    const fitScale = Math.min(scaleX, scaleY);

    // Convert viewport size back into world units
    const targetWidth = rect.width / fitScale;
    const targetHeight = rect.height / fitScale;

    // Convert paddings into world-space units
    const padLeftWorld = paddingSidePx / fitScale;
    const padRightWorld = paddingSidePx / fitScale;

    const padTopWorld = paddingTopPx / fitScale;
    const padBottomWorld = paddingBottomPx / fitScale;

    // Desired visible world area:
    //
    // | left pad | content | right pad |
    //
    // Center content inside padded region
    const targetX =
      bbox.x - padLeftWorld;

    const targetY =
      bbox.y - padTopWorld;

    const target = {
      x: targetX,
      y: targetY,
      width: bbox.width + padLeftWorld + padRightWorld,
      height:
        bbox.height +
        padTopWorld +
        padBottomWorld,
    };

    const startVB = {
      ...this.draw.viewbox(),
    };

    const startScale =
      rect.width / startVB.width;

    const targetScale =
      rect.width / target.width;

    const startTime = performance.now();

    const easeInOutCubic = (t: number) =>
      t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const animate = (now: number) => {
      const t = Math.min(
        1,
        (now - startTime) / durationMs,
      );

      const k = easeInOutCubic(t);

      const vb = {
        x:
          startVB.x +
          (target.x - startVB.x) * k,

        y:
          startVB.y +
          (target.y - startVB.y) * k,

        width:
          startVB.width +
          (target.width - startVB.width) * k,

        height:
          startVB.height +
          (target.height - startVB.height) * k,
      };

      const scale =
        startScale +
        (targetScale - startScale) * k;

      const store = graphStore.getState();

      store.setViewBox(vb);

      // Optional:
      // remove if scale is derivable from viewBox
      store.setScale(scale);

      if (t < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }


  render(data: GraphData, activeMode: Mode) {
    // keep the grid layer untouched by render clearing
    this.edgesLayer.clear();
    this.nodesLayer.clear();
    this.annotationLayer.clear();
    this.extraLayer.clear();

    // update grid using live viewBox from store (or optionally pass it in)
    const vb = graphStore.getState().viewBox;
    if (vb) this.updateGridForViewBox(vb);

    activeMode?.initMode?.(data.nodes, this.extraLayer.group());

    data.nodes?.forEach((node) => {
      if (!node.next_node_id) return;
      const g = this.edgesLayer.group();
      const to = data.nodes.get(node.next_node_id);
      if (!to) return;

      activeMode.edgeObject(g, node, to, undefined, this.extraLayer.group());
    });

    data.nodes?.forEach((node) => {
      const g = this.nodesLayer.group();
      g.translate(node.x, node.y);

      activeMode.nodeObject(g, node);
    });

    activeMode?.annotaionObjects?.(data.nodes, this.annotationLayer.group());
  }
}
