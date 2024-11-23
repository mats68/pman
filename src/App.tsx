import { useState } from "react";
import { LoginDialog } from "./components/LoginDialog";

export default function App() {
  const [isLoginOpen, setLoginOpen] = useState(true);

  const handleLogin = (password: string) => {
    console.log("Master-Passwort:", password);
    setLoginOpen(false); // Dialog schließen, wenn das Passwort eingegeben wurde
  };

  return (
    <div>
      <LoginDialog isOpen={isLoginOpen} onSubmit={handleLogin} />
      {!isLoginOpen && (
        <div>
          <h1 className="text-2xl font-bold">Passwortmanager</h1>
          {/* Hauptinhalt des Passwortmanagers */}
        </div>
      )}
    </div>
  );
}
