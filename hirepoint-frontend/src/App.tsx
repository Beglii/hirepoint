import { useState, useEffect } from "react";
import LoginPage from "./components/Login";
import RegisterPage from "./components/Register";
import LandingPage from "./components/Landing";
import Dashboard from "./components/Dashboard";
import { setSessionExpiredHandler } from "./api";
import "./index.css";

function App() {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  const [authView, setAuthView] = useState<"landing" | "login" | "register">("landing"); //logged out visitors start on the landing page

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  useEffect(() => { //tells api.ts what to do when the backend rejects the token
    setSessionExpiredHandler(() => {
      setToken(null);
      setAuthView("login");
    });
  }, []);

  function handleLogout() {
  setToken(null);
  }

  if (!token) {
    if (authView === "landing") {
      return (
        <div className="page">
          <LandingPage
            onGetStarted={() => setAuthView("register")}
            onLogin={() => setAuthView("login")}
          />
        </div>
      );
    }
    if (authView === "login") {
      return (
        <div className="page">
          <LoginPage
            onLoginSuccess={setToken}
            onSwitchToRegister={() => setAuthView("register")}
            onBack={() => setAuthView("landing")}
          />
        </div>
      );
    }
    return (
      <div className="page">
        <RegisterPage
          onLoginSuccess={setToken}
          onSwitchToLogin={() => setAuthView("login")}
          onBack={() => setAuthView("landing")}
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