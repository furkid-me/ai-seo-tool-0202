'use client'

interface LoadingSpinnerProps {
  message?: string
}

export default function LoadingSpinner({ message = '載入中...' }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-primary-200 rounded-full"></div>
        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-primary-600 rounded-full border-t-transparent animate-spin"></div>
      </div>
      <p className="mt-4 text-gray-600 animate-pulse">{message}</p>
    </div>
  )
}
