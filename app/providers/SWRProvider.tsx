'use client'

import { SWRConfig } from 'swr'
import { ReactNode } from 'react'

interface SWRProviderProps {
  children: ReactNode
}

export default function SWRProvider({ children }: SWRProviderProps) {
  return (
    <SWRConfig
      value={{
        fetcher: async (url: string) => {
          const response = await fetch(url)
          if (!response.ok) {
            throw new Error('An error occurred while fetching the data.')
          }
          return response.json()
        },
        revalidateOnFocus: false,
        dedupingInterval: 5000
      }}
    >
      {children}
    </SWRConfig>
  )
}
