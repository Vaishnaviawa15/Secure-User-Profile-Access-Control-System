import { useEffect, useState } from "react";
import api from "../api/axios";
import ProfileCard from "../components/ProfileCard";

export default function ProfilePage({ onLogout }) {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    api.get("/profile")
      .then((res) => setProfile(res.data))
      .catch(() => onLogout());
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    onLogout();
  };

  return (
    <div className="profile-page">
      <button className="logout-btn" onClick={logout}>Logout</button>
      {profile && <ProfileCard profile={profile} />}
    </div>
  );
}
