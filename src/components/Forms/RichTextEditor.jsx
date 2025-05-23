import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["clean"],
  ],
};

const formats = ["header", "bold", "italic", "list", "bullet"];

export default function RichTextEditor({ value, onChange, heightClass = "h-64", fullscreen = false }) {
  return (
    <div className={`bg-white border border-espressoy rounded p-2 ${fullscreen ? "h-[70vh]" : heightClass}`}>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        className="text-black h-full"
        style={{
          height: "100%",
          minHeight: "100%",
          maxHeight: "100%",
          overflowY: "auto",
          borderRadius: "0.25rem", // optional style polish
          display: "flex",
          flexDirection: "column",
        }}
      />
    </div>
  );
}
