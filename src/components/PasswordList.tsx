// src/components/PasswordList.tsx

import { PasswordEntry } from "../types/password";

interface PasswordListProps {
  passwords: PasswordEntry[];
  onEdit: (entry: PasswordEntry) => void;
}

export const PasswordList = ({ passwords, onEdit }: PasswordListProps) => {
  return (
    <div className="mt-4">
      {passwords.map((entry) => (
        <div key={entry.id} className="p-4 border rounded my-2 shadow">
          <h3 className="text-lg font-bold">{entry.title}</h3>
          <p>Benutzername: {entry.username}</p>
          <p>Passwort: {entry.password}</p>
          <button
            onClick={() => onEdit(entry)}
            className="text-blue-500 underline mt-2"
          >
            Bearbeiten
          </button>
        </div>
      ))}
    </div>
  );
};
