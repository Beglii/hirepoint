import { useState, useEffect } from "react";
import { getApplications, type JobApplication } from "./api";

interface DashboardProps {
  token: string;
}

function Dashboard({ token }: DashboardProps) {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [error, setError] = useState("");

  useEffect(() => { //this ensures the applications are fetched automatically
    async function fetchData() {
      try {
        const data = await getApplications(token);
        setApplications(data);
      } catch (err) {
        setError("Failed to load applications");
      }
    }

    fetchData();
  }, [token]); //re runs the code block above if token's value is different

  return (
    <div>
      <h2>My Applications</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {applications.map((app) => (
          <li key={app.id}> 
            {app.companyName} — {app.jobTitle} — {app.status}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;