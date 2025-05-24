'use client'

import { env } from '@/env'
import { useEffect } from 'react'

export function ClientEnvDisplay() {
  useEffect(() => {
    console.log('Client-side public environment variable:', {
      NEXT_PUBLIC_API_URL: env.NEXT_PUBLIC_API_URL
    })
  }, [])

  return (
    <div className='mb-8'>
      <h2 className='text-xl font-semibold mb-4'>
        Client-Side Environment Variable:
      </h2>
      <pre className='bg-gray-800 p-4 rounded border border-gray-700 text-gray-100'>
        {JSON.stringify(
          {
            NEXT_PUBLIC_API_URL: env.NEXT_PUBLIC_API_URL
          },
          null,
          2
        )}
      </pre>
    </div>
  )
}
