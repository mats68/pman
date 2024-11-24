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
import { ArrowBigRight, Pencil, SquarePlus, Trash2 } from "lucide-react";

declare const window: {
  find: any;
} & Window;

const STORAGE_KEY = "passwords";

const App: React.FC<{ secretKey: string }> = ({ secretKey }) => {
  const [passwords, setPasswords] = useState<PasswordEntry[] | null>(null); // Initial NULL, um Überschreiben zu vermeiden
  const [selectedPassword, setSelectedPassword] = useState<PasswordEntry | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  const [hasChanges, setHasChanges] = useState(false);

  const [filterText, setFilterText] = useState("");
  const [filteredPasswords, setFilteredPasswords] = useState(passwords);

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

  //Filter
  useEffect(() => {
    const timeout = setTimeout(() => {
      const lowerCaseFilter = filterText.toLowerCase();
      const filtered = passwords.filter((password) =>
        Object.values(password).join(" ").toLowerCase().includes(lowerCaseFilter)
      );
      setSelectedPassword(null);
      setFilteredPasswords(filtered);
    }, 300); // Verzögerung von 300ms

    return () => clearTimeout(timeout);
  }, [filterText, passwords]);

  // Copy User, PW: Event Listener für Tastenanschläge
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!selectedPassword) {
        return;
      }

      if (event.key === "F9") {
        navigator.clipboard.writeText(selectedPassword.username);
      } else if (event.key === "F10") {
        navigator.clipboard.writeText(selectedPassword.password);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedPassword]);

  const saveData = async () => {
    if (passwords !== null) {
      const sorted = [...passwords].sort((a, b) => a.title.localeCompare(b.title));
      if (isTauri()) {
        await saveToFile(sorted, secretKey);
      } else {
        saveToStorage(STORAGE_KEY, sorted, secretKey);
      }
      setPasswords(sorted);
      setHasChanges(false);
    }
  };

  const addPassword = (entry: PasswordEntry) => {
    if (passwords !== null) {
      setPasswords(() => {
        const id = crypto.randomUUID();
        const newPasswords = [...passwords, { ...entry, id }];
        const sel = newPasswords.find((n) => n.id === id);
        sel && setSelectedPassword(sel);
        return newPasswords;
      });
      setHasChanges(true);
      setIsDialogOpen(false);
    }
  };

  const updatePassword = (updatedEntry: PasswordEntry) => {
    if (passwords !== null) {
      setPasswords(passwords.map((entry) => (entry.id === updatedEntry.id ? updatedEntry : entry)));
      setHasChanges(true);
      setIsDialogOpen(false);
      setSelectedPassword(updatedEntry);
    }
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

  const searchWindow = () => {
    if (!filteredPasswords || filteredPasswords.length === 0) {
      return;
    }
    if (!selectedPassword) {
      setSelectedPassword(filteredPasswords[0]);
    }
    if (selectedPassword) {
      // const res = window.find(filterText, false, false, true);
      const res = window.find(filterText);
      if (!res) {
        const index = filteredPasswords.findIndex((p) => p.id === selectedPassword.id);
        if (index > -1 && filteredPasswords.length > index + 1) {
          setSelectedPassword(filteredPasswords[index + 1]);
        } else {
          alert("Keine weiteren Treffer");
        }
      }
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
      {!isDialogOpen && (
        <div>
          <div>
            {filteredPasswords && (
              <div className="flex">
                <div className="w-1/2 max-h overflow-y-auto">
                  <PasswordTable
                    passwords={filteredPasswords}
                    selectedPassword={selectedPassword}
                    filterText={filterText}
                    onRowClick={setSelectedPassword}
                  />
                </div>
                <div className="w-1/2 border-l pl-4 max-h">
                  {selectedPassword ? (
                    <div>
                      <h2 className="font-bold text-lg">Notizen für {selectedPassword.title}</h2>
                      <Notes notes={selectedPassword.notes} filterText={filterText} />
                    </div>
                  ) : (
                    <p className="text-gray-500">Keine Zeile ausgewählt.</p>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="footer">
            <div className="flex gap-4">
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
                <SquarePlus />
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
                <Pencil />
              </Button>
              <Button onClick={deletePassword} disabled={!selectedPassword} variant="destructive">
                <Trash2 />
              </Button>
              <input
                type="text"
                placeholder="Filter eingeben..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className="w-[200px] p-2 border rounded mb-4"
              />
              <Button onClick={searchWindow} disabled={!filterText}>
                <ArrowBigRight />
              </Button>
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
