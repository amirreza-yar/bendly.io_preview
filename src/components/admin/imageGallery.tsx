'use client'
import { useState, useRef } from 'react'
import Image from 'next/image'
import { Maximize2, X, ZoomIn, ZoomOut, RotateCw, Download } from 'lucide-react'
import { Button } from '@/components/uikit/buttons/button'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { Close, Maximize } from '../uikit/icons'
import { IconButton } from '../uikit/buttons/iconButton'
import { IconButtonGroup } from '../uikit/buttons/iconButtonGroup'

interface ImageGalleryProps {
  images: {
    id: string
    src: string
    alt: string
  }[]
}

export default function ImageGalleryAdvanced({ images }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(images[0])
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const imageRef = useRef<HTMLDivElement>(null)

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.5, 3))
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.5, 1))
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360)

  const resetView = () => {
    setZoom(1)
    setRotation(0)
    setPosition({ x: 0, y: 0 })
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true)
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = selectedImage.src
    link.download = selectedImage.alt || 'image'
    link.click()
  }

  return (
    <div className="w-full gap-6 flex flex-col">
      {/* Main Image Display */}
      <div className="relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden">
        <Image src={selectedImage.src} alt={selectedImage.alt} fill className="object-contain" />

        {/* Maximize Button - Bottom Left */}
        <button
          className="absolute bottom-4 right-4 gap-2 bg-black opacity-50 p-1 rounded-sm text-white cursor-pointer"
          onClick={() => setIsFullscreen(true)}
        >
          <Maximize className="size-5 text-white" />
        </button>
      </div>

      {/* Thumbnail Grid */}
      <div className="flex flex-wrap gap-2 justify-center items-center">
        {images.map((image) => (
          <button
            key={image.id}
            onClick={() => setSelectedImage(image)}
            className={`
              relative aspect-square rounded-md overflow-hidden h-25
              border-2 transition-all hover:opacity-80
              ${selectedImage.id === image.id ? 'border-primary' : 'border-gray-200'}
            `}
          >
            <Image src={image.src} alt={image.alt} fill className="object-cover" />
          </button>
        ))}
      </div>

      {/* Fullscreen Modal */}
      <DialogPrimitive.Root
        data-slot="dialog"
        open={isFullscreen}
        onOpenChange={(open: any) => {
          setIsFullscreen(open)
          if (!open) resetView()
        }}
      >
        <DialogPrimitive.Title data-slot="dialog-title" className="hidden"></DialogPrimitive.Title>
        <DialogPrimitive.Portal data-slot="dialog-portal">
          <DialogPrimitive.Overlay
            data-slot="dialog-overlay"
            className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50"
          />
          <DialogPrimitive.Content
            data-slot="dialog-content"
            className="w-fit bg-white data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid -[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:-lg"
          >
            <div className="relative h-[90vh] w-[90vw] bg-gray-50">
              {/* Top Controls */}
              {/* <Button
                  variant="secondary"
                  onClick={handleDownload}
                  className="bg-white/90 hover:bg-white"
                >
                  <Download className="size-4" />
                </Button> */}
              <IconButton
                black
                onClick={() => {
                  setIsFullscreen(false)
                  resetView()
                }}
                className="absolute top-4 right-4 z-10"
              >
                <Close />
              </IconButton>

              <div className="absolute bottom-4 right-4 z-10 inline-flex flex-col rounded-xl overflow-hidden bg-white shadow divide-y">
                <button
                  onClick={handleZoomIn}
                  disabled={zoom >= 3}
                  className="w-11 h-11 grid place-items-center hover:bg-black/20 transition-all"
                >
                  <ZoomIn className="size-5 text-gray-600" />
                </button>
                <button
                  onClick={handleZoomOut}
                  disabled={zoom <= 1}
                  className="w-11 h-11 grid place-items-center hover:bg-black/15 transition-all"
                >
                  <ZoomOut className="size-5 text-gray-600" />
                </button>
                <button className="w-11 h-11 grid place-items-center hover:bg-black/15 transition-all">
                  <RotateCw onClick={handleRotate} className="size-5 text-gray-600" />
                </button>
                <button className="w-11 h-11 grid place-items-center hover:bg-black/15 transition-all">
                  <Download onClick={handleDownload} className="size-5 text-gray-600" />
                </button>
              </div>

              <div
                ref={imageRef}
                className="w-full h-full overflow-hidden cursor-move rounded-lg"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{
                    transform: `scale(${zoom}) rotate(${rotation}deg) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
                    transformOrigin: 'center',
                    transition: isDragging ? 'none' : 'transform 0.2s ease-out',
                  }}
                >
                  <Image
                    src={selectedImage.src}
                    alt={selectedImage.alt}
                    width={1920}
                    height={1080}
                    className="max-w-full max-h-full object-contain pointer-events-none"
                    draggable={false}
                  />
                </div>
              </div>

              {/* Instructions */}
              {zoom > 1 && (
                <div className="absolute top-4 left-4 z-10 bg-black/70 text-white px-3 py-2 rounded-md text-sm">
                  Click and drag to pan
                </div>
              )}
            </div>
            <DialogPrimitive.Close className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </div>
  )
}
