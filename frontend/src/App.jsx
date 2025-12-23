import { useEffect, useState } from "react";
import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuth(!!token);
  }, []);

  return isAuth ? (
    <ProfilePage onLogout={() => setIsAuth(false)} />
  ) : (
    <AuthPage onAuthSuccess={() => setIsAuth(true)} />
  );
}

export default App;

