// "use client";

// import { useEffect, useRef } from "react";

// declare global {
//   interface Window {
//     Jodit: any;
//   }
// }

// interface Props {
//   value: string;
//   onChange: (value: string) => void;
// }

// export default function JoditCDNEditor({ value, onChange }: Props) {
//   const textareaRef = useRef<HTMLTextAreaElement | null>(null);
//   const editorRef = useRef<any>(null);

//   useEffect(() => {
//     if (!window.Jodit) return;

//     if (!editorRef.current && textareaRef.current) {
//       editorRef.current = new window.Jodit(textareaRef.current, {
//         height: 400,
//         toolbarAdaptive: false,
//         buttons: [
//           "bold",
//           "italic",
//           "underline",
//           "|",
//           "ul",
//           "ol",
//           "|",
//           "font",
//           "fontsize",
//           "|",
//           "image",
//           "link",
//           "table",
//           "|",
//           "align",
//           "undo",
//           "redo",
//           "|",
//           "hr",
//           "eraser",
//           "fullsize"
//         ],

//         events: {
//           blur: (newValue: string) => {
//             onChange(editorRef.current.value);
//           }
//         }
//       });

//       editorRef.current.value = value || "";
//     }

//     return () => {
//       if (editorRef.current) {
//         editorRef.current.destruct();
//         editorRef.current = null;
//       }
//     };
//   }, []);

//   useEffect(() => {
//     if (editorRef.current && value !== editorRef.current.value) {
//       editorRef.current.value = value || "";
//     }
//   }, [value]);

//   return <textarea ref={textareaRef} />;
// }
"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    Jodit: any;
  }
}

interface JoditCDNEditorProps {
  value?: string;
  onChange: (content: string) => void;
}

