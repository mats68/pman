import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface LoginDialogProps {
  isOpen: boolean;
  onSubmit: (password: string) => void;
}

export const LoginDialog = ({ isOpen, onSubmit }: LoginDialogProps) => {
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    if (password.trim()) {
      onSubmit(password); // Master-Passwort an übergeordneten State weitergeben
      setPassword(""); // Passwortfeld leeren
    }
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Login</DialogTitle>
        </DialogHeader>
        <div>
          <Input
            type="password"
            placeholder="Master-Passwort"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Einloggen</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
