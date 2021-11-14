import { User } from './authSlice';

export const LoggedInView: React.FC<{ user: User; onLogout: () => void }> = ({
  user,
  onLogout,
}) => (
  <div className="logged-in-view" title={user.email}>
    <div className="user-avatar">
      <img src={user.avatar} alt={user.name} />
    </div>
    <button className="btn-google btn-logout2" onClick={onLogout}>
      Logout as {user.name}
    </button>
  </div>
);
