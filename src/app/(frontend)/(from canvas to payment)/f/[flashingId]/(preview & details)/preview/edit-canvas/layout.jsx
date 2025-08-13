import { CanvasProvider } from '@/providers/canvas_providers/canvasContextProvider'
import { ResizingProvider } from '@/providers/canvas_providers/resizingProvider'
import { MovingProvider } from '@/providers/canvas_providers/movingProvider'
import { RemovingProvider } from '@/providers/canvas_providers/removingProvider '
import { TapperingProvider } from '@/providers/canvas_providers/tapperingProvider'
import { BreakLineProvider } from '@/providers/canvas_providers/breakLineProvider'
import { CrushFoldProvider } from '@/providers/canvas_providers/crushFoldProvider'
import { UIVisibilityProvider } from '@/providers/canvas_providers/UICanvasContext'
import { CancelChangesModalProvider } from '@/providers/canvas_providers/cancelChangesModalProvider'

export const metadata = {
  title: 'Canvas Page',
}

export default function CanvasLayout({ children }) {
  return (
    <CanvasProvider>
      <UIVisibilityProvider>
        <CancelChangesModalProvider>
          <CrushFoldProvider>
            <BreakLineProvider>
              <ResizingProvider>
                <MovingProvider>
                  <RemovingProvider>
                    <TapperingProvider>{children}</TapperingProvider>
                  </RemovingProvider>
                </MovingProvider>
              </ResizingProvider>
            </BreakLineProvider>
          </CrushFoldProvider>
        </CancelChangesModalProvider>
      </UIVisibilityProvider>
    </CanvasProvider>
  )
}
