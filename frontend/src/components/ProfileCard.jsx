export default function ProfileCard({ profile }) {
  return (
    <div className="profile-card">
      <h2>Welcome User 👋</h2>
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>Aadhaar:</strong> {profile.aadhaar}</p>
    </div>
  );
}
