import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/VotePage.css";

const CANDIDATES = [
  {
    id: "priya-nair",
    name: "Priya Nair",
    initials: "PN",
    party: "Independent",
    bio: "Ward 4 · 12 years local experience",
    avatarBg: "#9FE1CB",
    avatarColor: "#085041",
    partyBg: "#E1F5EE",
    partyColor: "#085041",
    barColor: "#1D9E75",
  },
  {
    id: "rahul-desai",
    name: "Rahul Desai",
    initials: "RD",
    party: "Progressive",
    bio: "Ward 4 · Infrastructure & transport",
    avatarBg: "#B5D4F4",
    avatarColor: "#042C53",
    partyBg: "#E6F1FB",
    partyColor: "#042C53",
    barColor: "#378ADD",
  },
  {
    id: "sunita-rao",
    name: "Sunita Rao",
    initials: "SR",
    party: "Green",
    bio: "Ward 4 · Environment & sustainability",
    avatarBg: "#C0DD97",
    avatarColor: "#173404",
    partyBg: "#EAF3DE",
    partyColor: "#173404",
    barColor: "#639922",
  },
  {
    id: "vikram-mehta",
    name: "Vikram Mehta",
    initials: "VM",
    party: "Liberal",
    bio: "Ward 4 · Economy & small business",
    avatarBg: "#F5C4B3",
    avatarColor: "#4A1B0C",
    partyBg: "#FAECE7",
    partyColor: "#4A1B0C",
    barColor: "#D85A30",
  },
];

const POLL = {
  title: "City Council Election 2026",
  region: "Karnataka",
  closes: "Jun 15",
};

const VotePage = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [receipt, setReceipt] = useState(null);

  // Simulated vote counts — replace with API data
  const [votes, setVotes] = useState({
    "priya-nair": 142,
    "rahul-desai": 98,
    "sunita-rao": 75,
    "vikram-mehta": 53,
  });

  const total = Object.values(votes).reduce((a, b) => a + b, 0);

  const handleVote = async () => {
    if (!selected) return;

    const updatedVotes = {
      ...votes,
      [selected.id]: votes[selected.id] + 1,
    };
    setVotes(updatedVotes);

    setReceipt({
      name: selected.name,
      time:
        new Date().toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
        }) +
        ", " +
        new Date().toLocaleDateString("en-IN"),
      id: "#" + Math.random().toString(36).slice(2, 10).toUpperCase(),
    });

    // TODO: POST /api/votes  { pollId, candidateId }
    setSubmitted(true);
  };

  const newTotal = submitted
    ? Object.values({ ...votes }).reduce((a, b) => a + b, 0)
    : total;

  if (submitted) {
    return (
      <div className="vt-root">
        <div className="vt-bg-grid" aria-hidden="true" />
        <div className="vt-inner">
          <div className="vt-success fade-in">
            <div className="vt-success-ring">✓</div>
            <h2 className="vt-success-title">Vote cast!</h2>
            <p className="vt-success-sub">
              Your vote has been recorded securely. Thank you for participating.
            </p>

            {/* Receipt */}
            <div className="vt-receipt">
              <div className="vt-receipt-row">
                <span className="vt-receipt-key">Poll</span>
                <span className="vt-receipt-val">{POLL.title}</span>
              </div>
              <div className="vt-receipt-row">
                <span className="vt-receipt-key">Voted for</span>
                <span className="vt-receipt-val">{receipt.name}</span>
              </div>
              <div className="vt-receipt-row">
                <span className="vt-receipt-key">Timestamp</span>
                <span className="vt-receipt-val">{receipt.time}</span>
              </div>
              <div className="vt-receipt-row">
                <span className="vt-receipt-key">Receipt ID</span>
                <span className="vt-receipt-val">{receipt.id}</span>
              </div>
            </div>

            {/* Live results */}
            <div className="vt-results">
              <div className="vt-results-title">Live results</div>
              {CANDIDATES.map((c) => {
                const count = votes[c.id] + (c.id === selected?.id ? 1 : 0);
                const pct = Math.round((count / (newTotal + 1)) * 100);
                return (
                  <div className="vt-bar-row" key={c.id}>
                    <div className="vt-bar-label">
                      <span className="vt-bar-name">{c.name}</span>
                      <span className="vt-bar-pct">{pct}%</span>
                    </div>
                    <div className="vt-bar-track">
                      <div
                        className="vt-bar-fill"
                        style={{ width: `${pct}%`, background: c.barColor }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <button className="vt-btn-back" onClick={() => navigate("/")}>
              ← Back to polls
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="vt-root">
      <div className="vt-bg-grid" aria-hidden="true" />
      <div className="vt-inner">
        {/* Poll header */}
        <div className="vt-header">
          <div className="vt-eyebrow">
            <span className="vt-dot" />
            Active poll
          </div>
          <h1 className="vt-title">{POLL.title}</h1>
          <div className="vt-meta">
            <span className="vt-chip">{CANDIDATES.length} candidates</span>
            <span className="vt-chip">Closes {POLL.closes}</span>
            <span className="vt-chip">{POLL.region}</span>
          </div>
        </div>

        {/* Candidates */}
        <div>
          <div className="vt-section-label">Choose your candidate</div>
          <div className="vt-candidates">
            {CANDIDATES.map((c) => (
              <div
                key={c.id}
                className={`vt-cand${selected?.id === c.id ? " selected" : ""}`}
                onClick={() => setSelected(c)}
                role="radio"
                aria-checked={selected?.id === c.id}
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && setSelected(c)}
              >
                <div
                  className="vt-avatar"
                  style={{ background: c.avatarBg, color: c.avatarColor }}
                >
                  {c.initials}
                </div>
                <div className="vt-cand-body">
                  <div className="vt-cand-name">{c.name}</div>
                  <div className="vt-cand-meta">{c.bio}</div>
                  <div
                    className="vt-party-pill"
                    style={{ background: c.partyBg, color: c.partyColor }}
                  >
                    {c.party}
                  </div>
                </div>
                <div className="vt-radio">
                  <div className="vt-radio-dot" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Confirm box */}
        {selected && (
          <div className="vt-confirm-box fade-in">
            <div
              className="vt-confirm-avatar"
              style={{
                background: selected.avatarBg,
                color: selected.avatarColor,
              }}
            >
              {selected.initials}
            </div>
            <div>
              <div className="vt-confirm-label">Voting for</div>
              <div className="vt-confirm-name">{selected.name}</div>
            </div>
            <button
              className="vt-btn-clear"
              onClick={() => setSelected(null)}
              aria-label="Change selection"
            >
              ✎
            </button>
          </div>
        )}

        {/* Cast vote */}
        <button
          className="vt-btn-vote"
          disabled={!selected}
          onClick={handleVote}
        >
          ✓ Cast your vote
        </button>

        <p className="vt-disclaimer">
          🔒 Your vote is anonymous and cannot be changed after submission.
        </p>
      </div>
    </div>
  );
};

export default VotePage;
