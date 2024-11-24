// src/App.tsx

import { useEffect, useState } from "react";
import { saveToFile, loadFromFile } from "./utils/file";
import { saveToStorage, loadFromStorage } from "./utils/storage";
import { isTauri } from "./utils/env";
import { PasswordEntry } from "./types/password";
import { PasswordTable } from "./components/PasswordTable";
import { PasswordForm } from "./components/PasswordForm";
import { Button } from "@/components/ui/button";
import Notes from "./components/Notes";

const STORAGE_KEY = "passwords";

const App: React.FC<{ secretKey: string }> = ({ secretKey }) => {
  const [passwords, setPasswords] = useState<PasswordEntry[] | null>(null); // Initial NULL, um Überschreiben zu vermeiden
  const [selectedPassword, setSelectedPassword] = useState<PasswordEntry | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  const [hasChanges, setHasChanges] = useState(false);
  const [error, setError] = useState(false);

  // Daten laden (Tauri oder Browser)
  useEffect(() => {
    const loadData = async () => {
      if (isTauri()) {
        try {
          const fileData = await loadFromFile(secretKey);
          if (fileData) {
            setPasswords(fileData);
          } else {
            setPasswords([]);
          }
        } catch (error) {
          setError(true);
        }
      } else {
        const savedPasswords = loadFromStorage(STORAGE_KEY, secretKey);
        if (savedPasswords) {
          setPasswords(savedPasswords);
        } else {
          setPasswords([]);
        }
      }
    };
    loadData();
  }, []);

  // Daten geändert
  // useEffect(() => {
  //   setHasChanges(true);
  // }, [passwords]);

  const saveData = async () => {
    if (passwords !== null) {
      if (isTauri()) {
        await saveToFile(passwords, secretKey);
      } else {
        saveToStorage(STORAGE_KEY, passwords, secretKey);
      }
    }
  };

  const addPassword = (entry: PasswordEntry) => {
    if (passwords !== null) {
      console.log("entry", entry);
      setPasswords([...passwords, { ...entry, id: crypto.randomUUID() }]);
      setHasChanges(true);      
      setIsDialogOpen(false);
    }
  };

  const updatePassword = (updatedEntry: PasswordEntry) => {
    console.log("updatedEntry", updatedEntry);
    setPasswords(passwords.map((entry) => (entry.id === updatedEntry.id ? updatedEntry : entry)));
    setHasChanges(true);      
    setIsDialogOpen(false);
  };

  const cancelEdit = () => {
    setIsDialogOpen(false);
  };

  const deletePassword = () => {
    if (selectedPassword) {
      setPasswords(passwords.filter((entry) => entry.id !== selectedPassword.id));
      setHasChanges(true);      
      setSelectedPassword(null);
    }
  };

  if (error) {
    return <div>Falsches Passwort</div>;
  }

  if (passwords === null) {
    return <div>Lade Daten...</div>; // Zeige Ladezustand, solange Daten nicht geladen sind
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Passwortmanager</h1>
      {!isDialogOpen && (
        <div>
          <div className="mb-4 flex gap-4">
            <Button
              onClick={() => {
                saveData();
              }}
              disabled={!hasChanges}
              className="bg-blue-500 text-white px-4 py-2 rounded mr-8"
            >
              Speichern
            </Button>

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
          <div className="flex">
            <div className="w-1/2">
              <PasswordTable
                passwords={passwords}
                selectedPassword={selectedPassword}
                onRowClick={setSelectedPassword}
              />
            </div>
            <div className="w-1/2 border-l pl-4">
              {selectedPassword ? (
                <div>
                  <h2 className="font-bold text-lg">Notizen für {selectedPassword.title}</h2>
                  <Notes notes={selectedPassword.notes}/>
                  {/* <div className="mt-2text-gray-600 whitespace-pre">{selectedPassword.notes}</div> */}
                </div>
              ) : (
                <p className="text-gray-500">Keine Zeile ausgewählt.</p>
              )}
            </div>
          </div>
        </div>
      )}
      {isDialogOpen && (
        <PasswordForm
          onSubmit={dialogMode === "add" ? addPassword : updatePassword}
          onCancelEdit={cancelEdit}
          initialData={dialogMode === "edit" ? selectedPassword : undefined}
          onClose={() => setIsDialogOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
