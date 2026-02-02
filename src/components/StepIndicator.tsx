'use client'

import { GenerationStep } from '@/types'

interface StepIndicatorProps {
  currentStep: GenerationStep['step']
}

const steps = [
  { id: 'category', label: '選擇類別', icon: '1' },
  { id: 'keyword', label: '選擇關鍵字', icon: '2' },
  { id: 'generating', label: '生成內容', icon: '3' },
  { id: 'editing', label: '編輯審核', icon: '4' },
  { id: 'publishing', label: '發布', icon: '5' },
]

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  const currentIndex = steps.findIndex((s) => s.id === currentStep)

  return (
    <div className="mb-8">
      <div className="flex items-center justify-center">
        {steps.map((step, index) => {
          const isActive = index === currentIndex
          const isCompleted = index < currentIndex
          const isUpcoming = index > currentIndex

          return (
            <div key={step.id} className="flex items-center">
              {/* Step Circle */}
              <div
                className={`
                  flex items-center justify-center w-10 h-10 rounded-full font-semibold text-sm transition-all
                  ${isActive ? 'bg-primary-600 text-white shadow-lg scale-110' : ''}
                  ${isCompleted ? 'bg-primary-500 text-white' : ''}
                  ${isUpcoming ? 'bg-gray-200 text-gray-500' : ''}
                `}
              >
                {isCompleted ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step.icon
                )}
              </div>

              {/* Step Label */}
              <span
                className={`
                  hidden sm:block ml-2 text-sm font-medium
                  ${isActive ? 'text-primary-600' : ''}
                  ${isCompleted ? 'text-primary-500' : ''}
                  ${isUpcoming ? 'text-gray-400' : ''}
                `}
              >
                {step.label}
              </span>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={`
                    w-8 sm:w-16 h-1 mx-2 sm:mx-4 rounded-full transition-all
                    ${index < currentIndex ? 'bg-primary-500' : 'bg-gray-200'}
                  `}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
