import { useState } from "react";
import { register, login } from "../api";

interface RegisterPageProps {
  onLoginSuccess: (token: string) => void;
  onSwitchToLogin: () => void;
}

function RegisterPage({ onLoginSuccess, onSwitchToLogin }: RegisterPageProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    try { //after registering drop the user into the dashboard, no need to login again
      await register({ username, password });
      const token = await login({ username, password });
      onLoginSuccess(token);
    } catch (err) {
      setError("Registration failed, username may already be taken");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>

      <div>
        <label>Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <div>
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button type="submit">Register</button>
      <p>
        Already have an account?{" "}
        <button type="button" onClick={onSwitchToLogin}>
          Log In
        </button>
      </p>
    </form>
  );
}

export default RegisterPage;