// src/App.tsx

import { useState } from "react";
import { PasswordTable } from "./components/PasswordTable";
import { PasswordForm } from "./components/PasswordForm";
import { PasswordEntry } from "./types/password";
import { Button } from "@/components/ui/button";

export default function App() {
  const [passwords, setPasswords] = useState<PasswordEntry[]>([]);
  const [selectedPassword, setSelectedPassword] = useState<PasswordEntry | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Dialog für Hinzufügen/Bearbeiten
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add"); // Modus für den Dialog

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
      setSelectedPassword(null); // Auswahl zurücksetzen
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Passwortmanager</h1>
      {/* Buttons */}
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
          disabled={!selectedPassword} // Nur aktiv, wenn eine Zeile ausgewählt ist
        >
          Bearbeiten
        </Button>
        <Button onClick={deletePassword} disabled={!selectedPassword} variant="destructive">
          Löschen
        </Button>
      </div>
      {/* Passworttabelle */}
      <PasswordTable
        passwords={passwords}
        selectedPassword={selectedPassword}
        onRowClick={setSelectedPassword}
      />
      {/* Dialog */}
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
