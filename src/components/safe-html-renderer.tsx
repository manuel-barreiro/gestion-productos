// src/components/safe-html-renderer.tsx
"use client"

import React from "react"
import DOMPurify from "dompurify"

interface SafeHTMLRendererProps {
  htmlContent: string
}

export function SafeHTMLRenderer({ htmlContent }: SafeHTMLRendererProps) {
  // Only run DOMPurify on the client side since it needs the window object
  const sanitizedContent = React.useMemo(
    () =>
      typeof window !== "undefined"
        ? DOMPurify.sanitize(htmlContent)
        : htmlContent,
    [htmlContent]
  )

  return (
    <div
      className="prose prose-sm max-w-none text-justify dark:prose-invert"
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  )
}
