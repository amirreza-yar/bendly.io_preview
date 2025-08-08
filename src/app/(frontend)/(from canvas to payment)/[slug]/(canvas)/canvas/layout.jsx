import { CanvasProvider } from '@/providers/canvasContextProvider'
import { ResizingProvider } from '@/providers/hooks_provider/resizingProvider'
import { MovingProvider } from '@/providers/hooks_provider/movingProvider'
import { RemovingProvider } from '@/providers/hooks_provider/removingProvider '
import { TapperingProvider } from '@/providers/hooks_provider/tapperingProvider'
import { BreakLineProvider } from '@/providers/hooks_provider/breakLineProvider'
import { CrushFoldProvider } from '@/providers/hooks_provider/crushFoldProvider'
import { UIVisibilityProvider } from '@/providers/UICanvasContext'
import { Toaster } from 'sonner'
import { CancelChangesModalProvider } from '@/providers/hooks_provider/cancelChangesModalProvider'

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
                    <TapperingProvider>
                      {/* <Toaster
                        position="bottom-center"
                        mobileOffset={{ bottom: '96px', right: '0', left: '0' }}
                        toastOptions={{
                          unstyled: true,
                          classNames: {
                            toast:
                              'bg-[#171717] -fit px-6 py-[12.5px] rounded-md mx-auto shadow-md',
                            title: 'font-roboto text-xs/[22.5px] text-white',
                          },
                        }}
                        duration={2000}
                      /> */}
                      {children}
                    </TapperingProvider>
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
