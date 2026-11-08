import type { User } from '../api/auth';

type WelcomeProps = {
  user: User;
  onLogout: () => void;
};

export default function Welcome({ user, onLogout }: WelcomeProps) {
  return (
    <section className="welcome" aria-live="polite">
      <h2 className="welcome__title">Welcome, {user.name}</h2>
      <p className="welcome__email">{user.email}</p>
      <button type="button" className="welcome__logout" onClick={onLogout}>
        Log out
      </button>
    </section>
  );
}