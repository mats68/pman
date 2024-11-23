// src/components/PasswordForm.tsx

import { useState } from "react";
import { PasswordEntry } from "../types/password";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PasswordFormProps {
  onSubmit: (entry: PasswordEntry) => void;
  initialData?: PasswordEntry;
  onClose: () => void;
}

export const PasswordForm = ({ onSubmit, initialData, onClose }: PasswordFormProps) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [username, setUsername] = useState(initialData?.username || "");
  const [password, setPassword] = useState(initialData?.password || "");
  const [category, setCategory] = useState(initialData?.category || "");

  const handleSubmit = () => {
    if (title && username && password && category) {
      onSubmit({ id: initialData?.id || "", title, username, password, category });
      onClose();
    }
  };

  return (
    <div className="p-4 border rounded shadow bg-white">
      <h2 className="text-lg font-bold mb-4">
        {initialData ? "Passwort bearbeiten" : "Neues Passwort hinzufügen"}
      </h2>
      <div className="mb-4">
        <Input placeholder="Titel" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div className="mb-4">
        <Input placeholder="Benutzername" value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div className="mb-4">
        <Input
          placeholder="Passwort"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <Input placeholder="Kategorie" value={category} onChange={(e) => setCategory(e.target.value)} />
      </div>
      <div className="flex gap-4">
        <Button onClick={handleSubmit}>{initialData ? "Speichern" : "Hinzufügen"}</Button>
        <Button variant="secondary" onClick={onClose}>
          Abbrechen
        </Button>
      </div>
    </div>
  );
};
