import "../auth.css";

const AuthLayout = ({
  image,
  title,
  subtitle,
  children,
  imagePosition = "left",
}) => {
  const imageBlock = (
    <div className="auth-image">
      <img src={image} alt="Velmora interior" />
    </div>
  );

  return (
    <div className="auth-page">
      <div className="auth-shell">
        {imagePosition === "left" && image && imageBlock}

        <div className="auth-content">
          <div className="auth-container">
            <div className="auth-brand">
              <h1 className="auth-brand-name">
                VELMORA
              </h1>

              <p className="auth-brand-tagline">
                CRAFTING SPACES. ELEVATING LIVES.
              </p>
            </div>

            <div className="auth-heading">
              <h2>{title}</h2>

              {subtitle && <p>{subtitle}</p>}
            </div>

            {children}
          </div>
        </div>

        {imagePosition === "right" && image && imageBlock}
      </div>
    </div>
  );
};

export default AuthLayout;