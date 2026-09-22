import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiPlus } from "react-icons/fi";
import { fetchProducts } from "../../services/product.service";
import { useCart } from "../../hooks/useCart";

import "./home-sections.css";

function FeaturedCollection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    let active = true;
    fetchProducts()
      .then((items) => {
        if (active) {
          setProducts(items.slice(0, 4));
        }
      })
      .catch((error) => {
        console.error("Failed to load featured products:", error);
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const mainProduct = products[0];

  return (
    <section className="vel-edit-section">
      <div className="vel-home-container">

        <div className="vel-edit-heading">
          <div>
            <p className="vel-eyebrow">
              The Velmora Edit
            </p>

            <h2>
              Objects Worth
              <span>Living With</span>
            </h2>

            <p className="vel-edit-description">
              A considered selection of pieces chosen for material,
              proportion, character, and lasting beauty.
            </p>
          </div>

          <Link to="/shop" className="vel-discover-link">
            Discover All
            <FiArrowRight />
          </Link>
        </div>

        {loading ? (
          <div className="py-16 text-center text-[#8b7b6b]">
            <p className="text-[14px] uppercase tracking-[0.2em]">Loading featured pieces...</p>
          </div>
        ) : products.length > 0 && mainProduct ? (
          <div className="vel-products-layout">

            {/* Main Product */}
            <article className="vel-main-product">

              <Link
                to={`/product/${mainProduct.id}`}
                className="vel-main-product-image"
              >
                <img
                  src={mainProduct.image}
                  alt={mainProduct.name}
                  loading="lazy"
                />
              </Link>

              <div className="vel-main-product-info">
                <div>
                  <span>{mainProduct.categoryLabel}</span>

                  <Link to={`/product/${mainProduct.id}`}>
                    {mainProduct.name}
                  </Link>
                </div>

                <strong>₹{Number(mainProduct.price).toLocaleString("en-IN")}</strong>
              </div>

            </article>

            {/* Right list */}
            <div className="vel-product-list">
              {products.slice(1).map((product) => (
                <article
                  key={product.id}
                  className="vel-small-product"
                >
                  <Link
                    to={`/product/${product.id}`}
                    className="vel-small-product-image"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                    />
                  </Link>

                  <div className="vel-small-product-copy">
                    <span>{product.categoryLabel}</span>

                    <Link to={`/product/${product.id}`}>
                      {product.name}
                    </Link>

                    <strong>₹{Number(product.price).toLocaleString("en-IN")}</strong>
                  </div>

                  <button
                    type="button"
                    aria-label={`Add ${product.name} to cart`}
                    onClick={() => addToCart(product, 1)}
                  >
                    <FiPlus />
                  </button>
                </article>
              ))}
            </div>

          </div>
        ) : null}

      </div>
    </section>
  );
}

export default FeaturedCollection;