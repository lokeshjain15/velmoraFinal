const AuthButton = ({
  children,
  loading = false,
  disabled = false,
  type = "submit",
}) => {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className="auth-submit"
    >
      {loading ? "Please wait..." : children}
    </button>
  );
};

export default AuthButton;