import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../api/services";
import { useAuth } from "../context/useAuth";
import "../styles/LoginPage.css";

const STATES = [
  "Karnataka",
  "Maharashtra",
  "Delhi",
  "Tamil Nadu",
  "Uttar Pradesh",
  "Gujarat",
];

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [form, setForm] = useState({
    name: "",
    email: "",
    passowrd: "",
    state: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      if (mode === "login") {
        const { data } = await authAPI.login({
          email: form.email,
          password: form.password,
        });

        login(data.token, data.user);
      } else {
        const { data } = await authAPI.register({
          name: form.name,
          email: form.email,
          password: form.password,
          state: form.state,
          role: "voter",
        });

        login(data.token, data.user);
      }
      navigate("/vote");
    } catch (err) {
      setError(
        err.response?.message || "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lg-root">
      <div className="lg-card">
        <div className="lg-tabs">
          <button
            className={`lg-tab${mode === "login" ? " active" : ""}`}
            onClick={() => setMode("login")}
            type="button"
          >
            Log in
          </button>
          <button
            className={`lg-tab${mode === "signup" ? " active" : ""}`}
            onClick={() => setMode("signup")}
            type="button"
          >
            Sign up to vote
          </button>
        </div>

        <h1 className="lg-title">
          {mode === "login" ? "Welcome back" : "Create your voter account"}
        </h1>
        <p className="lg-sub">
          {mode === "login"
            ? "Log in to cast your vote"
            : "Register as a voter to take part in polls"}
        </p>

        <form onSubmit={handleSubmit}>
          {mode === "signup" && (
            <div className="lg-field">
              <label>Full name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="lg-field">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="lg-field">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              minLength={8}
              required
            />
          </div>

          {mode === "signup" && (
            <div className="lg-field">
              <label>State / Region</label>
              <select
                name="state"
                value={form.state}
                onChange={handleChange}
                required
              >
                <option value="">Select your state</option>
                {STATES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
          )}

          {error && <p className="lg-error">{error}</p>}

          <button className="lg-btn" type="submit" disabled={loading}>
            {loading
              ? "Please wait…"
              : mode === "login"
                ? "Log in"
                : "Create account"}
          </button>
        </form>

        <p className="lg-footer">
          Want to run in an election?{" "}
          <Link to="/register">Register as a candidate</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
