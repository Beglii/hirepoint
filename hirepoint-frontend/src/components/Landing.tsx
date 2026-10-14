interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

//made up examples for the dashboard preview, not real user data
const exampleApplications = [
  { companyName: "Stripe", jobTitle: "SWE Intern", status: "INTERVIEWING" },
  { companyName: "Datadog", jobTitle: "Backend Intern", status: "APPLIED" },
  { companyName: "Shopify", jobTitle: "Developer Intern", status: "OFFER" },
];

const steps = ["Create an account", "Add each application", "Update its status"];

//first screen a logged out visitor sees, explains what HirePoint is before asking them to sign in
function LandingPage({ onGetStarted, onLogin }: LandingPageProps) {
  return (
    <div className="landing">
      <section className="landing-hero">
        <div className="landing-intro">
          <div className="landing-brand">
            <img src="/favicon.svg" alt="" width={32} height={32} />
            <span>HirePoint</span>
          </div>
          <h1 className="landing-title">Stop losing track of your job applications</h1>
          <p className="landing-tagline">
            Every company, role and status in one place, from applied to offer.
          </p>
          <div className="landing-actions">
            <button type="button" className="btn btn-primary" onClick={onGetStarted}>
              Get Started
            </button>
            <button type="button" className="btn-secondary" onClick={onLogin}>
              Log In
            </button>
          </div>
        </div>
        <div className="landing-preview" aria-hidden="true">
          <p className="landing-preview-title">My Applications</p>
          <ul className="application-list">
            {exampleApplications.map((app) => (
              <li key={app.companyName} className="application-card">
                <div className="application-info">
                  <span className="application-company">
                    {app.companyName} — {app.jobTitle}
                  </span>
                  <span className={`status-badge status-${app.status}`}>{app.status}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="landing-how">
        <h2>How it works</h2>
        <ol className="landing-steps">
          {steps.map((step, index) => (
            <li key={step} className="landing-step">
              <span className="landing-step-number">Step {index + 1}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
        <div className="landing-flow">
          <span className="status-badge status-APPLIED">APPLIED</span>
          <span className="landing-flow-arrow">→</span>
          <span className="status-badge status-INTERVIEWING">INTERVIEWING</span>
          <span className="landing-flow-arrow">→</span>
          <span className="status-badge status-OFFER">OFFER</span>
          <span className="landing-flow-or">or</span>
          <span className="status-badge status-REJECTED">REJECTED</span>
        </div>
      </section>

      <footer className="landing-footer">
        <a href="/privacy.html">Privacy Policy</a>
      </footer>
    </div>
  );
}

export default LandingPage;
