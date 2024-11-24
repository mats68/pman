import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface LoginDialogProps {
  onLogin: (key: string) => void;
}

const LoginDialog: React.FC<LoginDialogProps> = ({ onLogin }) => {
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (password.trim() === "") {
      alert("Bitte geben Sie ein Passwort ein!");
      return;
    }
    onLogin(password.trim());
  };

  return (
    <div className="p-4">
      <div className="font-bold mb-4">Passwort</div>
      <div>
        <Input
          autoFocus
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Master-Passwort eingeben"
          className="w-[40]"
        />
      </div>
      <Button onClick={handleLogin} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
        Login
      </Button>
    </div>
  );
};

export default LoginDialog;
