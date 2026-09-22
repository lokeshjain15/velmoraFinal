import { useState } from "react";
import { FiMail } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { login, getApiError } from "../services/auth.api";
import { useAuth } from "../hooks/useAuth";

import AuthLayout from "../components/AuthLayout";
import AuthInput from "../components/AuthInput";
import PasswordInput from "../components/PasswordInput";
import AuthButton from "../components/AuthButton";
import SocialLogin from "../components/SocialLogin";

import loginImage from "../../../assets/images/auth/login.jpeg";

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};

    // Email Validation
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    // Password Validation
    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await login({ email, password });
      setUser(response.user);
      navigate("/");
    } catch (error) {
      console.error(error);

      setErrors((prev) => ({
        ...prev,
        submit: getApiError(error, "Unable to login. Please try again."),
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      image={loginImage}
      title="Welcome back"
      subtitle="Login to continue your Velmora journey"
      imagePosition="left"
    >
      {/* LOGIN FORM */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="auth-form"
      >
        {/* EMAIL */}
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

        {/* PASSWORD */}
        <PasswordInput
          label="Password"
          placeholder="Enter your password"
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

        {/* FORGOT PASSWORD */}
        <div className="auth-forgot">
          <Link to="/forgot-password">
            Forgot password?
          </Link>
        </div>

        {/* GENERAL ERROR */}
        {errors.submit && (
          <p className="auth-error">
            {errors.submit}
          </p>
        )}

        {/* LOGIN BUTTON */}
        <AuthButton
          type="submit"
          loading={isSubmitting}
        >
          Login
        </AuthButton>
      </form>

      {/* GOOGLE LOGIN */}
      <SocialLogin />

      {/* REGISTER LINK */}
      <p className="auth-footer">
        Don&apos;t have an account?{" "}
        <Link to="/register">
          Create account
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Login;
