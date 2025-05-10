'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'

type Props = {
  /** Interval in ms to poll the page */
  interval?: number
}

/** Small component to refresh the page at a specified interval. */
export function Poll({ interval = 5_000 }: Props) {
  const { refresh } = useRouter()
  const intervalId = useRef<NodeJS.Timeout>(null)

  useEffect(() => {
    function startPolling() {
      intervalId.current = setInterval(() => {
        if (!document.hidden) {
          refresh()
        }
      }, interval)
    }

    function stopPolling() {
      clearInterval(intervalId.current || -1)
    }

    // start/stop polling when the tab changes from/into background
    function handleVisibilityChange() {
      if (document.hidden) {
        stopPolling()
      } else {
        startPolling()
      }
    }

    // trigger initial polling
    handleVisibilityChange()

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      stopPolling()
    }
  }, [refresh, interval])

  return null
}
