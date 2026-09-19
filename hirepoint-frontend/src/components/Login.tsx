import { useState } from "react";
import { login } from "../api";
import hirepointIcon from "../../public/favicon.svg";

interface LoginPageProps {
  onLoginSuccess: (token: string) => void;
  onSwitchToRegister: () => void;
}

function LoginPage({ onLoginSuccess , onSwitchToRegister}: LoginPageProps) {
  const [username, setUsername] = useState(""); //state in react allows the variable to be re rendered
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent) { //this function runs when the onSubmit form below is submitted
    event.preventDefault();
    setError("");

    try {
      const token = await login({ username, password });
      onLoginSuccess(token);
    } catch (err) {
      setError("Invalid username or password");
    }
  }

  return (
    <div className="auth-card">
    <img src={hirepointIcon} alt="HirePoint" width={48} height={48} style={{ display: "block", margin: "0 auto 16px" }} />
    <h2 style={{ textAlign: "center" }}>Log In</h2>

    <form onSubmit={handleSubmit}>
      <div className="field">
        <label>Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)} //every type fires the onChange, which updates the username state
        />
      </div>

      <div className="field">
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {error && <p className="error-text">{error}</p>}

      <button type="submit" className="btn btn-primary">
        Log In
      </button>
    </form>

    <p className="switch-text">
      Don't have a HirePoint account?{" "}
      <button type="button" className="btn-secondary" onClick={onSwitchToRegister}>
        Register
      </button>
    </p>
  </div>
);
}

export default LoginPage;