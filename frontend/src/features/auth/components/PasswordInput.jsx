import { useState } from "react";
import {
  FiEye,
  FiEyeOff,
  FiLock,
} from "react-icons/fi";

const PasswordInput = ({
  label,
  value,
  onChange,
  placeholder,
  error,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="auth-field">
      <label className="auth-field-label">
        {label}
      </label>

      <div className="auth-input-wrapper">
        <FiLock
          size={18}
          className="auth-left-icon"
        />

        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="
            auth-input
            auth-input-with-left-icon
            auth-input-with-right-icon
          "
        />

        <button
          type="button"
          className="auth-password-toggle"
          onClick={() =>
            setShowPassword((current) => !current)
          }
        >
          {showPassword ? (
            <FiEyeOff size={18} />
          ) : (
            <FiEye size={18} />
          )}
        </button>
      </div>

      {error && (
        <p className="auth-error">
          {error}
        </p>
      )}
    </div>
  );
};

export default PasswordInput;