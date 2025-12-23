import AuthCard from "../components/AuthCard";

export default function AuthPage({ onAuthSuccess }) {
  return (
    <div className="auth-page">
      <AuthCard onAuthSuccess={onAuthSuccess} />
    </div>
  );
}
