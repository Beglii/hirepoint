import { useState } from "react";
import { createApplication, type JobApplication } from "../api";

interface AddApplicationFormProps {
  token: string;
  onApplicationAdded: (newApp: JobApplication) => void;
}

function AddApplicationForm({ token, onApplicationAdded }: AddApplicationFormProps) {
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [status, setStatus] = useState("APPLIED"); //automatically set it to applied
  const [dateApplied, setDateApplied] = useState("");
  const [jobPostingUrl, setJobPostingUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    try {
      const created = await createApplication(token, {
        companyName,
        jobTitle,
        status,
        dateApplied,
        jobPostingUrl,
        notes,
      });

      onApplicationAdded(created);

      setCompanyName("");
      setJobTitle("");
      setStatus("APPLIED");
      setDateApplied("");
      setJobPostingUrl("");
      setNotes("");
    } catch (err) {
      setError("Failed to create application");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add Application</h3>

      <div>
        <label>Company Name</label>
        <input
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        />
      </div>

      <div>
        <label>Job Title</label>
        <input
          type="text"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
        />
      </div>

      <div>
        <label>Status</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="APPLIED">Applied</option>
          <option value="INTERVIEWING">Interviewing</option>
          <option value="OFFER">Offer</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      <div>
        <label>Date Applied</label>
        <input
          type="date"
          value={dateApplied}
          onChange={(e) => setDateApplied(e.target.value)}
        />
      </div>

      <div>
        <label>Job Posting URL</label>
        <input
          type="text"
          value={jobPostingUrl}
          onChange={(e) => setJobPostingUrl(e.target.value)}
        />
      </div>

      <div>
        <label>Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button type="submit">Add Application</button>
    </form>
  );
}

export default AddApplicationForm;