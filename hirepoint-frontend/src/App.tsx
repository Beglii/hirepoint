import { useState, useEffect } from "react";
import LoginPage from "./components/Login";
import RegisterPage from "./components/Register";
import Dashboard from "./components/Dashboard";

function App() {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  const [authView, setAuthView] = useState<"login" | "register">("login"); //auth view can only be login or register

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  function handleLogout() {
  setToken(null);
  }

  if (!token) {
    if (authView === "login") {
      return (
        <LoginPage
          onLoginSuccess={setToken}
          onSwitchToRegister={() => setAuthView("register")}
        />
      );
    }
    return (
      <RegisterPage
        onLoginSuccess={setToken}
        onSwitchToLogin={() => setAuthView("login")}
      />
    );
  } return <Dashboard token={token} onLogout={handleLogout} />;
}

export default App;