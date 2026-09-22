import { useState } from "react";
import { FiMail, FiUser } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { register, getApiError } from "../services/auth.api";
import { useAuth } from "../hooks/useAuth";

import AuthLayout from "../components/AuthLayout";
import AuthInput from "../components/AuthInput";
import PasswordInput from "../components/PasswordInput";
import AuthButton from "../components/AuthButton";
import SocialLogin from "../components/SocialLogin";

import registerImage from "../../../assets/images/auth/register.jpeg";

const Register = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!username.trim()) {
      newErrors.username = "Full name is required";
    } else if (username.trim().length < 3) {
      newErrors.username = "Full name must be at least 3 characters";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!agreeTerms) {
      newErrors.agreeTerms =
        "Please accept the Terms of Service and Privacy Policy";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setIsSubmitting(true);

      const response = await register({
        fullName: username.trim(),
        email,
        password,
      });
      setUser(response.user);
      navigate("/");
    } catch (error) {
      console.error(error);

      setErrors((prev) => ({
        ...prev,
        submit: getApiError(error, "Could not create your account. Please try again."),
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      image={registerImage}
      title="Create account"
      subtitle="Join Velmora and start your journey"
      imagePosition="right"
    >
      <form
        onSubmit={handleSubmit}
        noValidate
        className="auth-form"
      >
        {/* Full Name */}
        <AuthInput
          label="Full Name"
          type="text"
          placeholder="Enter your full name"
          value={username}
          icon={FiUser}
          error={errors.username}
          autoComplete="name"
          onChange={(e) => {
            setUsername(e.target.value);

            if (errors.username || errors.submit) {
              setErrors((prev) => ({
                ...prev,
                username: "",
                submit: "",
              }));
            }
          }}
        />

        {/* Email */}
        <AuthInput
          label="Email Address"
          type="email"
          placeholder="Enter your email"
          value={email}
          icon={FiMail}
          error={errors.email}
          autoComplete="email"
          onChange={(e) => {
            setEmail(e.target.value);

            if (errors.email || errors.submit) {
              setErrors((prev) => ({
                ...prev,
                email: "",
                submit: "",
              }));
            }
          }}
        />

        {/* Password */}
        <PasswordInput
          label="Password"
          placeholder="Create a password"
          value={password}
          error={errors.password}
          onChange={(e) => {
            setPassword(e.target.value);

            if (errors.password || errors.submit) {
              setErrors((prev) => ({
                ...prev,
                password: "",
                submit: "",
              }));
            }
          }}
        />

        {/* Confirm Password */}
        <PasswordInput
          label="Confirm Password"
          placeholder="Confirm your password"
          value={confirmPassword}
          error={errors.confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);

            if (errors.confirmPassword || errors.submit) {
              setErrors((prev) => ({
                ...prev,
                confirmPassword: "",
                submit: "",
              }));
            }
          }}
        />

        {/* Terms */}
        <div className="auth-terms">
          <label className="auth-terms-label">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => {
                setAgreeTerms(e.target.checked);

                if (errors.agreeTerms) {
                  setErrors((prev) => ({
                    ...prev,
                    agreeTerms: "",
                  }));
                }
              }}
            />

            <span>
              I agree to the{" "}
              <span className="auth-terms-link">
                Terms of Service
              </span>{" "}
              and{" "}
              <span className="auth-terms-link">
                Privacy Policy
              </span>
            </span>
          </label>

          {errors.agreeTerms && (
            <p className="auth-terms-error">
              {errors.agreeTerms}
            </p>
          )}
        </div>

        {/* General Error */}
        {errors.submit && (
          <p className="auth-error">
            {errors.submit}
          </p>
        )}

        {/* Register */}
        <AuthButton
          type="submit"
          loading={isSubmitting}
        >
          Create Account
        </AuthButton>
      </form>

      {/* Google only */}
      <SocialLogin />

      {/* Login */}
      <p className="auth-footer">
        Already have an account?{" "}
        <Link to="/login">
          Login
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Register;
