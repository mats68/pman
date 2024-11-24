import React, { useState } from "react";
import MDEditor from "@uiw/react-md-editor";

interface MarkdownProps {
    notes?: string;
    onChange: (val: string | undefined) => void;
  }
  
const MarkdownEditor = ({ notes, onChange }: MarkdownProps) => {
//   const [markdown, setMarkdown] = useState<string>(notes || "");


  return (
    <div className="p-4">
      <MDEditor value={notes} onChange={(val) => onChange(val)} height={400}/>
    </div>
  );
};

export default MarkdownEditor;
