'use client'

import { useState, useCallback } from 'react'
import { useToast } from './useToast'

export function useAsyncAction() {
  const [isLoading, setIsLoading] = useState(false)
  const { addToast } = useToast()

  const execute = useCallback(
    async (
      action: () => Promise<void>,
      successMessage?: string,
      errorMessage?: string
    ) => {
      setIsLoading(true)
      try {
        await action()
        if (successMessage) {
          addToast(successMessage, 'success')
        }
      } catch (error) {
        console.error('[v0] Action failed:', error)
        addToast(
          errorMessage || 'Something went wrong',
          'error'
        )
      } finally {
        setIsLoading(false)
      }
    },
    [addToast]
  )

  return { isLoading, execute }
}
