import { useState, useEffect } from "react";
import { getApplications, type JobApplication } from "../api";
import AddApplicationForm from "./AddApplicationForm";
import ApplicationItem from "./ApplicationItem";

interface DashboardProps {
  token: string;
  onLogout: () => void;
}

function Dashboard({ token, onLogout }: DashboardProps) {
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

  function handleApplicationAdded(newApp: JobApplication) { //uses the spread operator, copies every existing element out of applications into a brand new array and adds one at the end
    setApplications([...applications, newApp]);
  }

  function handleApplicationUpdated(updatedApp: JobApplication) {
    setApplications(
      applications.map((app) => (app.id === updatedApp.id ? updatedApp : app))
    );
  }

  function handleApplicationDeleted(id: number) {
    setApplications(applications.filter((app) => app.id !== id));
  }

  return (
    <div>
      <h2>My Applications</h2>
      <button onClick={onLogout}>Log Out</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {applications.map((app) => (
          <ApplicationItem
            key={app.id}
            application={app}
            token={token}
            onUpdated={handleApplicationUpdated}
            onDeleted={handleApplicationDeleted}
          />
        ))}
      </ul>
      <AddApplicationForm token={token} onApplicationAdded={handleApplicationAdded} />
    </div>
  );
}

export default Dashboard;