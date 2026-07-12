import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { pollAPI, voteAPI } from "../api/services";
import { useAuth } from "../context/useAuth";
import "../styles/VotePage.css";

const PALETTE = [
  {
    avatarBg: "#9FE1CB",
    avatarColor: "#085041",
    partyBg: "#E1F5EE",
    partyColor: "#085041",
    barColor: "#1D9E75",
  },
  {
    avatarBg: "#B5D4F4",
    avatarColor: "#042C53",
    partyBg: "#E6F1FB",
    partyColor: "#042C53",
    barColor: "#378ADD",
  },
  {
    avatarBg: "#C0DD97",
    avatarColor: "#173404",
    partyBg: "#EAF3DE",
    partyColor: "#173404",
    barColor: "#639922",
  },
  {
    avatarBg: "#F5C4B3",
    avatarColor: "#4A1B0C",
    partyBg: "#FAECE7",
    partyColor: "#4A1B0C",
    barColor: "#D85A30",
  },
];

const initialsOf = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("") || "??";

const VotePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const pollIdParam = searchParams.get("pollId");

  const [poll, setPoll] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [voting, setVoting] = useState(false);

  useEffect(() => {
    const loadPoll = async () => {
      setLoading(true);
      setError("");
      try {
        let activePoll;
        if (pollIdParam) {
          const { data } = await pollAPI.getById(pollIdParam);
          activePoll = data;
        } else {
          const { data } = await pollAPI.getAll();
          activePoll = data[0]; // first active poll — swap for a poll picker later
        }

        if (!activePoll) {
          setError("There are no active polls right now. Check back soon.");
          setLoading(false);
          return;
        }

        setPoll(activePoll);
        const mapped = (activePoll.candidates || []).map((c, i) => ({
          id: c._id,
          name: c.userId?.name || "Unknown",
          party: c.party,
          bio: `${activePoll.region} · ${c.position}`,
          ...PALETTE[i % PALETTE.length],
        }));
        setCandidates(mapped);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load poll.");
      } finally {
        setLoading(false);
      }
    };
    loadPoll();
  }, [pollIdParam]);

  const handleVote = async () => {
    if (!selected || !poll) return;
    setVoting(true);
    setError("");
    try {
      await voteAPI.cast({ candidateId: selected.id, pollId: poll._id });

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

      const { data } = await voteAPI.getResults(poll._id);
      setResults(data);
      setSubmitted(true);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not cast your vote. Please try again.",
      );
    } finally {
      setVoting(false);
    }
  };

  if (loading) {
    return (
      <div className="vt-root">
        <div className="vt-inner">
          <p style={{ padding: "3rem 0", textAlign: "center" }}>
            Loading poll…
          </p>
        </div>
      </div>
    );
  }

  if (error && !poll) {
    return (
      <div className="vt-root">
        <div className="vt-inner">
          <p style={{ padding: "3rem 0", textAlign: "center" }}>{error}</p>
          <button className="vt-btn-back" onClick={() => navigate("/")}>
            ← Back to home
          </button>
        </div>
      </div>
    );
  }

  if (submitted && results) {
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

            <div className="vt-receipt">
              <div className="vt-receipt-row">
                <span className="vt-receipt-key">Poll</span>
                <span className="vt-receipt-val">{poll.title}</span>
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

            <div className="vt-results">
              <div className="vt-results-title">Live results</div>
              {results.results.map((r, i) => (
                <div className="vt-bar-row" key={r.candidateId}>
                  <div className="vt-bar-label">
                    <span className="vt-bar-name">{r.name}</span>
                    <span className="vt-bar-pct">{r.percentage}%</span>
                  </div>
                  <div className="vt-bar-track">
                    <div
                      className="vt-bar-fill"
                      style={{
                        width: `${r.percentage}%`,
                        background: PALETTE[i % PALETTE.length].barColor,
                      }}
                    />
                  </div>
                </div>
              ))}
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
        <div className="vt-header">
          <div className="vt-eyebrow">
            <span className="vt-dot" />
            Active poll
          </div>
          <h1 className="vt-title">{poll.title}</h1>
          <div className="vt-meta">
            <span className="vt-chip">{candidates.length} candidates</span>
            <span className="vt-chip">
              Closes {new Date(poll.endDate).toLocaleDateString("en-IN")}
            </span>
            <span className="vt-chip">{poll.region}</span>
          </div>
        </div>

        <div>
          <div className="vt-section-label">Choose your candidate</div>
          <div className="vt-candidates">
            {candidates.map((c) => (
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
                  {initialsOf(c.name)}
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

        {selected && (
          <div className="vt-confirm-box fade-in">
            <div
              className="vt-confirm-avatar"
              style={{
                background: selected.avatarBg,
                color: selected.avatarColor,
              }}
            >
              {initialsOf(selected.name)}
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

        {error && (
          <p style={{ color: "#B3261E", textAlign: "center" }}>{error}</p>
        )}

        <button
          className="vt-btn-vote"
          disabled={!selected || voting}
          onClick={handleVote}
        >
          {voting ? "Casting vote…" : "✓ Cast your vote"}
        </button>

        <p className="vt-disclaimer">
          🔒 Logged in as {user?.email}. Your vote can only be cast once per
          poll.
        </p>
      </div>
    </div>
  );
};

export default VotePage;
