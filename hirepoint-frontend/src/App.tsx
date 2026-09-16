import { useState, useEffect } from "react";
import LoginPage from "./Login";
import Dashboard from "./Dashboard";

function App() {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  if (!token) {
    return <LoginPage onLoginSuccess={setToken} />;
  }

  return <Dashboard token={token} />;
}

export default App;