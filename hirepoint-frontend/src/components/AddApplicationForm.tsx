import { useState } from "react";
import { createApplication, type JobApplication } from "../api";

interface AddApplicationFormProps {
  token: string;
  onApplicationAdded: (newApp: JobApplication) => void;
}

//today's date as YYYY-MM-DD in the user's own timezone, the format date inputs expect
function getTodayDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function AddApplicationForm({ token, onApplicationAdded }: AddApplicationFormProps) {
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [status, setStatus] = useState("APPLIED"); //automatically set it to applied
  const [dateApplied, setDateApplied] = useState(getTodayDate);
  const [jobPostingUrl, setJobPostingUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    if (!companyName.trim() || !jobTitle.trim()) {
    setError("Company name and job title are required");
    return;
  }

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
      setDateApplied(getTodayDate());
      setJobPostingUrl("");
      setNotes("");
    } catch {
      setError("Failed to create application");
    }
  }

  return (
    <div>
      <h3>Add Application</h3>

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label>Company Name</label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
        </div>

        <div className="field">
          <label>Job Title</label>
          <input
            type="text"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
          />
        </div>

        <div className="field">
          <label>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="APPLIED">Applied</option>
            <option value="INTERVIEWING">Interviewing</option>
            <option value="OFFER">Offer</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        <div className="field">
          <label>Date Applied</label>
          <input
            type="date"
            value={dateApplied}
            onChange={(e) => setDateApplied(e.target.value)}
            onClick={(e) => e.currentTarget.showPicker()}
          />
        </div>

        <div className="field">
          <label>Job Posting URL</label>
          <input
            type="text"
            value={jobPostingUrl}
            onChange={(e) => setJobPostingUrl(e.target.value)}
          />
        </div>

        <div className="field">
          <label>Notes</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>

        {error && <p className="error-text">{error}</p>}

        <button type="submit" className="btn btn-primary">
          Add Application
        </button>
      </form>
    </div>
  );
}

export default AddApplicationForm;