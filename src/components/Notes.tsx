import React, { useState } from "react";
import { marked } from "marked";

interface NotesProps {
  notes: string;
  filterText?: string
}

export const Notes = ({ notes, filterText }: NotesProps) => {
  const highlightTextInHtml = (html: string, filter: string) => {
    if (!filter) return html;
    const regex = new RegExp(`(${filter})`, "gi");
    return html.replace(regex, `<span class="bg-yellow-200">$1</span>`);
  };


  // const renderNotes = (notes: string) => {
  //   const rawHtml = marked(notes, { breaks: true, gfm: true });
  //   // const rawHtml = marked(item.notes.replace(/</g, "&lt;").replace(/>/g, "&gt;"));
  //   // Wende die Hervorhebung auf den generierten HTML-Inhalt an
  //   const highlightedHtml = highlightTextInHtml(rawHtml, filterText);

  //   return { __html: html };
  // };
  const rawHtml = marked(notes, { breaks: true, gfm: true });
  const highlightedHtml = { __html: highlightTextInHtml(rawHtml, filterText)};

  return <div className="prose" dangerouslySetInnerHTML={highlightedHtml || ""}></div>;
  
};

export default Notes;
