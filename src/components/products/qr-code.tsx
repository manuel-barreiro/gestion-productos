"use client"

import { QRCodeSVG } from "qrcode.react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Download, Check } from "lucide-react"

interface QRCodeProps {
  path: string
  size?: number
  className?: string
  showActions?: boolean
  containerClassName?: string
}

export function QRCode({
  path,
  size = 200,
  className,
  showActions = true,
  containerClassName = "rounded-lg border bg-white p-4 shadow-sm",
}: QRCodeProps) {
  const [url, setUrl] = useState(path)
  const [copied, setCopied] = useState(false)
  const [downloaded, setDownloaded] = useState(false)
  const qrRef = useRef<SVGSVGElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    setUrl(`${window.location.origin}${path}`)
  }, [path])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const getQRImage = async () => {
    if (!qrRef.current) return null

    const canvas = document.createElement("canvas")
    const svg = qrRef.current
    const base64doc = btoa(
      unescape(encodeURIComponent(new XMLSerializer().serializeToString(svg)))
    )
    const imgSource = `data:image/svg+xml;base64,${base64doc}`

    await new Promise((resolve) => {
      const image = new Image()
      image.onload = () => {
        canvas.width = size * 2
        canvas.height = size * 2
        const context = canvas.getContext("2d")
        if (context) {
          context.drawImage(image, 0, 0, size * 2, size * 2)
        }
        resolve(true)
      }
      image.src = imgSource
    })

    return canvas
  }

  const handleActionFeedback = (type: "copy" | "download") => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    if (type === "copy") {
      setCopied(true)
    } else {
      setDownloaded(true)
    }

    timeoutRef.current = setTimeout(() => {
      type === "copy" ? setCopied(false) : setDownloaded(false)
    }, 2000)
  }

  const downloadQRCode = async () => {
    const canvas = await getQRImage()
    if (!canvas) return

    const link = document.createElement("a")
    link.download = "qr-code.png"
    link.href = canvas.toDataURL("image/png")
    link.click()
    handleActionFeedback("download")
  }

  const copyQRCode = async () => {
    try {
      const canvas = await getQRImage()
      if (!canvas) return

      canvas.toBlob(async (blob) => {
        if (!blob) return
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ])
        handleActionFeedback("copy")
      })
    } catch (err) {
      // Optional: Handle error state if needed
    }
  }

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <div className={containerClassName}>
        <QRCodeSVG
          ref={qrRef}
          value={url}
          size={size}
          level="H"
          includeMargin
          bgColor="#FFFFFF"
          fgColor="#000000"
        />
      </div>

      {showActions && (
        <div className="flex gap-2">
          <Button
            onClick={downloadQRCode}
            variant="outline"
            size="sm"
            className="relative w-32 overflow-hidden transition-all"
          >
            <div className="flex items-center gap-2">
              {downloaded ? (
                <>
                  <Check className="h-4 w-4 text-green-600 animate-in zoom-in-50" />
                  <span className="text-green-600">Downloaded!</span>
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </>
              )}
            </div>
          </Button>

          <Button
            onClick={copyQRCode}
            variant="outline"
            size="sm"
            className="relative w-32 overflow-hidden transition-all"
          >
            <div className="flex items-center gap-2">
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-green-600 animate-in zoom-in-50" />
                  <span className="text-green-600">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>Copy</span>
                </>
              )}
            </div>
          </Button>
        </div>
      )}
    </div>
  )
}
