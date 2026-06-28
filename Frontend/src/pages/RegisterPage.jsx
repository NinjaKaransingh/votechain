import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/RegisterPage.css";

const PARTIES = [
  { label: "Independent", icon: "👤" },
  { label: "Progressive", icon: "📈" },
  { label: "Conservative", icon: "🛡️" },
  { label: "Green", icon: "🌿" },
  { label: "Liberal", icon: "⚖️" },
  { label: "Other", icon: "•••" },
];

const POSITIONS = [
  "City Council",
  "Mayor",
  "State Assembly",
  "Member of Parliament",
  "School Board",
];

const STATES = [
  "Karnataka",
  "Maharashtra",
  "Delhi",
  "Tamil Nadu",
  "Uttar Pradesh",
  "Gujarat",
];

const STEPS = ["Personal", "Campaign", "Photo"];

const RegisterPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    state: "",
    party: "",
    position: "",
    bio: "",
    photo: null,
    photoPreview: null,
  });

  const isSubmitEnabled =
    form.firstName.trim() &&
    form.lastName.trim() &&
    form.email.trim() &&
    form.password.trim() &&
    form.state.trim() &&
    form.party.trim() &&
    form.position.trim() &&
    form.bio.trim() &&
    form.photo;

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) =>
      setForm((prev) => ({
        ...prev,
        photo: file,
        photoPreview: ev.target.result,
      }));
    reader.readAsDataURL(file);
  };

  const initials =
    (form.firstName[0] || "A").toUpperCase() +
    (form.lastName[0] || "S").toUpperCase();

  const fullName = `${form.firstName || "Arjun"} ${form.lastName || "Sharma"}`;
  const partyLine = `${form.party || "Independent"} · ${form.position || "Position"}`;

  const handleSubmit = async () => {
    // TODO: wire to POST /api/candidates/RegisterPage
    console.log("Submitting:", form);
    setStep(4);
  };

  const handleClick = () => {
    navigate("/");
  };

  return (
    <div className="rg-root">
      <div className="rg-bg-grid" aria-hidden="true" />

      {/* Stepper */}
      <div className="rg-stepper" aria-label="Registration steps">
        <button onClick={handleClick}>🔙</button>
        {STEPS.map((label, i) => {
          const num = i + 1;
          const isDone = step > num;
          const isActive = step === num;
          return (
            <React.Fragment key={label}>
              {i > 0 && (
                <div className={`rg-line${step > num ? " done" : ""}`} />
              )}
              <div className="rg-step-item">
                <div
                  className={`rg-circle${isActive ? " active" : isDone ? " done" : ""}`}
                >
                  {isDone ? "✓" : num}
                </div>
                <div className={`rg-step-label${isActive ? " active" : ""}`}>
                  {label}
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* Card */}
      <div className="rg-card">
        {/* Step 1 — Personal */}
        {step === 1 && (
          <>
            <div className="rg-card-head">
              <h1 className="rg-title">Personal info</h1>
              <p className="rg-sub">Tell voters who you are</p>
            </div>

            <div className="rg-row">
              <div className="rg-field">
                <label>First name</label>
                <input
                  value={form.firstName}
                  onChange={set("firstName")}
                  placeholder="Arjun"
                  required
                />
              </div>
              <div className="rg-field">
                <label>Last name</label>
                <input
                  value={form.lastName}
                  onChange={set("lastName")}
                  placeholder="Sharma"
                  required
                />
              </div>
            </div>

            <div className="rg-field">
              <label>Email</label>
              <input
                type="email"
                value={form.email}
                onChange={set("email")}
                placeholder="arjun@example.com"
                required
              />
            </div>

            <div className="rg-field">
              <label>Password</label>
              <input
                type="password"
                value={form.password}
                onChange={set("password")}
                placeholder="Min. 8 characters"
                required
              />
            </div>

            <div className="rg-field">
              <label>State / Region</label>
              <select value={form.state} onChange={set("state")}>
                <option value="">Select your state</option>
                {STATES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="rg-actions">
              <button
                className="rg-btn-next"
                onClick={() => setStep(2)}
                disabled={
                  !form.firstName.trim() ||
                  !form.lastName.trim() ||
                  !form.email.trim() ||
                  !form.password.trim() ||
                  !form.state
                }
              >
                Continue <span className="rg-arrow">→</span>
              </button>
            </div>
          </>
        )}

        {/* Step 2 — Campaign */}
        {step === 2 && (
          <>
            <div className="rg-card-head">
              <h1 className="rg-title">Campaign details</h1>
              <p className="rg-sub">Tell voters what you stand for</p>
            </div>

            <div className="rg-field">
              <label>Political party</label>
              <div className="rg-party-grid">
                {PARTIES.map(({ label, icon }) => (
                  <button
                    key={label}
                    className={`rg-party-btn${form.party === label ? " selected" : ""}`}
                    onClick={() => setForm((p) => ({ ...p, party: label }))}
                    type="button"
                  >
                    <span className="rg-party-icon">{icon}</span>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="rg-field">
              <label>Position running for</label>
              <select value={form.position} onChange={set("position")}>
                <option value="">Select position</option>
                {POSITIONS.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </div>

            <div className="rg-field">
              <label>Campaign bio</label>
              <textarea
                value={form.bio}
                onChange={(e) => {
                  if (e.target.value.length <= 300) set("bio")(e);
                }}
                placeholder="Share your vision, values and why voters should choose you..."
                rows={4}
              />
              <span className="rg-char-count">{form.bio.length} / 300</span>
            </div>

            <div className="rg-actions">
              <button className="rg-btn-back" onClick={() => setStep(1)}>
                ← Back
              </button>
              <button
                className="rg-btn-next"
                onClick={() => setStep(3)}
                disabled={!form.party || !form.position || !form.bio.trim()}
              >
                Continue <span className="rg-arrow">→</span>
              </button>
            </div>
          </>
        )}

        {/* Step 3 — Photo */}
        {step === 3 && (
          <>
            <div className="rg-card-head">
              <h1 className="rg-title">Profile photo</h1>
              <p className="rg-sub">A face voters can trust</p>
            </div>

            <div
              className={`rg-photo-zone${form.photoPreview ? " has-photo" : ""}`}
              onClick={() => document.getElementById("photoInput").click()}
            >
              {form.photoPreview ? (
                <img
                  src={form.photoPreview}
                  alt="Profile preview"
                  className="rg-photo-preview"
                />
              ) : (
                <>
                  <span className="rg-photo-camera">📷</span>
                  <p className="rg-photo-label">Click to upload your photo</p>
                  <p className="rg-photo-hint">
                    JPG or PNG · Max 5MB · Square recommended
                  </p>
                </>
              )}
              <input
                id="photoInput"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handlePhoto}
              />
            </div>

            <div className="rg-preview-card">
              <p className="rg-preview-label">Profile preview</p>
              <div className="rg-profile-row">
                <div className="rg-avatar">{initials}</div>
                <div>
                  <p className="rg-profile-name">{fullName}</p>
                  <p className="rg-profile-party">{partyLine}</p>
                </div>
              </div>
            </div>

            <div className="rg-actions">
              <button className="rg-btn-back" onClick={() => setStep(2)}>
                ← Back
              </button>
              <button
                className="rg-btn-next"
                onClick={handleSubmit}
                disabled={!isSubmitEnabled}
              >
                Submit ✓
              </button>
            </div>
          </>
        )}

        {/* Step 4 — Success */}
        {step === 4 && (
          <div className="rg-success">
            <div className="rg-success-icon">✓</div>
            <h2 className="rg-success-title">You're registered!</h2>
            <p className="rg-success-sub">
              Your candidate profile has been submitted and is pending review.
              You'll receive a confirmation email shortly.
            </p>
            <div className="rg-profile-row rg-profile-row--full">
              <div className="rg-avatar">{initials}</div>
              <div>
                <p className="rg-profile-name">{fullName}</p>
                <p className="rg-profile-party">{partyLine}</p>
              </div>
            </div>
            <button
              className="rg-btn-next rg-btn-full"
              onClick={() => navigate("/")}
            >
              Back to home
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;
