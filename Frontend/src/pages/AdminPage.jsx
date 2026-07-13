import { useState, useEffect } from "react";
import { candidateAPI, pollAPI } from "../api/services";
import "../styles/AdminPage.css";

const AdminPage = () => {
  const [polls, setPolls] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [pollForm, setPollForm] = useState({
    title: "",
    description: "",
    region: "",
    startDate: "",
    endDate: "",
  });

  const [creatingPoll, setCreatingPoll] = useState(false);
  const [selectedPollId, setSelectedPollId] = useState("");
  const [selectedCandidateId, setSelectedCandidateId] = useState("");
  const [addingCandidate, setAddingCandidate] = useState(false);

  const loadData = async () => {
    try {
      const [pollsRes, candidatesRes] = await Promise.all([
        pollAPI.getAll(),
        candidateAPI.getAll(),
      ]);
      setPolls(pollsRes.data);
      setCandidates(candidatesRes.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    (async function fetchData() {
      try {
        const [pollsRes, candidatesRes] = await Promise.all([
          pollAPI.getAll(),
          candidateAPI.getAll(),
        ]);
        if (mounted) {
          setPolls(pollsRes.data);
          setCandidates(candidatesRes.data);
        }
      } catch (err) {
        if (mounted) {
          setError(err.response?.data?.message || "Failed to load data.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const handlePollFormChange = (e) =>
    setPollForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleCreatePoll = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);
    setNotice("");
    setCreatingPoll(true);

    try {
      await pollAPI.create(pollForm);
      setNotice("Poll created.");
      setPollForm({
        title: "",
        description: "",
        region: "",
        startDate: "",
        endDate: "",
      });
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create poll.");
    } finally {
      setLoading(false);
      setCreatingPoll(false);
    }
  };

  const handleAddCandidate = async (e) => {
    e.preventDefault();
    setError("");
    setNotice("");

    if (!selectedPollId || !selectedCandidateId) {
      setError("Select both a poll and a candidate.");
      return;
    }

    setLoading(true);
    setAddingCandidate(true);

    try {
      await pollAPI.addCandidate(selectedPollId, selectedCandidateId);
      setNotice("Candidate added to poll.");
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add candidate.");
    } finally {
      setAddingCandidate(false);
      setLoading(false);
    }
  };

  return (
    <div className="ad-root">
      <h1 className="ad-title">Admin</h1>

      {error && <p className="ad-error">{error}</p>}
      {notice && <p className="ad-notice">{notice}</p>}

      <section className="ad-card">
        <h2 className="ad-section-title">Create a poll</h2>
        <form onSubmit={handleCreatePoll} className="ad-form">
          <div className="ad-field">
            <label>Title</label>
            <input
              name="title"
              value={pollForm.title}
              onChange={handlePollFormChange}
              required
            />
          </div>
          <div className="ad-field">
            <label>Description</label>
            <input
              name="description"
              value={pollForm.description}
              onChange={handlePollFormChange}
            />
          </div>
          <div className="ad-field">
            <label>Region</label>
            <input
              name="region"
              value={pollForm.region}
              onChange={handlePollFormChange}
              required
            />
          </div>
          <div className="ad-row">
            <div className="ad-field">
              <label>Start date</label>
              <input
                type="date"
                name="startDate"
                value={pollForm.startDate}
                onChange={handlePollFormChange}
                required
              />
            </div>
            <div className="ad-field">
              <label>End date</label>
              <input
                type="date"
                name="endDate"
                value={pollForm.endDate}
                onChange={handlePollFormChange}
                required
              />
            </div>
          </div>
          <button className="ad-btn" type="submit" disabled={creatingPoll}>
            {creatingPoll ? "Creating…" : "Create poll"}
          </button>
        </form>
      </section>

      <section className="ad-card">
        <h2 className="ad-section-title">Add a candidate to a poll</h2>
        {loading ? (
          <p>Loading polls and candidates…</p>
        ) : (
          <form onSubmit={handleAddCandidate} className="ad-form">
            <div className="ad-field">
              <label>Poll</label>
              <select
                value={selectedPollId}
                onChange={(e) => setSelectedPollId(e.target.value)}
              >
                <option value="">Select a poll</option>
                {polls.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="ad-field">
              <label>Candidate</label>
              <select
                value={selectedCandidateId}
                onChange={(e) => setSelectedCandidateId(e.target.value)}
              >
                <option value="">Select a candidate</option>
                {candidates.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.userId?.name} — {c.party} ({c.position})
                  </option>
                ))}
              </select>
            </div>
            <button className="ad-btn" type="submit" disabled={addingCandidate}>
              {addingCandidate ? "Adding…" : "Add to poll"}
            </button>
          </form>
        )}
      </section>

      <section className="ad-card">
        <h2 className="ad-section-title">Existing polls</h2>
        {polls.length === 0 && <p>No polls yet.</p>}
        {polls.map((p) => (
          <div key={p._id} className="ad-poll-row">
            <strong>{p.title}</strong> — {p.candidates?.length || 0} candidate(s) — {p.region}
          </div>
        ))}
      </section>
    </div>
  );
};

export default AdminPage;
