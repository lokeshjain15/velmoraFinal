import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  FiChevronLeft,
  FiHeart,
  FiMinus,
  FiPlus,
  FiShoppingBag,
} from "react-icons/fi";

import { fetchProductDetail, fetchProducts } from "../../services/product.service";

import { useCart } from "../../hooks/useCart";
import { useWishlist } from "../../hooks/useWishlist";

import "./productDetails.css";

function ProductDetails() {
  const { id } = useParams();

  const { addToCart } = useCart();

  const {
    toggleWishlist,
    isWishlisted,
  } = useWishlist();

  const [product, setProduct] = useState(null);
  const [productLoading, setProductLoading] = useState(true);
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    let active = true;
    setProductLoading(true);

    fetchProductDetail(id)
      .then((item) => {
        if (active) setProduct(item);
      })
      .catch((error) => {
        console.error("Failed to load product detail:", error);
        if (active) setProduct(null);
      })
      .finally(() => {
        if (active) setProductLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  useEffect(() => {
    let active = true;
    fetchProducts()
      .then((items) => {
        if (active) setAllProducts(items);
      })
      .catch((error) => {
        console.error("Failed to load related products:", error);
      });

    return () => {
      active = false;
    };
  }, []);

  const [quantity, setQuantity] =
    useState(1);

  const wishlisted = product
    ? isWishlisted(product.id)
    : false;

  /* ==========================================
     RELATED PRODUCTS
  ========================================== */

  const relatedProducts = useMemo(() => {
    if (!product || !allProducts.length) return [];

    return allProducts
      .filter(
        (item) =>
          item.category ===
            product.category &&
          String(item.id) !== String(product.id)
      )
      .slice(0, 4);
  }, [product, allProducts]);

  /* ==========================================
     QUANTITY
  ========================================== */

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    setQuantity((prev) =>
      Math.max(1, prev - 1)
    );
  };

  /* ==========================================
     PRODUCT NOT FOUND
  ========================================== */

  if (productLoading) {
    return <main className="product-details-page"><div className="product-details-container product-not-found"><p>Loading product...</p></div></main>;
  }

  if (!product) {
    return (
      <main className="product-details-page">
        <div className="product-details-container product-not-found">
          <p>
            Product not found
          </p>

          <h1>
            This piece is unavailable.
          </h1>

          <Link to="/shop">
            Back to Shop
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="product-details-page">

      {/* =========================
          BREADCRUMB
      ========================== */}

      <section className="product-breadcrumb">
        <div className="product-details-container">

          <Link to="/shop">
            <FiChevronLeft />
            Back to Shop
          </Link>

          <div className="product-breadcrumb-path">

            <Link to="/shop">
              Shop
            </Link>

            <span>/</span>

            <Link
              to={`/shop?category=${product.category}`}
            >
              {product.categoryLabel}
            </Link>

            <span>/</span>

            <span>
              {product.name}
            </span>

          </div>
        </div>
      </section>


      {/* =========================
          PRODUCT HERO
      ========================== */}

      <section className="product-main-section">
        <div className="product-details-container product-main-grid">

          {/* ==================================
              IMAGE
          =================================== */}

          <div className="product-gallery">

            <div className="product-main-image">

              <img
                src={product.image}
                alt={product.name}
              />

              {/* Wishlist Heart */}

              <button
                type="button"
                aria-label={
                  wishlisted
                    ? `Remove ${product.name} from wishlist`
                    : `Add ${product.name} to wishlist`
                }
                className={`product-detail-heart ${
                  wishlisted
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  toggleWishlist(product)
                }
              >
                <FiHeart
                  fill={
                    wishlisted
                      ? "currentColor"
                      : "none"
                  }
                />
              </button>

            </div>
          </div>


          {/* ==================================
              PRODUCT INFO
          =================================== */}

          <div className="product-detail-info">

            <p className="product-detail-category">
              {product.categoryLabel}
            </p>

            <h1>
              {product.name}
            </h1>

            <p className="product-detail-price">
              ₹
              {Number(
                product.price
              ).toLocaleString("en-IN")}
            </p>

            <div className="product-detail-divider" />


            {/* Description */}

            <p className="product-detail-description">
              A refined Velmora piece
              selected for its thoughtful
              proportions, tactile material
              and timeless character.
              Designed to bring quiet
              sophistication into everyday
              interiors.
            </p>


            {/* ==================================
                MATERIAL / COLLECTION
            =================================== */}

            <div className="product-meta">

              <div>
                <span>
                  Material
                </span>

                <strong>
                  {product.material}
                </strong>
              </div>

              <div>
                <span>
                  Collection
                </span>

                <strong>
                  {product.categoryLabel}
                </strong>
              </div>

            </div>


            {/* ==================================
                QUANTITY
            =================================== */}

            <div className="product-quantity-section">

              <p>
                Quantity
              </p>

              <div className="product-quantity">

                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={decreaseQuantity}
                  disabled={
                    quantity === 1
                  }
                >
                  <FiMinus />
                </button>

                <span>
                  {quantity}
                </span>

                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={increaseQuantity}
                >
                  <FiPlus />
                </button>

              </div>
            </div>


            {/* ==================================
                ACTIONS
            =================================== */}

            <div className="product-actions">

              {/* Add To Cart */}

              <button
                type="button"
                className="product-add-cart"
                onClick={() =>
                  addToCart(
                    product,
                    quantity
                  )
                }
              >
                <FiShoppingBag />

                Add to Cart

                <span>
                  ₹
                  {(
                    Number(
                      product.price
                    ) * quantity
                  ).toLocaleString(
                    "en-IN"
                  )}
                </span>
              </button>


              {/* Global Wishlist */}

              <button
                type="button"
                className={`product-wishlist-button ${
                  wishlisted
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  toggleWishlist(product)
                }
              >
                <FiHeart
                  fill={
                    wishlisted
                      ? "currentColor"
                      : "none"
                  }
                />

                {wishlisted
                  ? "Saved to Wishlist"
                  : "Add to Wishlist"}
              </button>

            </div>


            {/* ==================================
                SERVICE DETAILS
            =================================== */}

            <div className="product-service-info">

              <div>
                <span>
                  01
                </span>

                <p>
                  Carefully selected
                  materials
                </p>
              </div>

              <div>
                <span>
                  02
                </span>

                <p>
                  Thoughtfully packed
                  and delivered
                </p>
              </div>

              <div>
                <span>
                  03
                </span>

                <p>
                  Easy returns within
                  14 days
                </p>
              </div>

            </div>

          </div>
        </div>
      </section>


      {/* =========================
          EDITORIAL DETAIL
      ========================== */}

      <section className="product-editorial">

        <div className="product-details-container product-editorial-grid">

          <div>

            <p className="product-section-eyebrow">
              Velmora Details
            </p>

            <h2>
              Designed to live

              <span>
                beautifully with you.
              </span>
            </h2>

          </div>

          <p>
            Every Velmora piece is
            chosen with attention to
            proportion, texture and
            longevity. The result is an
            object that feels considered
            rather than decorative —
            something that quietly belongs
            in the room.
          </p>

        </div>
      </section>


      {/* =========================
          RELATED PRODUCTS
      ========================== */}

      {relatedProducts.length > 0 && (
        <section className="related-products-section">

          <div className="product-details-container">

            {/* Heading */}

            <div className="related-heading">

              <div>

                <p className="product-section-eyebrow">
                  You May Also Like
                </p>

                <h2>
                  More from{" "}
                  {product.categoryLabel}
                </h2>

              </div>

              <Link
                to={`/shop?category=${product.category}`}
              >
                View Collection
              </Link>

            </div>


            {/* Related Grid */}

            <div className="related-products-grid">

              {relatedProducts.map(
                (item) => {
                  const relatedWishlisted =
                    isWishlisted(
                      item.id
                    );

                  return (
                    <article
                      key={item.id}
                      className="related-card"
                    >

                      {/* Image */}

                      <div className="relative">

                        <Link
                          to={`/product/${item.id}`}
                          className="related-image"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                          />
                        </Link>

                        {/* Optional Wishlist Heart */}

                        <button
                          type="button"
                          aria-label={
                            relatedWishlisted
                              ? `Remove ${item.name} from wishlist`
                              : `Add ${item.name} to wishlist`
                          }
                          onClick={() =>
                            toggleWishlist(
                              item
                            )
                          }
                          className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-[#ded4c8] bg-[#fffaf4]/95 text-[#40372f] transition hover:bg-[#332b24] hover:text-white ${
                            relatedWishlisted
                              ? "bg-[#332b24] text-white"
                              : ""
                          }`}
                        >
                          <FiHeart
                            size={15}
                            fill={
                              relatedWishlisted
                                ? "currentColor"
                                : "none"
                            }
                          />
                        </button>

                      </div>


                      {/* Info */}

                      <div className="related-info">

                        <p>
                          {item.categoryLabel}
                        </p>

                        <div>

                          <Link
                            to={`/product/${item.id}`}
                          >
                            {item.name}
                          </Link>

                          <span>
                            ₹
                            {Number(
                              item.price
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </span>

                        </div>

                      </div>

                    </article>
                  );
                }
              )}

            </div>

          </div>
        </section>
      )}

    </main>
  );
}

export default ProductDetails;
