import { useEffect, useState } from "react";
import { isTauri } from "./utils/env";
import { saveToFile, loadFromFile } from "./utils/file";
import { PasswordEntry } from "./types/password";

const STORAGE_KEY = "passwords";

export default function App() {
  const [passwords, setPasswords] = useState<PasswordEntry[] | null>(null); // Initial NULL, um Überschreiben zu vermeiden

  // Daten laden
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

  // Daten speichern
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

  const addPassword = (password: PasswordEntry) => {
    if (passwords !== null) {
      setPasswords((prev) => [...(prev || []), password]); // Neuen Eintrag hinzufügen
    }
  };

  if (passwords === null) {
    return <div>Lade Daten...</div>; // Zeige Ladezustand, solange Daten nicht geladen sind
  }

  return (
    <div>
      <h1>Passwortmanager</h1>
      <button onClick={() => addPassword({ id: "1", title: "Test", username: "User", password: "12345", category: "General" })}>
        Passwort hinzufügen
      </button>
      <pre>{JSON.stringify(passwords, null, 2)}</pre>
    </div>
  );
}
