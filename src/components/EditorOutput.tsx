"use client"
import dynamic from "next/dynamic"
import { FC } from "react"

const Output = dynamic(
  async () => (await import("editorjs-react-renderer")).default,
  { ssr: false },
)

interface EditorOutputProps {
  content: any
}
const style = {
  paragraph: {
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
  },
}
const renderers = {
  code: CustomCodeRenderer,
}

const EditorOutput: FC<EditorOutputProps> = ({ content }) => {
  return (
    <Output
      style={style}
      data={content}
      className="text-sm "
      renderer={renderers}
    />
  )
}

function CustomCodeRenderer({ data }: any) {
  return (
    <pre className="bg-gray-800 rounded-md p-4">
      <code className="text-gray-100 text-sm">{data.code}</code>
    </pre>
  )
}

export default EditorOutput
