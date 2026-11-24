import { useState } from "react";

export default function RoleSelector({ onSelectRole }) {
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleAdminSubmit = (e) => {
    e.preventDefault();
    if (userId.trim() === "admin" && password === "admin123") {
      setError("");
      onSelectRole("admin");
    } else {
      setError("Invalid User ID or Password. (Hint: admin / admin123)");
    }
  };

  return (
    <div className="role-gate-wrapper">
      <div className="role-gate-card">
        <div className="gate-header">
          <span className="gate-badge">Welcome to</span>
          <h1 className="brand-title gate-title">Enthaa Kazhikaa?</h1>
          <p className="subtitle">Select how you would like to continue</p>
        </div>

        {!showAdminLogin ? (
          <div className="role-buttons">
            <button
              className="role-choice-btn customer-btn"
              onClick={() => onSelectRole("customer")}
            >
              <span className="role-emoji">🍽️</span>
              <div>
                <strong>I am a Customer</strong>
                <span>Browse menu & order to your seat</span>
              </div>
            </button>

            <button
              className="role-choice-btn admin-btn"
              onClick={() => setShowAdminLogin(true)}
            >
              <span className="role-emoji">👨‍🍳</span>
              <div>
                <strong>Waiter / Admin</strong>
                <span>Manage live table orders & menu</span>
              </div>
            </button>
          </div>
        ) : (
          <form onSubmit={handleAdminSubmit} className="admin-login-form">
            <h3>Staff / Admin Login</h3>
            {error && <p className="login-error">{error}</p>}

            <div className="form-group">
              <label>User ID</label>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Enter User ID (admin)"
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password (admin123)"
                required
              />
            </div>

            <div className="login-actions">
              <button
                type="button"
                className="btn-ghost"
                onClick={() => {
                  setShowAdminLogin(false);
                  setError("");
                }}
              >
                ← Back
              </button>
              <button type="submit" className="btn-primary">
                Login to Dashboard
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}