import { useState, useEffect } from "react";
import LoginPage from "./components/Login";
import RegisterPage from "./components/Register";
import Dashboard from "./components/Dashboard";
import "./index.css";

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
        <div className="page">
          <LoginPage
            onLoginSuccess={setToken}
            onSwitchToRegister={() => setAuthView("register")}
          />
        </div>
      );
    }
    return (
      <div className="page">
        <RegisterPage
          onLoginSuccess={setToken}
          onSwitchToLogin={() => setAuthView("login")}
        />
      </div>
    );
  }

  return (
    <div className="page">
      <Dashboard token={token} onLogout={handleLogout} />
    </div>
  );
}
export default App;