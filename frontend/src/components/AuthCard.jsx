import { useState } from "react";
import api from "../api/axios";

export default function AuthCard({ onAuthSuccess }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ email: "", password: "", aadhaar: "" });
  const [message, setMessage] = useState("");

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isValidAadhaar = (aadhaar) =>
    /^\d{12}$/.test(aadhaar);

  const handleSubmit = async () => {
    setMessage("");

    if (!isValidEmail(form.email)) {
      return setMessage("❌ Invalid email format");
    }

    if (mode === "register" && !isValidAadhaar(form.aadhaar)) {
      return setMessage("❌ Aadhaar must be 12 digits");
    }

    try {
      if (mode === "register") {
        await api.post("/register", form);
        setMessage("✅ Registration successful. Please login.");
        setMode("login");
      } else {
        const res = await api.post("/login", form);
        localStorage.setItem("token", res.data.token);
        onAuthSuccess();
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Something went wrong");
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-toggle">
        <span onClick={() => setMode("login")} className={mode === "login" ? "active" : ""}>LOGIN</span>
        <span onClick={() => setMode("register")} className={mode === "register" ? "active" : ""}>REGISTER</span>
      </div>

      <input
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      {mode === "register" && (
        <input
          placeholder="Aadhaar Number"
          value={form.aadhaar}
          onChange={(e) => setForm({ ...form, aadhaar: e.target.value })}
        />
      )}

      <button onClick={handleSubmit}>
        {mode === "login" ? "LOGIN" : "REGISTER"}
      </button>

      {message && <p className="message">{message}</p>}
    </div>
  );
}
