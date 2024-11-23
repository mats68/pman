import React, { useState } from "react";

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
    <div className="login-dialog">
      <h1>Master-Passwort</h1>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Master-Passwort eingeben"
        className="border p-2 rounded"
      />
      <button onClick={handleLogin} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
        Login
      </button>
    </div>
  );
};

export default LoginDialog;
