import { useState } from "react";
import { FiMail } from "react-icons/fi";
import { Link } from "react-router-dom";

import AuthLayout from "../components/AuthLayout";
import AuthInput from "../components/AuthInput";
import AuthButton from "../components/AuthButton";

import forgotImage from "../../../assets/images/auth/forgot.jpeg";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    if (!email.trim()) {
      setError("Email is required");
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }

    setError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setIsSubmitting(true);
      await new Promise((resolve) => setTimeout(resolve, 600));
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setError("Unable to process request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      image={forgotImage}
      title="Forgot password?"
      subtitle="Enter your registered email address to reset your password"
      imagePosition="left"
    >
      {submitted ? (
        <div className="rounded-xl border border-[#d8cfc3] bg-[#fffaf5] p-6 text-center">
          <p className="font-serif text-[22px] font-medium text-[#332b24]">Check your inbox</p>
          <p className="mt-2 text-[14px] leading-relaxed text-[#766b60]">
            If an account exists for <strong className="text-[#332b24]">{email}</strong>, we have sent instructions to reset your password.
          </p>
          <button
            type="button"
            onClick={() => {
              setSubmitted(false);
              setEmail("");
            }}
            className="mt-5 text-[14px] font-semibold text-[#8a7356] underline hover:text-[#5f4f3b]"
          >
            Send to a different email
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          noValidate
          className="auth-form"
        >
          <AuthInput
            label="Email Address"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);

              if (error) {
                setError("");
              }
            }}
            icon={FiMail}
            error={error}
          />

          <AuthButton
            type="submit"
            loading={isSubmitting}
          >
            Send Reset Link
          </AuthButton>
        </form>
      )}

      <p className="auth-footer">
        Remember your password?{" "}
        <Link to="/login">
          Back to Login
        </Link>
      </p>
    </AuthLayout>
  );
};

export default ForgotPassword;