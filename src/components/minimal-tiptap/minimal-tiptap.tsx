import * as React from "react"
import "./styles/index.css"

import type { Content, Editor } from "@tiptap/react"
import type { UseMinimalTiptapEditorProps } from "./hooks/use-minimal-tiptap"
import { EditorContent } from "@tiptap/react"
import { cn } from "@/lib/utils"
import { SectionTwo } from "./components/section/two"

import { useMinimalTiptapEditor } from "./hooks/use-minimal-tiptap"
import { MeasuredContainer } from "./components/measured-container"

export interface MinimalTiptapProps
  extends Omit<UseMinimalTiptapEditorProps, "onUpdate"> {
  value?: Content
  onChange?: (value: Content) => void
  className?: string
  editorContentClassName?: string
}

const Toolbar = ({ editor }: { editor: Editor }) => (
  <div className="shrink-0 overflow-x-auto border-b border-border p-2">
    <div className="flex w-max items-center gap-px">
      <SectionTwo
        editor={editor}
        activeActions={["bold", "italic", "underline"]}
        mainActionCount={3}
      />
    </div>
  </div>
)

export const MinimalTiptapEditor = React.forwardRef<
  HTMLDivElement,
  MinimalTiptapProps
>(({ value, onChange, className, editorContentClassName, ...props }, ref) => {
  const editor = useMinimalTiptapEditor({
    value,
    onUpdate: onChange,
    ...props,
  })

  if (!editor) {
    return null
  }

  return (
    <MeasuredContainer
      as="div"
      name="editor"
      ref={ref}
      className={cn(
        "flex h-96 w-full flex-col overflow-y-auto rounded-md border border-input shadow-sm focus-within:border-primary",
        className
      )}
    >
      <Toolbar editor={editor} />
      <EditorContent
        editor={editor}
        className={cn("minimal-tiptap-editor", editorContentClassName)}
      />
    </MeasuredContainer>
  )
})

MinimalTiptapEditor.displayName = "MinimalTiptapEditor"

export default MinimalTiptapEditor
