import React, { useState } from "react";
import LoginDialog from "./components/LoginDialog";
import App from "./App";

const AppWrapper: React.FC = () => {
  const [secretKey, setSecretKey] = useState<string | null>(null);

  const handleLogin = (key: string) => {
    setSecretKey(key);
  };

  if (!secretKey) {
    return <LoginDialog onLogin={handleLogin} />;
  }

  return <App secretKey={secretKey} />;
};

export default AppWrapper;
