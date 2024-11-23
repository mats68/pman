// src/components/EditPasswordDialog.tsx

import { useState } from "react";
import { PasswordEntry } from "../types/password";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface EditPasswordDialogProps {
  entry: PasswordEntry;
  onSubmit: (updatedEntry: PasswordEntry) => void;
  onClose: () => void;
}

export const EditPasswordDialog = ({
  entry,
  onSubmit,
  onClose,
}: EditPasswordDialogProps) => {
  const [title, setTitle] = useState(entry.title);
  const [username, setUsername] = useState(entry.username);
  const [password, setPassword] = useState(entry.password);

  const handleSave = () => {
    onSubmit({ ...entry, title, username, password });
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Passwort bearbeiten</DialogTitle>
        </DialogHeader>
        <div>
          <Input
            placeholder="Titel"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input
            placeholder="Benutzername"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            placeholder="Passwort"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>Speichern</Button>
          <Button variant="secondary" onClick={onClose}>
            Abbrechen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
