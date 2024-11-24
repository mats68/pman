// src/components/PasswordForm.tsx

import { useEffect, useState } from "react";
import { PasswordEntry } from "../types/password";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { loadCategories } from "@/utils/file";
import { default_categeories } from "@/data/categories";
import { isTauri } from "@/utils/env";

interface PasswordFormProps {
  onSubmit: (entry: PasswordEntry) => void;
  onCancelEdit: () => void;
  initialData?: PasswordEntry;
  onClose: () => void;
}

export const PasswordForm = ({
  onSubmit,
  onCancelEdit,
  initialData,
  onClose,
}: PasswordFormProps) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [username, setUsername] = useState(initialData?.username || "");
  const [password, setPassword] = useState(initialData?.password || "");
  const [category, setCategory] = useState(initialData?.category || "");
  const [notes, setNotes] = useState(initialData?.notes || "");
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      let loadedCategories = default_categeories;
      if (isTauri()) {
        loadedCategories = await loadCategories();
      }
      setCategories(loadedCategories);
    };
    fetchCategories();
  }, []);

  const handleSubmit = () => {
    if (title && category) {
      onSubmit({ id: initialData?.id || "", title, category, username, password, notes });
      onClose();
    }
  };

  return (
    <form className="space-y-4">
      <div className="flex">
        <Button
          type="button"
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Speichern
        </Button>
        <Button type="button" onClick={onCancelEdit} className="ml-4 text-white px-4 py-2 rounded">
          Abbrechen
        </Button>
      </div>
      <div className="flex">
        <div className="w-1/2">
          <div>
            <label className="block font-medium">Kategorie</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border rounded p-2"
            >
              <option value="">Kategorie auswählen</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium">Titel</label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded p-2"
            />
          </div>

          <div>
            <label className="block font-medium">Benutzername</label>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border rounded p-2"
            />
          </div>

          <div>
            <label className="block font-medium">Passwort</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded p-2"
            />
          </div>
        </div>
        <div className="ml-2 w-1/2">
          <div>
            <label className="block font-medium">Notizen</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border rounded p-2"
              rows={20}
            />
          </div>
        </div>
      </div>
    </form>
  );
};
