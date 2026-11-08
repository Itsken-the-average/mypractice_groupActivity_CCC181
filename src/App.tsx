import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import BrandPanel from './components/BrandPanel';
import LoginForm from './components/LoginForm';
import Welcome from './components/Welcome';
import Footer from './components/Footer';
import { ApiError, clearToken, getMe, getToken } from './api/auth';
import type { User } from './api/auth';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState<boolean>(() => getToken() !== null);

  useEffect(() => {
    if (getToken() === null) {
      return;
    }
    getMe()
      .then((me) => setUser(me))
      .catch((err) => {
        if (err instanceof ApiError && err.status === 401) {
          clearToken();
        }
      })
      .finally(() => setChecking(false));
  }, []);

  function handleLogout() {
    clearToken();
    setUser(null);
  }

  let content;
  if (checking) {
    content = <p className="session-check">Checking your session...</p>;
  } else if (user) {
    content = <Welcome user={user} onLogout={handleLogout} />;
  } else {
    content = <LoginForm onLoggedIn={setUser} />;
  }

  return (
    <div className="page">
      <Navbar />
      <main className="container">
        <div className="login-layout">
          <BrandPanel />
          {content}
        </div>
      </main>
      <Footer />
    </div>
  );
}