import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { updateApplication, deleteApplication, type JobApplication } from "../api";

interface ApplicationItemProps {
  application: JobApplication;
  token: string;
  onUpdated: (updated: JobApplication) => void;
  onDeleted: (id: number) => void;
}

function ApplicationItem({ application, token, onUpdated, onDeleted }: ApplicationItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [companyName, setCompanyName] = useState(application.companyName); //this ensures the the fields are pre filled in when editing the job application
  const [jobTitle, setJobTitle] = useState(application.jobTitle);
  const [status, setStatus] = useState(application.status);
  const [dateApplied, setDateApplied] = useState(application.dateApplied);
  const [jobPostingUrl, setJobPostingUrl] = useState(application.jobPostingUrl);
  const [notes, setNotes] = useState(application.notes);

  async function handleSave() {
    if (!companyName.trim() || !jobTitle.trim()) {
    return;
  } 
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
  }

  async function handleDelete() {
    await deleteApplication(token, application.id);
    onDeleted(application.id);
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

        <div className="edit-actions">
          <button className="btn btn-primary" onClick={handleSave}>
            Save
          </button>
          <button className="btn-secondary" onClick={() => setIsEditing(false)}>
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
          {application.companyName} — {application.jobTitle}
        </span>
        <span className={`status-badge status-${application.status}`}>
          {application.status}
        </span>
      </div>
      <div className="application-actions">
        <button className="btn-icon" onClick={() => setIsEditing(true)}>
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