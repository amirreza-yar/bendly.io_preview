'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'

export function usePageNavigationAppRouter() {
  const pathname = usePathname()
  const [isNavigating, setIsNavigating] = useState(false)
  const [isUnloading, setIsUnloading] = useState(false)

  const prevPathRef = useRef(pathname)
  useEffect(() => {
    if (prevPathRef.current !== pathname) {
      // navigation finished
      queueMicrotask(() => setIsNavigating(false))
      prevPathRef.current = pathname
    }
  }, [pathname])

  useEffect(() => {
    function handleDocumentClick(e: MouseEvent) {
      if (e.button !== 0) return
      if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return

      let el = e.target as Element | null
      while (el && el.nodeName !== 'A') el = el.parentElement
      if (!el) return

      const anchor = el as HTMLAnchorElement
      const href = anchor.getAttribute('href')
      if (!href) return
      const target = anchor.getAttribute('target')
      const download = anchor.getAttribute('download')
      if (target === '_blank' || download != null) return
      if (href.startsWith('mailto:') || href.startsWith('tel:')) return

      try {
        const url = new URL(href, location.href)
        const sameOrigin = url.origin === location.origin
        const isHashOnly =
          url.pathname === location.pathname && url.search === location.search && url.hash !== ''
        if (!sameOrigin || isHashOnly) return
      } catch {
        return
      }

      // schedule state update outside insertion phase
      queueMicrotask(() => setIsNavigating(true))
    }

    const origPush = history.pushState
    const origReplace = history.replaceState

    function patchedPushState(...args: any[]) {
      const res = origPush.apply(history, args as any)
      // dispatch an event — event handler will schedule state update asynchronously
      window.dispatchEvent(new CustomEvent('app:navigation-start'))
      return res
    }
    function patchedReplaceState(...args: any[]) {
      const res = origReplace.apply(history, args as any)
      window.dispatchEvent(new CustomEvent('app:navigation-start'))
      return res
    }

    function handleNavStartEvent() {
      // schedule update async (avoid useInsertionEffect violation)
      queueMicrotask(() => setIsNavigating(true))
    }

    function markUnloading() {
      queueMicrotask(() => setIsUnloading(true))
    }
    function handleVisibility() {
      if (document.visibilityState === 'hidden') {
        queueMicrotask(() => setIsUnloading(true))
      } else {
        queueMicrotask(() => setIsUnloading(false))
      }
    }

    document.addEventListener('click', handleDocumentClick, true)
    window.addEventListener('app:navigation-start', handleNavStartEvent)
    window.addEventListener('beforeunload', markUnloading)
    window.addEventListener('pagehide', markUnloading)
    document.addEventListener('visibilitychange', handleVisibility)

    // @ts-ignore
    history.pushState = patchedPushState
    // @ts-ignore
    history.replaceState = patchedReplaceState

    return () => {
      document.removeEventListener('click', handleDocumentClick, true)
      window.removeEventListener('app:navigation-start', handleNavStartEvent)
      window.removeEventListener('beforeunload', markUnloading)
      window.removeEventListener('pagehide', markUnloading)
      document.removeEventListener('visibilitychange', handleVisibility)

      // restore
      // @ts-ignore
      history.pushState = origPush
      // @ts-ignore
      history.replaceState = origReplace
    }
  }, [])

  return {
    isNavigating,
    isUnloading,
    isBusy: isNavigating || isUnloading,
  }
}
