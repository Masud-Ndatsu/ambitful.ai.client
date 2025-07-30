import React, { useState, useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const TextEditor = ({ id, value, onChange, placeholder, height = "200px" }) => {
  const quillRef = useRef(null);
  const [editorHtml, setEditorHtml] = useState(value || "");

  // Initialize the editor with the provided id
  useEffect(() => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      editor.root.id = id;
    }
  }, [id]);

  // Propagate changes to parent component
  useEffect(() => {
    onChange(editorHtml);
  }, [editorHtml, onChange]);

  const handleChange = (html) => {
    setEditorHtml(html);
  };

  // Editor modules configuration
  const modules = {
    toolbar: [
      ["bold", "italic", "underline"],
      [{ list: "bullet" }, { list: "ordered" }],
      ["link", "clean"],
    ],
  };

  // Editor formats configuration
  const formats = [
    "bold",
    "italic",
    "underline",
    "list",
    "bullet",
    "ordered",
    "link",
  ];

  return (
    <div className="text-editor-container">
      <ReactQuill
        ref={quillRef}
        value={editorHtml}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        style={{ height }}
        className="sticky-toolbar-editor"
      />
    </div>
  );
};

export default TextEditor;
