const AuthInput = ({
  label,
  icon: Icon,
  error,
  ...props
}) => {
  return (
    <div className="auth-field">
      <label className="auth-field-label">
        {label}
      </label>

      <div className="auth-input-wrapper">
        {Icon && (
          <Icon
            size={18}
            className="auth-left-icon"
          />
        )}

        <input
          {...props}
          className={`auth-input ${
            Icon ? "auth-input-with-left-icon" : ""
          }`}
        />
      </div>

      {error && (
        <p className="auth-error">
          {error}
        </p>
      )}
    </div>
  );
};

export default AuthInput;