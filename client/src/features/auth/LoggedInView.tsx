import { User } from './authSlice';

export const LoggedInView: React.FC<{ user: User }> = ({ user }) => (
  <div>{user.email}</div>
);
