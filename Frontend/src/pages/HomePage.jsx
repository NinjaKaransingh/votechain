import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import "../styles/HomePage.css";

const stats = [
  { num: "24", label: "Active Polls" },
  { num: "1.4K", label: "Votes Cast" },
  { num: "86", label: "Candidates" },
];

const tickerItems = [
  "Arun K. just voted in City Council Poll",
  "Meena R. registered as candidate",
  "Vikram S. just voted in Budget Allocation",
  "Tech Policy poll closes in 2 hrs",
  "Arun K. just voted in City Council Poll",
  "Meena R. registered as candidate",
  "Vikram S. just voted in Budget Allocation",
  "Tech Policy poll closes in 2 hrs",
];

const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  return (
    <div className="vs-root">
      <div className="vs-bg-grid" aria-hidden="true" />

      {!isAuthenticated && (
        <button
          onClick={() => navigate("/login")}
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            padding: "8px 18px",
            borderRadius: 8,
            border: "1px solid rgba(0,0,0,0.15)",
            background: "#fff",
            fontWeight: 600,
            cursor: "pointer",
            zIndex: 2,
          }}
        >
          Log in
        </button>
      )}

      <div className="vs-badge">
        <span className="vs-badge-dot" />
        Secure · Transparent · Realtime
      </div>

      <h1 className="vs-headline">
        YOUR
        <br />
        <span className="vs-headline-accent">VOICE</span>
        <br />
        COUNTS
      </h1>

      <p className="vs-subtext">
        A fair and open platform to nominate candidates, cast your vote, and
        watch results unfold live.
      </p>

      <div className="vs-cards">
        <div
          className="vs-card vs-card--green"
          onClick={() => navigate("/register")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && navigate("/register")}
        >
          <div className="vs-icon-wrap vs-icon-wrap--green">★</div>
          <p className="vs-card-title">Register as Candidate</p>
          <p className="vs-card-desc">
            Put your name on the ballot. Set up your profile and let people vote
            for you.
          </p>
          <div className="vs-card-cta vs-card-cta--green">
            Get started <span className="vs-arrow">→</span>
          </div>
        </div>

        <div
          className="vs-card vs-card--blue"
          onClick={() => navigate("/vote")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && navigate("/vote")}
        >
          <div className="vs-icon-wrap vs-icon-wrap--blue">✓</div>
          <p className="vs-card-title">Cast Your Vote</p>
          <p className="vs-card-desc">
            Browse active polls, pick your candidate, and make your voice heard.
          </p>
          <div className="vs-card-cta vs-card-cta--blue">
            Vote now <span className="vs-arrow">→</span>
          </div>
        </div>
      </div>

      <div className="vs-stats">
        {stats.map((s, i) => (
          <React.Fragment key={s.label}>
            {i > 0 && <div className="vs-divider" />}
            <div className="vs-stat">
              <div className="vs-stat-num">{s.num}</div>
              <div className="vs-stat-label">{s.label}</div>
            </div>
          </React.Fragment>
        ))}
      </div>

      <div className="vs-ticker">
        <span className="vs-ticker-label">● Live</span>
        <div className="vs-ticker-track">
          <div className="vs-ticker-scroll">
            {tickerItems.map((item, i) => (
              <span key={i} className="vs-ticker-item">
                ✓ {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
