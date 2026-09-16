import { useState } from "react";
import { login } from "./api";

function LoginPage() {
  const [username, setUsername] = useState(""); //state in react allows the variable to be re rendered
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent) { //this function runs when the onSubmit form below is submitted
    event.preventDefault();
    setError("");

    try {
      const token = await login({ username, password });
      console.log("Got token:", token);
    } catch (err) {
      setError("Invalid username or password");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Log In</h2>

      <div>
        <label>Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)} //every type fires the onChange, which updates the username state
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

      <button type="submit">Log In</button>
    </form>
  );
}

export default LoginPage;