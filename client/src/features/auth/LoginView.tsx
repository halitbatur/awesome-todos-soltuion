export const LoginView: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button onClick={onClick} className="btn-google">
    Sign in with Google
  </button>
);
