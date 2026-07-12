import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuth } from "./context/useAuth.js";
import { AuthProvider } from "./context/AuthProvider.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import VotePage from "./pages/VotePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";

const AuthStatusBar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  if (!isAuthenticated) return null;
  return (
    <div
      style={{
        position: "fixed",
        top: 12,
        right: 16,
        zIndex: 50,
        fontFamily: "sans-serif",
        fontSize: 14,
      }}
    >
      <span style={{ marginRight: 10 }}>Hi, {user?.name || user?.email}</span>
      <button
        onClick={logout}
        style={{
          border: "none",
          background: "#111",
          color: "#fff",
          padding: "6px 12px",
          borderRadius: 6,
          cursor: "pointer",
        }}
      >
        Log out
      </button>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AuthStatusBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/vote"
            element={
              <ProtectedRoute>
                <VotePage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
