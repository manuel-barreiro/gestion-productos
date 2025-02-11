"use client"

import { QRCodeSVG } from "qrcode.react"

interface QRCodeProps {
  path: string
  size?: number
  className?: string
}

export function QRCode({ path, size = 200, className }: QRCodeProps) {
  return (
    <div className={className}>
      <QRCodeSVG
        value={`${window.location.origin}${path}`}
        size={size}
        level="H"
      />
    </div>
  )
}
