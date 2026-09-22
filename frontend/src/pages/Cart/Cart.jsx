import { Link } from "react-router-dom";
import {
  FiMinus,
  FiPlus,
  FiTrash2,
  FiArrowRight,
  FiShoppingBag,
} from "react-icons/fi";

import { useCart } from "../../hooks/useCart";
import "./cart.css";

function Cart() {
  const { items, subtotal, removeFromCart, updateQuantity, clearCart } =
    useCart();

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  /* =============================
     EMPTY CART
  ============================== */

  if (items.length === 0) {
    return (
      <section className="vel-cart-page vel-cart-empty-page">
        <div className="vel-cart-container vel-cart-empty">
          <div className="vel-cart-empty-icon">
            <FiShoppingBag />
          </div>

          <p className="vel-cart-eyebrow">Shopping Bag</p>

          <h1>Your Cart is Empty</h1>

          <div className="vel-cart-ornament">
            <span />
            <i />
            <span />
          </div>

          <p className="vel-cart-empty-description">
            Your bag is waiting for something beautiful. Explore our
            thoughtfully curated collection of timeless pieces.
          </p>

          <Link to="/shop" className="vel-cart-primary-button">
            Continue Shopping
            <FiArrowRight />
          </Link>
        </div>
      </section>
    );
  }

  /* =============================
     CART WITH PRODUCTS
  ============================== */

  return (
    <section className="vel-cart-page">
      <div className="vel-cart-container">
        {/* Header */}
        <header className="vel-cart-header">
          <div>
            <p className="vel-cart-eyebrow">Shopping Bag</p>

            <h1>Your Cart</h1>

            <p className="vel-cart-count-text">
              {totalItems} {totalItems === 1 ? "item" : "items"} in your bag
            </p>
          </div>

          <button type="button" className="vel-cart-clear" onClick={clearCart}>
            Clear Cart
          </button>
        </header>

        {/* Main layout */}
        <div className="vel-cart-layout">
          {/* Products */}
          <div className="vel-cart-items">
            {items.map((item) => (
              <article key={item.id} className="vel-cart-item">
                {/* Image */}
                <Link
                  to={`/product/${item.id}`}
                  className="vel-cart-item-image"
                >
                  <img src={item.image} alt={item.name} />
                </Link>

                {/* Info */}
                <div className="vel-cart-item-content">
                  <div className="vel-cart-item-main">
                    <p className="vel-cart-item-category">
                      {item.categoryLabel || item.category}
                    </p>

                    <Link
                      to={`/product/${item.id}`}
                      className="vel-cart-item-name"
                    >
                      {item.name}
                    </Link>

                    {item.material && (
                      <p className="vel-cart-item-material">
                        Material: {item.material}
                      </p>
                    )}

                    <div className="vel-cart-quantity-block">
                      <p>Quantity</p>

                      <div className="vel-cart-quantity">
                        <button
                          type="button"
                          disabled={item.quantity <= 1}
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                        >
                          <FiMinus />
                        </button>

                        <span>{item.quantity}</span>

                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          <FiPlus />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right side */}
                  <div className="vel-cart-item-side">
                    <strong>
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </strong>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <FiTrash2 />
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Summary */}
          <aside className="vel-cart-summary">
            <p className="vel-cart-summary-label">Order Summary</p>

            <div className="vel-cart-summary-rows">
              <div>
                <span>Subtotal</span>

                <strong>₹{subtotal.toLocaleString("en-IN")}</strong>
              </div>

              <div>
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>

              <div>
                <span>Taxes</span>
                <span>Calculated at checkout</span>
              </div>
            </div>

            <div className="vel-cart-summary-divider" />

            <div className="vel-cart-total">
              <span>Total</span>

              <strong>₹{subtotal.toLocaleString("en-IN")}</strong>
            </div>

            <Link to="/checkout" className="vel-cart-checkout">
              Proceed to Checkout
              <FiArrowRight />
            </Link>

            <Link to="/shop" className="vel-cart-continue">
              Continue Shopping
            </Link>

            <div className="vel-cart-benefits">
              <p>Secure checkout</p>
              <p>Easy returns within 14 days</p>
              <p>Carefully packed and delivered</p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

export default Cart;
