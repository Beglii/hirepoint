import type { JobApplication } from "../api";

interface StatsRowProps {
  applications: JobApplication[];
}

//one tile per status, label is what the user sees, status is the value stored in the database
const statusTiles = [
  { label: "Applied", status: "APPLIED" },
  { label: "Interviewing", status: "INTERVIEWING" },
  { label: "Offers", status: "OFFER" },
  { label: "Rejected", status: "REJECTED" },
];

function StatsRow({ applications }: StatsRowProps) {
  //counted from the list on every render, so the numbers can never go out of sync
  function countByStatus(status: string) {
    return applications.filter((app) => app.status === status).length;
  }

  return (
    <div className="stats-row">
      <div className="stat-tile stat-tile-total">
        <span className="stat-label">Total</span>
        <span className="stat-value">{applications.length}</span>
      </div>
      {statusTiles.map((tile) => (
        <div key={tile.status} className="stat-tile">
          <span className="stat-label">
            <span className={`stat-dot dot-${tile.status}`} aria-hidden="true" />
            {tile.label}
          </span>
          <span className="stat-value">{countByStatus(tile.status)}</span>
        </div>
      ))}
    </div>
  );
}

export default StatsRow;
