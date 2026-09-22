import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiHeart,
} from "react-icons/fi";

import { fetchProducts } from "../../services/product.service";
import { useWishlist } from "../../hooks/useWishlist";

function NewArrivals() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const {
    toggleWishlist,
    isWishlisted,
  } = useWishlist();

  useEffect(() => {
    let active = true;
    fetchProducts()
      .then((items) => {
        if (active) {
          setProducts(items);
        }
      })
      .catch((error) => {
        console.error("Failed to load new arrivals:", error);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const newArrivals = [...products]
    .reverse()
    .slice(0, 12);

  return (
    <main className="min-h-screen bg-[#faf7ef] text-[#332b24]">

      {/* =====================================
          HERO
      ====================================== */}

      <section className="border-b border-[#ded5c9]">
        <div className="mx-auto w-full max-w-[1280px] px-5 py-14 sm:px-8 sm:py-20 lg:px-10 lg:py-24">

          <p className="text-[14px] font-semibold uppercase tracking-[0.3em] text-[#9b8772]">
            The Latest Edit
          </p>

          <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

            <h1 className="font-serif text-[48px] font-medium leading-[0.92] tracking-[-0.03em] sm:text-[64px] lg:text-[76px]">
              New

              <span className="block italic font-normal text-[#715f4e]">
                Arrivals
              </span>
            </h1>

            <p className="max-w-[430px] text-[16px] leading-6 text-[#766b60]">
              Discover our newest pieces, thoughtfully selected
              to bring warmth, character and timeless detail
              into your home.
            </p>

          </div>
        </div>
      </section>

      {/* =====================================
          PRODUCTS
      ====================================== */}

      <section>
        <div className="mx-auto w-full max-w-[1280px] px-5 py-12 sm:px-8 sm:py-16 lg:px-10 lg:py-20">

          {/* TOP */}

          <div className="mb-9 flex items-end justify-between border-b border-[#ded5c9] pb-5">

            <div>
              <p className="text-[14px] font-semibold uppercase tracking-[0.25em] text-[#9b8772]">
                Recently Added
              </p>

              <h2 className="mt-2 font-serif text-[30px] sm:text-[36px]">
                Fresh Finds
              </h2>
            </div>

            <p className="text-[14px] uppercase tracking-[0.18em] text-[#8b7b6b]">
              {loading ? "Loading..." : `${newArrivals.length} Pieces`}
            </p>

          </div>

          {/* =====================================
              PRODUCT GRID
          ====================================== */}

          {loading ? (
            <div className="py-20 text-center text-[#8b7b6b]">
              <p className="text-[14px] uppercase tracking-[0.2em]">Loading new arrivals...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4 lg:gap-x-7 lg:gap-y-14">

              {newArrivals.map((product) => {
                const wishlisted =
                  isWishlisted(product.id);

                return (
                  <article
                    key={product.id}
                    className="group"
                  >

                    {/* =====================================
                        IMAGE
                    ====================================== */}

                    <div className="relative overflow-hidden bg-[#eee9e1]">

                      <Link
                        to={`/product/${product.id}`}
                        className="block overflow-hidden"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          loading="lazy"
                          className="aspect-[4/5] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.025]"
                        />
                      </Link>

                      {/* NEW BADGE */}

                      <span className="absolute left-3 top-3 bg-[#fffaf4]/95 px-3 py-1.5 text-[14px] font-semibold uppercase tracking-[0.18em] text-[#655747] backdrop-blur-sm">
                        New
                      </span>

                      {/* =====================================
                          GLOBAL WISHLIST
                      ====================================== */}

                      <button
                        type="button"
                        aria-label={
                          wishlisted
                            ? `Remove ${product.name} from wishlist`
                            : `Add ${product.name} to wishlist`
                        }
                        onClick={() =>
                          toggleWishlist(product)
                        }
                        className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-300 ${
                          wishlisted
                            ? "border-[#332b24] bg-[#332b24] text-white"
                            : "border-[#ded4c8] bg-[#fffaf4]/95 text-[#40372f] hover:border-[#332b24] hover:bg-[#332b24] hover:text-white"
                        }`}
                      >
                        <FiHeart
                          size={16}
                          fill={
                            wishlisted
                              ? "currentColor"
                              : "none"
                          }
                        />
                      </button>

                    </div>

                    {/* =====================================
                        PRODUCT DETAILS
                    ====================================== */}

                    <div className="pt-4">

                      <p className="text-[14px] font-semibold uppercase tracking-[0.2em] text-[#8f7d69]">
                        {product.categoryLabel ||
                          product.category}
                      </p>

                      <div className="mt-1.5 flex items-start justify-between gap-4">

                        <Link
                          to={`/product/${product.id}`}
                          className="min-w-0 font-serif text-[18px] leading-[1.15] text-[#332b24] transition-colors duration-200 hover:text-[#8A7356] sm:text-[20px]"
                        >
                          {product.name}
                        </Link>

                        <span className="shrink-0 pt-1 text-[14px] text-[#51483f]">
                          ₹
                          {Number(
                            product.price
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </span>

                      </div>

                    </div>

                  </article>
                );
              })}

            </div>
          )}

          {/* =====================================
              SHOP ALL
          ====================================== */}

          <div className="mt-16 flex justify-center border-t border-[#ded5c9] pt-10">

            <Link
              to="/shop"
              className="group inline-flex min-h-[50px] items-center justify-center gap-4 bg-[#332b24] px-8 text-[14px] font-semibold uppercase tracking-[0.2em] text-white transition-colors duration-300 hover:bg-[#514337]"
            >
              Explore All Pieces

              <FiArrowRight
                size={14}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>

          </div>

        </div>
      </section>

    </main>
  );
}

export default NewArrivals;