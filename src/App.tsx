// src/App.tsx

import { useEffect, useState } from "react";
import { saveToFile, loadFromFile } from "./utils/file";
import { saveToStorage, loadFromStorage } from "./utils/storage";
import { isTauri } from "./utils/env";
import { PasswordEntry } from "./types/password";
import { PasswordTable } from "./components/PasswordTable";
import { PasswordForm } from "./components/PasswordForm";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "passwords";

export default function App() {
  const [passwords, setPasswords] = useState<PasswordEntry[] | null>(null); // Initial NULL, um Überschreiben zu vermeiden
  const [selectedPassword, setSelectedPassword] = useState<PasswordEntry | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");

  // Daten laden (Tauri oder Browser)
  useEffect(() => {
    const loadData = async () => {
      if (isTauri()) {
        const fileData = await loadFromFile("passwords.json");
        if (fileData) {
          setPasswords(fileData); // Daten aus Datei setzen
        } else {
          setPasswords([]); // Keine Daten gefunden, leeres Array setzen
        }
      } else {
        const savedPasswords = localStorage.getItem(STORAGE_KEY);
        if (savedPasswords) {
          setPasswords(JSON.parse(savedPasswords)); // Daten aus localStorage setzen
        } else {
          setPasswords([]); // Keine Daten gefunden, leeres Array setzen
        }
      }
    };
    loadData();
  }, []);

  // Daten speichern (Tauri oder Browser)
  useEffect(() => {
    // Speichern nur ausführen, wenn passwords bereits geladen wurden (nicht NULL)
    if (passwords !== null) {
      const saveData = async () => {
        if (isTauri()) {
          await saveToFile("passwords.json", passwords);
        } else {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(passwords));
        }
      };
      saveData();
    }
  }, [passwords]);

  const addPassword = (entry: PasswordEntry) => {
    if (passwords !== null) {
      setPasswords([...passwords, { ...entry, id: crypto.randomUUID() }]);
      setIsDialogOpen(false);
  
    }    
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

  if (passwords === null) {
    return <div>Lade Daten...</div>; // Zeige Ladezustand, solange Daten nicht geladen sind
  }


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
        <Button onClick={deletePassword} disabled={!selectedPassword} variant="destructive">
          Löschen
        </Button>
      </div>
      {isDialogOpen && (
        <PasswordForm
          onSubmit={dialogMode === "add" ? addPassword : updatePassword}
          initialData={dialogMode === "edit" ? selectedPassword : undefined}
          onClose={() => setIsDialogOpen(false)}
        />
      )}
      <PasswordTable
        passwords={passwords}
        selectedPassword={selectedPassword}
        onRowClick={setSelectedPassword}
      />
    </div>
  );
}
