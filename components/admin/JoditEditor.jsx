"use client";

import dynamic from "next/dynamic";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

export default function RichTextEditor({ value, onChange }) {
  const config = {
    readonly: false,
    height: 500,
    uploader: {
      insertImageAsBase64URI: false,
    },
    buttons:
      "source,|,bold,italic,underline,strikethrough,|,ul,ol,|,outdent,indent,|,font,fontsize,brush,paragraph,|,image,link,table,|,align,undo,redo,|,hr,eraser,copyformat,|,fullsize",
  };

  return (
    <JoditEditor
      value={value}
      config={config}
      onBlur={(newContent) => onChange(newContent)}
    />
  );
}