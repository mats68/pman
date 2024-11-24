import React, { useState } from "react";
import { marked } from "marked";

interface NotesProps {
  notes: string;
  filterText?: string
}

const highlightTextInHtml = (html: string, filter: string): string => {
  if (!filter) return html;

  // Erstelle einen DOM-Parser
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  // Finde und ersetze Text-Knoten rekursiv
  const highlightTextNodes = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.nodeValue || "";
      const regex = new RegExp(`(${filter})`, "gi");

      // Wenn der Filtertext gefunden wird, ersetze ihn mit <span>
      if (regex.test(text)) {
        const span = document.createElement("span");
        span.innerHTML = text.replace(regex, `<span class="bg-yellow-200">$1</span>`);
        node.replaceWith(span);
      }
    } else if (node.nodeType === Node.ELEMENT_NODE && node.childNodes) {
      // Rekursiv über alle Kindknoten iterieren
      node.childNodes.forEach(highlightTextNodes);
    }
  };

  highlightTextNodes(doc.body);

  return doc.body.innerHTML;
};

export const Notes = ({ notes, filterText }: NotesProps) => {
  // const highlightTextInHtml = (html: string, filter: string) => {
  //   if (!filter) return html;
  //   const regex = new RegExp(`(${filter})`, "gi");
  //   return html.replace(regex, `<span class="bg-yellow-200">$1</span>`);
  // };

  const rawHtml = marked(notes, { breaks: true, gfm: true });
  const highlightedHtml = { __html: highlightTextInHtml(rawHtml, filterText)};

  return <div className="prose" dangerouslySetInnerHTML={highlightedHtml || ""}></div>;
  
};

export default Notes;
