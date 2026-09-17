const API_BASE_URL = "http://localhost:8080/api"; // backend api calls 

interface LoginRequest {
  username: string;
  password: string;
}

export interface JobApplication {
  id: number;
  companyName: string;
  jobTitle: string;
  status: string;
  dateApplied: string;
  jobPostingUrl: string;
  notes: string;
}

export interface NewJobApplication { //id is not here due to it automically being created
  companyName: string;
  jobTitle: string;
  status: string;
  dateApplied: string;
  jobPostingUrl: string;
  notes: string;
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

export async function getApplications(token: string): Promise<JobApplication[]> {
  const response = await fetch(`${API_BASE_URL}/applications`, { //GET method
    headers: {
      Authorization: `Bearer ${token}`, //the default header for tokenization
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch applications");
  }

  return response.json();
}

export async function createApplication(
  token: string,
  newApplication: NewJobApplication
): Promise<JobApplication> {
  const response = await fetch(`${API_BASE_URL}/applications`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(newApplication),
  });

  if (!response.ok) {
    throw new Error("Failed to create application");
  }

  return response.json();
}

export interface RegisterRequest {
  username: string;
  password: string;
}

export async function register(credentials: RegisterRequest): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error("Registration failed, username may already be taken");
  }
}