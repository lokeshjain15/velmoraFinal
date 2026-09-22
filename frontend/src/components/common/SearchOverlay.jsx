import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiSearch,
  FiX,
  FiArrowRight,
} from "react-icons/fi";

import { fetchProducts } from "../../services/product.service";

function SearchOverlay({ open, onClose }) {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!open) return;
    let active = true;
    fetchProducts()
      .then((items) => {
        if (active) setProducts(items);
      })
      .catch((error) => {
        console.error("Failed to load products for search:", error);
      });

    return () => {
      active = false;
    };
  }, [open]);

  const results = useMemo(() => {
    const value = query.trim().toLowerCase();

    if (!value) {
      return [];
    }

    return products
      .filter((product) => {
        const searchableText = [
          product.name,
          product.category,
          product.categoryLabel,
          product.material,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return searchableText.includes(value);
      })
      .slice(0, 8);
  }, [query, products]);

  const handleClose = () => {
    setQuery("");
    onClose();
  };

  if (!open) {
    return null;
  }

  return (
    <>
      {/* Overlay */}
      <button
        type="button"
        aria-label="Close search"
        onClick={handleClose}
        className="fixed inset-0 z-[80] bg-black/35 backdrop-blur-[2px]"
      />

      {/* Search Panel */}
      <div className="fixed left-0 top-0 z-[90] w-full border-b border-[#ded4c8] bg-[#fffaf4] shadow-[0_24px_60px_rgba(60,45,30,0.18)]">
        <div className="mx-auto w-full max-w-[1180px] px-5 py-7 sm:px-8 lg:px-10">

          {/* Top */}
          <div className="flex items-center justify-between gap-5">
            <div>
              <p className="text-[14px] font-semibold uppercase tracking-[0.25em] text-[#9b8772]">
                Search Velmora
              </p>

              <h2 className="mt-2 font-serif text-[30px] font-medium text-[#332b24] sm:text-[36px]">
                Find Something Beautiful
              </h2>
            </div>

            <button
              type="button"
              aria-label="Close search"
              onClick={handleClose}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#ded4c8] text-[#50463d] transition hover:bg-[#332b24] hover:text-white"
            >
              <FiX size={18} />
            </button>
          </div>

          {/* Input */}
          <div className="relative mt-7">
            <FiSearch
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8e7d6b]"
            />

            <input
              type="search"
              autoFocus
              value={query}
              onChange={(event) =>
                setQuery(event.target.value)
              }
              placeholder="Search furniture, lighting, decor..."
              className="h-[56px] w-full border border-[#d9cfc2] bg-[#faf7ef] pl-12 pr-4 text-[16px] text-[#40372f] outline-none transition placeholder:text-[#a99b8d] focus:border-[#8a7356]"
            />
          </div>

          {/* Empty search */}
          {!query.trim() && (
            <div className="py-10 text-center">
              <p className="text-[14px] uppercase tracking-[0.18em] text-[#968370]">
                Start typing to discover products
              </p>
            </div>
          )}

          {/* No results */}
          {query.trim() && results.length === 0 && (
            <div className="py-10 text-center">
              <p className="text-[14px] font-semibold uppercase tracking-[0.22em] text-[#9b8772]">
                No Results
              </p>

              <h3 className="mt-3 font-serif text-[28px] font-medium text-[#332b24]">
                Nothing matched your search.
              </h3>

              <p className="mt-3 text-[15px] text-[#7b7065]">
                Try another product name, category or material.
              </p>
            </div>
          )}

          {/* Results */}
          {results.length > 0 && (
            <div className="mt-7 border-t border-[#ded5c9] pt-6">

              <div className="mb-5 flex items-center justify-between">
                <p className="text-[14px] font-semibold uppercase tracking-[0.22em] text-[#9b8772]">
                  Search Results
                </p>

                <span className="text-[14px] text-[#857669]">
                  {results.length} results
                </span>
              </div>

              <div className="grid max-h-[420px] grid-cols-1 gap-3 overflow-y-auto pr-1 sm:grid-cols-2">

                {results.map((product) => (
                  <Link
                    key={product.id}
                    to={`/product/${product.id}`}
                    onClick={handleClose}
                    className="group grid grid-cols-[72px_minmax(0,1fr)_30px] items-center gap-4 border border-[#e3d9cc] bg-[#faf7ef] p-3 transition hover:border-[#cbbba9] hover:bg-[#f3eee6]"
                  >
                    <div className="h-[78px] overflow-hidden bg-[#e7dfd4]">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[14px] font-semibold uppercase tracking-[0.16em] text-[#998571]">
                        {product.categoryLabel ||
                          product.category}
                      </p>

                      <h3 className="mt-1 truncate font-serif text-[19px] font-medium text-[#332b24]">
                        {product.name}
                      </h3>

                      <p className="mt-2 text-[14px] text-[#645a50]">
                        ₹
                        {Number(
                          product.price
                        ).toLocaleString("en-IN")}
                      </p>
                    </div>

                    <FiArrowRight
                      size={14}
                      className="text-[#756759] transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </Link>
                ))}

              </div>

              {/* Full Shop Search */}
              <div className="mt-6 flex justify-end">
                <Link
                  to={`/shop?search=${encodeURIComponent(
                    query.trim()
                  )}`}
                  onClick={handleClose}
                  className="inline-flex items-center gap-2 text-[14px] font-semibold uppercase tracking-[0.17em] text-[#655747]"
                >
                  View All Results
                  <FiArrowRight size={12} />
                </Link>
              </div>

            </div>
          )}

        </div>
      </div>
    </>
  );
}

export default SearchOverlay;