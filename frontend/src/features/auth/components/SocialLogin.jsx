import { FcGoogle } from "react-icons/fc";
import { getGoogleLoginUrl } from "../services/auth.api";

const SocialLogin = () => {
  return (
    <>
      <div className="auth-divider">
        <span>or continue with</span>
      </div>

      <button
        type="button"
        className="auth-google"
        onClick={() => window.location.assign(getGoogleLoginUrl())}
      >
        <FcGoogle size={24} />

        <span>
          Continue with Google
        </span>
      </button>
    </>
  );
};

export default SocialLogin;
