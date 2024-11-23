// src/App.tsx

import { useEffect, useState } from "react";
import { saveToFile, loadFromFile } from "./utils/file";
import { saveToStorage, loadFromStorage } from "./utils/storage";
import { isTauri } from "./utils/env";
import { PasswordEntry } from "./types/password";
import { PasswordTable } from "./components/PasswordTable";
import { PasswordForm } from "./components/PasswordForm";
import { Button } from "@/components/ui/button";

export default function App() {
  const [passwords, setPasswords] = useState<PasswordEntry[]>([]);
  const [selectedPassword, setSelectedPassword] = useState<PasswordEntry | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");

  // Daten laden (Tauri oder Browser)
  useEffect(() => {
    const loadData = async () => {
      const data = isTauri()
        ? await loadFromFile("passwords.json") // Tauri
        : loadFromStorage("passwords"); // Browser
      if (data) {
        setPasswords(data);
      }
    };
    loadData();
  }, []);

  // Daten speichern (Tauri oder Browser)
  useEffect(() => {
    const saveData = async () => {
      if (isTauri()) {
        await saveToFile("passwords.json", passwords); // Tauri
      } else {
        saveToStorage("passwords", passwords); // Browser
      }
    };
    saveData();
  }, [passwords]);

  const addPassword = (entry: PasswordEntry) => {
    setPasswords([...passwords, { ...entry, id: crypto.randomUUID() }]);
    setIsDialogOpen(false);
  };

  const updatePassword = (updatedEntry: PasswordEntry) => {
    setPasswords(passwords.map((entry) => (entry.id === updatedEntry.id ? updatedEntry : entry)));
    setIsDialogOpen(false);
  };

  const deletePassword = () => {
    if (selectedPassword) {
      setPasswords(passwords.filter((entry) => entry.id !== selectedPassword.id));
      setSelectedPassword(null);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Passwortmanager</h1>
      <div className="mb-4 flex gap-4">
        <Button
          onClick={() => {
            setDialogMode("add");
            setIsDialogOpen(true);
          }}
        >
          Hinzufügen
        </Button>
        <Button
          onClick={() => {
            if (selectedPassword) {
              setDialogMode("edit");
              setIsDialogOpen(true);
            }
          }}
          disabled={!selectedPassword}
        >
          Bearbeiten
        </Button>
        <Button
          onClick={deletePassword}
          disabled={!selectedPassword}
          variant="destructive"
        >
          Löschen
        </Button>
      </div>
      <PasswordTable
        passwords={passwords}
        selectedPassword={selectedPassword}
        onRowClick={setSelectedPassword}
      />
      {isDialogOpen && (
        <PasswordForm
          onSubmit={dialogMode === "add" ? addPassword : updatePassword}
          initialData={dialogMode === "edit" ? selectedPassword : undefined}
          onClose={() => setIsDialogOpen(false)}
        />
      )}
    </div>
  );
}
