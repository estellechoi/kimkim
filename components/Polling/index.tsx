import { NotiStatus } from '@/types/noti'
import { ReactNode, useEffect, useState } from 'react'

export default function Polling({
  formattedNumber,
  caption,
  status,
  className,
  onClick,
}: {
  formattedNumber?: string
  caption?: string
  status?: NotiStatus
  className?: string
  onClick?: () => void
}) {
  const [isMounting, setIsMounting] = useState(false)

  useEffect(() => {
    if (!formattedNumber) return

    setIsMounting(true)
    const mountingTimer = setTimeout(() => setIsMounting(false), 1000)

    return () => clearTimeout(mountingTimer)
  }, [formattedNumber])

  return (
    <div
      className={`${className} flex items-center space-x-2 ${textCSSByStatus(status)} ${
        onClick ? 'cursor-pointer' : ''
      }`}
      onClick={onClick}
    >
      {caption && <div className="Font_label_12px">{caption}</div>}
      <div className={`Font_data_12px_num ${onClick ? 'hover:opacity-50' : ''} ${isMounting ? 'opacity-50' : ''}`}>{formattedNumber}</div>
      <PollingDot status={status}>
        <PollingSpinner status={status} isMounting={isMounting} />
      </PollingDot>
    </div>
  )
}

function PollingDot({ children, status }: { children: ReactNode; status?: NotiStatus }) {
  return (
    <div
      className={`${bgCSSByStatus(status)} relative w-2 h-2 min-w-[0.5rem] min-h-[0.5rem] rounded-full`}
      style={{ transition: `background-color ease 250ms` }}
    >
      {children}
    </div>
  )
}

function PollingSpinner({ status, isMounting = false }: { status?: NotiStatus; isMounting?: boolean }) {
  return (
    <div
      className={`border-solid ${
        isMounting ? 'animate-spinning border-l-2' : 'border-l-0'
      } relative -left-[3px] -top-[3px] w-3.5 h-3.5 rounded-full ${borderCSSByStatus(
        status
      )} border-t border-r border-b border-t-transparent border-r-transparent border-b-transparent bg-transparent`}
    >
      <span className="sr-only">The data is fetching</span>
    </div>
  )
}

function textCSSByStatus(status?: NotiStatus) {
  switch (status) {
    case 'info':
      return 'text-semantic_info'
    case 'error':
      return 'text-semantic_danger'
    case 'warning':
      return 'text-semantic_warning'
    case 'success':
      return 'text-semantic_success'
    default:
      return 'text-body'
  }
}

function bgCSSByStatus(status?: NotiStatus) {
  switch (status) {
    case 'info':
      return 'bg-semantic_info'
    case 'error':
      return 'bg-semantic_danger'
    case 'warning':
      return 'bg-semantic_warning'
    case 'success':
      return 'bg-semantic_success'
    default:
      return 'bg-body'
  }
}

function borderCSSByStatus(status?: NotiStatus) {
  switch (status) {
    case 'info':
      return 'border-semantic_info'
    case 'error':
      return 'border-semantic_danger'
    case 'warning':
      return 'border-semantic_warning'
    case 'success':
      return 'border-semantic_success'
    default:
      return 'border-body'
  }
}
