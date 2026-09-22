import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiHeart,
  FiShoppingBag,
  FiTrash2,
} from "react-icons/fi";

import { useWishlist } from "../../hooks/useWishlist";
import { useCart } from "../../hooks/useCart";

function Wishlist() {
  const {
    items,
    removeFromWishlist,
    clearWishlist,
  } = useWishlist();

  const { addToCart } = useCart();

  if (items.length === 0) {
    return (
      <main className="min-h-[calc(100vh-82px)] bg-[#faf7ef]">
        <div className="mx-auto flex min-h-[calc(100vh-82px)] w-full max-w-[1180px] items-center justify-center px-5 py-16 text-center sm:px-8 lg:px-10">
          <div className="max-w-[560px]">

            <div className="mx-auto flex h-[68px] w-[68px] items-center justify-center rounded-full border border-[#d8cfc3] bg-[#fffaf5] text-[#665747]">
              <FiHeart size={25} strokeWidth={1.4} />
            </div>

            <p className="mt-7 text-[14px] font-semibold uppercase tracking-[0.28em] text-[#9b8772]">
              Your Wishlist
            </p>

            <h1 className="mt-4 font-serif text-[46px] font-medium leading-none text-[#332b24] sm:text-[56px]">
              Nothing Saved Yet
            </h1>

            <p className="mx-auto mt-5 max-w-[430px] text-[16px] leading-7 text-[#766b60]">
              Save pieces you love and return to them whenever
              inspiration strikes.
            </p>

            <Link
              to="/shop"
              className="group mt-8 inline-flex min-h-[50px] items-center justify-center gap-3 bg-[#332b24] px-8 text-[14px] font-semibold uppercase tracking-[0.17em] text-white transition hover:bg-[#514337]"
            >
              Explore Shop

              <FiArrowRight
                size={14}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>

          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf7ef] text-[#332b24]">
      <div className="mx-auto w-full max-w-[1280px] px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">

        {/* HEADER */}
        <div className="mb-12 flex flex-col gap-6 border-b border-[#ddd4c8] pb-9 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 text-[14px] font-semibold uppercase tracking-[0.28em] text-[#9b8772]">
              Saved Pieces
            </p>

            <h1 className="font-serif text-[48px] font-medium leading-none sm:text-[58px]">
              Your Wishlist
            </h1>

            <p className="mt-4 text-[15px] text-[#7c7166]">
              {items.length}{" "}
              {items.length === 1 ? "piece" : "pieces"} saved
            </p>
          </div>

          <button
            type="button"
            onClick={clearWishlist}
            className="w-fit border-b border-[#77695d] pb-1 text-[14px] font-semibold uppercase tracking-[0.15em] text-[#77695d]"
          >
            Clear Wishlist
          </button>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((product) => (
            <article
              key={product.id}
              className="group"
            >
              <div className="relative overflow-hidden bg-[#eee9e1]">

                <Link to={`/product/${product.id}`}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-[1.025]"
                  />
                </Link>

                <button
                  type="button"
                  aria-label={`Remove ${product.name} from wishlist`}
                  onClick={() =>
                    removeFromWishlist(product.id)
                  }
                  className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-[#ded4c8] bg-[#fffaf4]/95 text-[#40372f] transition hover:bg-[#332b24] hover:text-white"
                >
                  <FiTrash2 size={14} />
                </button>

              </div>

              <div className="pt-4">
                <p className="text-[14px] font-semibold uppercase tracking-[0.18em] text-[#907d69]">
                  {product.categoryLabel || product.category}
                </p>

                <div className="mt-1.5 flex items-start justify-between gap-4">
                  <Link
                    to={`/product/${product.id}`}
                    className="font-serif text-[20px] leading-[1.08] transition hover:text-[#8A7356]"
                  >
                    {product.name}
                  </Link>

                  <span className="shrink-0 pt-1 text-[14px] text-[#51483f]">
                    ₹{Number(product.price).toLocaleString("en-IN")}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => addToCart(product, 1)}
                  className="mt-5 flex min-h-[42px] w-full items-center justify-center gap-2 border border-[#d8cfc3] bg-transparent text-[14px] font-semibold uppercase tracking-[0.15em] text-[#574b40] transition hover:border-[#332b24] hover:bg-[#332b24] hover:text-white"
                >
                  <FiShoppingBag size={13} />
                  Add to Cart
                </button>
              </div>

            </article>
          ))}
        </div>

      </div>
    </main>
  );
}

export default Wishlist;