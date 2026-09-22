import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="vel-footer">
      <div className="vel-footer-inner">

        {/* Brand */}
        <div className="vel-footer-column vel-footer-brand">
          <Link to="/" className="vel-footer-logo">
            VELMORA
          </Link>

          <p className="vel-footer-description">
            Curated interiors for refined living.
            Discover timeless pieces designed to bring
            elegance, comfort, and character to your home.
          </p>
        </div>

        {/* Shop */}
        <div className="vel-footer-column">
          <h3>Shop</h3>

          <nav className="vel-footer-links">
            <Link to="/shop">Shop All</Link>
            <Link to="/collections">Collections</Link>
            <Link to="/new-arrivals">New Arrivals</Link>
            <Link to="/best-sellers">Best Sellers</Link>
          </nav>
        </div>

        {/* Customer Care */}
        <div className="vel-footer-column">
          <h3>Customer Care</h3>

          <nav className="vel-footer-links">
            <Link to="/contact">Contact Us</Link>
            <Link to="/about">About Us</Link>
            <Link to="/cart">Your Cart</Link>
            <Link to="/wishlist">Wishlist</Link>
          </nav>
        </div>

        {/* Connect */}
        <div className="vel-footer-column">
          <h3>Connect</h3>

          <div className="vel-footer-contact">
            <p>Mumbai, Maharashtra, India</p>

            <a href="mailto:dugarlokesh28@gmail.com">
              dugarlokesh28@gmail.com
            </a>
          </div>
        </div>

      </div>

      {/* Bottom */}
      <div className="vel-footer-bottom">
        <p>© 2026 Velmora. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;