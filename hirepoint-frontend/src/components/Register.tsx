import { useState } from "react";
import { register, login } from "../api";
import hirepointIcon from "../../public/favicon.svg";

interface RegisterPageProps {
  onLoginSuccess: (token: string) => void;
  onSwitchToLogin: () => void;
}

function RegisterPage({ onLoginSuccess, onSwitchToLogin }: RegisterPageProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try { //after registering drop the user into the dashboard, no need to login again
      await register({ username, password });
      const token = await login({ username, password });
      onLoginSuccess(token);
    } catch (err) {
      setError("Registration failed, username may already be taken");
    }
  }

  return (
    <div className="auth-card">
      <img src="/favicon.svg" alt="HirePoint" width={48} height={48} style={{ display: "block", margin: "0 auto 16px" }} />
      <h2 style={{ textAlign: "center" }}>Register</h2>

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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

        <div className="field">
          <label>Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        {error && <p className="error-text">{error}</p>}

        <button type="submit" className="btn btn-primary">
          Register
        </button>
      </form>

      <p className="switch-text">
        Already have a HirePoint account?{" "}
        <button type="button" className="btn-secondary" onClick={onSwitchToLogin}>
          Log in
        </button>
      </p>
    </div>
  );
}
export default RegisterPage;