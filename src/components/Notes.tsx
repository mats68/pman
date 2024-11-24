import React, { useState } from "react";
import { marked } from "marked";

interface NotesProps {
  notes?: string;
}

export const Notes = ({ notes }: NotesProps) => {
  const renderNotes = (notes: string) => {
    const html = marked(notes, { breaks: true, gfm: true });
    // const html = marked(notes.replace(/\*(.*?)\*/g, "**$1**")); // Markdown umwandeln
    return { __html: html }; // React benötigt `dangerouslySetInnerHTML`
  };

  return <div className="prose" dangerouslySetInnerHTML={renderNotes(notes || "")}></div>;
};

export default Notes;