export default function JoditCDNEditor({
  value = "",
  onChange,
}: JoditCDNEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const editorRef = useRef<any>(null);

  useEffect(() => {
    // Load CSS
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://cdn.jsdelivr.net/npm/jodit@latest/build/jodit.min.css";
    document.head.appendChild(link);

    // Load Script
    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/npm/jodit@latest/build/jodit.min.js";
    script.async = true;

    script.onload = () => {
      if (!textareaRef.current) return;
editorRef.current = new window.Jodit(textareaRef.current, {
  height: 500,
  toolbarSticky: false,
  toolbarAdaptive: false,

  	askBeforePasteFromWord: false,
	pasteFromWord: {
		enable: true,
		convertUnitsToPixel: true
	},
	beautifyHTML: false,
	defaultActionOnPaste:'INSERT_AS_HTML',

  pasteFromWordActionList: [
    { value: 'keep', text: 'Keep Formatting' },
    { value: 'clean', text: 'Clean HTML' },
    { value: 'insert_only_text', text: 'Plain Text (No Formatting)' }
  ],

  events: {
    processPasteFromWord: function (html: string, action: string) {
      // 🔥 detect user choice
      if (action === 'insert_only_text') {
        return stripAllHTML(html);
      }

      if (action === 'clean') {
        return cleanHTML(html);
      }

      return html;
    },

    beforePaste: function (event: any) {
      const text = event.clipboardData?.getData('text/html');

      // 🔥 fallback: always clean if plain paste (CTRL+V normal)
      if (text) {
        event.preventDefault();
        
        editorRef.current.selection.insertHTML(stripAllHTML(text));
        return false;
      }
    }
  }
});
//      editorRef.current = new window.Jodit(textareaRef.current, {
//   height: 500,
//   toolbarSticky: false,
//   toolbarAdaptive: false,
//   showXPathInStatusbar: false,

//   // ✅ Paste settings
//   askBeforePasteHTML: true,
//   askBeforePasteFromWord: true,
//   processPasteFromWord: true,
//   defaultActionOnPasteFromWord: 'clean',

//   pasteFromWordActionList: [
//     { value: 'keep', text: 'Keep Formatting' },
//     { value: 'clean', text: 'Clean HTML' },
//     { value: 'insert_only_text', text: 'Plain Text (No Styles)' }
//   ],

//   // ✅ Ordered list styles
//   controls: {
//     ol: {
//       list: {
//         '1': 'Default',
//         'lower-alpha': 'Lower Alpha',
//         'lower-roman': 'Lower Roman',
//         'upper-alpha': 'Upper Alpha',
//         'upper-roman': 'Upper Roman'
//       }
//     }
//   },

//   // ✅ Toolbar
//   buttons: [
//     "source",
//     "|",
//     "bold",
//     "italic",
//     "underline",
//     "strikethrough",
//     "eraser",
//     "|",
//     "superscript",
//     "subscript",
//     "|",
//     "ul",
//     "ol",
//     "outdent",
//     "indent",
//     "|",
//     "font",
//     "fontsize",
//     "brush",
//     "paragraph",
//     "|",
//     "left",
//     "center",
//     "right",
//     "justify",
//     "|",
//     "link",
//     "unlink",
//     "image",
//     "video",
//     "file",
//     "|",
//     "table",
//     "hr",
//     "symbol",
//     "emoji",
//     "|",
//     "code",
//     "fullsize",
//     "print",
//     "|",
//     "selectall",
//     "copyformat",
//     "|",
//     "undo",
//     "redo",
//     "|",
//     "preview",
//     "find",
//   ],

//   // ✅ 🔥 CLEAN INLINE STYLES (IMPORTANT)
  
// events: {
  
//   processPasteFromWord: function (html: string) {
//     return cleanHTML(html);
//   },

//   beforePaste: function (event: any) {
//     try {
//       const html = event.clipboardData?.getData('text/html');

//       if (html) {
//         const cleaned = cleanHTML(html);
//         event.preventDefault();

//         editorRef.current.selection.insertHTML(cleaned);
//         return false;
//       }
//     } catch (e) {
//       console.warn('Paste error:', e);
//     }
//   }
// }
// //  events: {
// //     beforePaste: function (event: any) {
// //       try {
// //         const html = event.clipboardData?.getData('text/html');

// //         if (html) {
// //           // Remove inline styles
// //           const cleaned = html
// //             .replace(/style="[^"]*"/gi, '')
// //             .replace(/class="[^"]*"/gi, '');

// //           event.clipboardData.setData('text/html', cleaned);
// //         }
// //       } catch (err) {
// //         console.warn('Paste clean failed:', err);
// //       }
// //     }
// //   }
// });

// ✅ set value
editorRef.current.value = value;

// ✅ change event
editorRef.current.events.on("change", (newContent: string) => {
  onChange(newContent);
});
function stripAllHTML(html: string) {
  // const div = document.createElement('div');
  // div.innerHTML = html;
console.log("Original HTML:", html);
  // return div.innerText || div.textContent || '';
   if (!html) return '';

  // Remove Word-specific tags
  html = html
    .replace(/<!--[\s\S]*?-->/gi, '') // comments
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/<meta[\s\S]*?>/gi, '') .replace(/style="[^"]*"/gi, '')
    .replace(/class="[^"]*"/gi, '')
    .replace(/<\/?span[^>]*>/gi, '')
    .replace(/<!--[\s\S]*?-->/gi, '')
        .replace(/<link[\s\S]*?>/gi, '');

  // Remove MS Word classes & attributes
  html = html
    .replace(/class="Mso[a-zA-Z0-9]*"/gi, '')
    .replace(/style="[^"]*"/gi, '') // 🔥 remove ALL inline styles
    .replace(/lang="[^"]*"/gi, '')
    .replace(/width="[^"]*"/gi, '')
    .replace(/height="[^"]*"/gi, '')
    .replace(/align="[^"]*"/gi, '');

  // Remove empty tags
  html = html.replace(/<(\w+)[^>]*>\s*<\/\1>/gi, '');

  // Replace <span> with plain text
  html = html.replace(/<\/?span[^>]*>/gi, '');

  // Replace multiple spaces
  html = html.replace(/\s+/g, ' ');

  return html.trim();
}
  function cleanHTML(html: string) {
  if (!html) return '';

  // Remove Word-specific tags
  html = html
    .replace(/<!--[\s\S]*?-->/gi, '') // comments
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/<meta[\s\S]*?>/gi, '') .replace(/style="[^"]*"/gi, '')
    .replace(/class="[^"]*"/gi, '')
    .replace(/<\/?span[^>]*>/gi, '')
    .replace(/<!--[\s\S]*?-->/gi, '')
        .replace(/<link[\s\S]*?>/gi, '');

  // Remove MS Word classes & attributes
  html = html
    .replace(/class="Mso[a-zA-Z0-9]*"/gi, '')
    .replace(/style="[^"]*"/gi, '') // 🔥 remove ALL inline styles
    .replace(/lang="[^"]*"/gi, '')
    .replace(/width="[^"]*"/gi, '')
    .replace(/height="[^"]*"/gi, '')
    .replace(/align="[^"]*"/gi, '');

  // Remove empty tags
  html = html.replace(/<(\w+)[^>]*>\s*<\/\1>/gi, '');

  // Replace <span> with plain text
  html = html.replace(/<\/?span[^>]*>/gi, '');

  // Replace multiple spaces
  html = html.replace(/\s+/g, ' ');

  return html.trim();
}  };

    document.body.appendChild(script);

    return () => {
      if (editorRef.current) {
        editorRef.current.destruct();
      }
    };
  }, []);

  return <textarea ref={textareaRef} />;
}