const API_BASE_URL = "http://localhost:8080/api"; // backend api calls 

interface LoginRequest {
  username: string;
  password: string;
}

export async function login(credentials: LoginRequest): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, { //making HTTP request
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  return response.text();
}