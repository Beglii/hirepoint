import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { updateApplication, deleteApplication, type JobApplication } from "../api";

interface ApplicationItemProps {
  number: number;
  application: JobApplication;
  token: string;
  onUpdated: (updated: JobApplication) => void;
  onDeleted: (id: number) => void;
}

function ApplicationItem({ number, application, token, onUpdated, onDeleted }: ApplicationItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [companyName, setCompanyName] = useState(application.companyName); //this ensures the the fields are pre filled in when editing the job application
  const [jobTitle, setJobTitle] = useState(application.jobTitle);
  const [status, setStatus] = useState(application.status);
  const [dateApplied, setDateApplied] = useState(application.dateApplied);
  const [jobPostingUrl, setJobPostingUrl] = useState(application.jobPostingUrl);
  const [notes, setNotes] = useState(application.notes);
  const [error, setError] = useState("");

  async function handleSave() {
    setError("");
    if (!companyName.trim() || !jobTitle.trim()) {
      setError("Company name and job title are required");
      return;
    }

    try {
      const updated = await updateApplication(token, application.id, {
        companyName,
        jobTitle,
        status,
        dateApplied,
        jobPostingUrl,
        notes,
      });
      onUpdated(updated); //tells the update to the parent Dashboard
      setIsEditing(false);
    } catch { //form stays open with the user's changes so they can try again
      setError("Failed to save changes. Please try again.");
    }
  }

  async function handleDelete() {
    setError("");
    try {
      await deleteApplication(token, application.id);
      onDeleted(application.id);
    } catch {
      setError("Failed to delete application. Please try again.");
    }
  }

  function startEditing() {
    setError("");
    setIsEditing(true);
  }

  function cancelEditing() {
    setError("");
    setIsEditing(false);
  }

  if (isEditing) { //toggle between the editing states
    return (
      <li className="application-card application-card-editing">
        <div className="field">
          <label>Company Name</label>
          <input value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
        </div>

        <div className="field">
          <label>Job Title</label>
          <input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
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
          <input value={jobPostingUrl} onChange={(e) => setJobPostingUrl(e.target.value)} />
        </div>

        <div className="field">
          <label>Notes</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>

        {error && <p className="error-text">{error}</p>}

        <div className="edit-actions">
          <button className="btn btn-primary" onClick={handleSave}>
            Save
          </button>
          <button className="btn-secondary" onClick={cancelEditing}>
            Cancel
          </button>
        </div>
      </li>
    );
  }

  return (
    <li className="application-card">
      <div className="application-info">
        <span className="application-company">
          <span className="application-number">#{number}</span>
          {application.companyName} — {application.jobTitle}
        </span>
        <span className={`status-badge status-${application.status}`}>
          {application.status}
        </span>
        {error && <p className="error-text">{error}</p>}
      </div>
      <div className="application-actions">
        <button className="btn-icon" onClick={startEditing}>
          <Pencil size={16} />
        </button>
        <button className="btn-icon danger" onClick={handleDelete}>
          <Trash2 size={16} />
        </button>
      </div>
    </li>
  );
}

export default ApplicationItem;