export const LoginView: React.FC<{ onClick: () => void; disabled: boolean }> =
  ({ onClick, disabled }) => (
    <button onClick={onClick} className="btn-google" disabled={disabled}>
      Sign in with Google
    </button>
  );
