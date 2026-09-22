import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiHeart,
  FiSliders,
  FiX,
} from "react-icons/fi";

import { useWishlist } from "../../hooks/useWishlist";
import { fetchProducts } from "../../services/product.service";

import "./shop.css";

/* ==========================================
   FILTER DATA
========================================== */

const categories = [
  { label: "All", value: "all" },
  { label: "Furniture", value: "furniture" },
  { label: "Lighting", value: "lighting" },
  { label: "Decor", value: "decor" },
  { label: "Textiles", value: "textiles" },
  { label: "Rugs", value: "rugs" },
];

const validCategories = categories.map(
  (category) => category.value
);

const materials = [
  { label: "Wood", value: "wood" },
  { label: "Ceramic", value: "ceramic" },
  { label: "Linen", value: "linen" },
  { label: "Metal", value: "metal" },
  { label: "Wool", value: "wool" },
];

const priceOptions = [
  {
    label: "Under ₹5,000",
    value: "under-5000",
  },
  {
    label: "₹5,000 - ₹15,000",
    value: "5000-15000",
  },
  {
    label: "Over ₹15,000",
    value: "over-15000",
  },
];

const PRODUCTS_PER_PAGE = 12;

/* ==========================================
   SHOP
========================================== */

function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] =
    useSearchParams();

  /* ==========================================
     GLOBAL WISHLIST
  ========================================== */

  const {
    toggleWishlist,
    isWishlisted,
  } = useWishlist();

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchProducts()
      .then((allProducts) => {
        if (!active) return;
        setProducts(allProducts);
      })
      .catch((error) => {
        console.error("Failed to load products from API:", error);
        if (active) setProducts([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  /* ==========================================
     CATEGORY FROM URL
  ========================================== */

  const rawCategory =
    searchParams.get("category") || "all";

  const normalizedCategory =
    rawCategory.toLowerCase().trim();

  const selectedCategory =
    validCategories.includes(normalizedCategory)
      ? normalizedCategory
      : "all";

  /* ==========================================
     SEARCH FROM URL
  ========================================== */

  const searchQuery =
    searchParams
      .get("search")
      ?.trim()
      .toLowerCase() || "";

  /* ==========================================
     LOCAL FILTER STATES
  ========================================== */

  const [selectedMaterials, setSelectedMaterials] =
    useState([]);

  const [selectedPrices, setSelectedPrices] =
    useState([]);

  const [sortBy, setSortBy] =
    useState("featured");

  const [currentPage, setCurrentPage] =
    useState(1);

  const [
    mobileFiltersOpen,
    setMobileFiltersOpen,
  ] = useState(false);

  /* ==========================================
     RESET WHEN CATEGORY CHANGES
  ========================================== */

  useEffect(() => {
    setSelectedMaterials([]);
    setSelectedPrices([]);
    setCurrentPage(1);
  }, [selectedCategory]);

  /* ==========================================
     RESET PAGE WHEN FILTERS / SEARCH CHANGE
  ========================================== */

  useEffect(() => {
    setCurrentPage(1);
  }, [
    selectedMaterials,
    selectedPrices,
    sortBy,
    searchQuery,
  ]);

  /* ==========================================
     CATEGORY CHANGE
  ========================================== */

  const handleCategoryChange = (category) => {
    const normalized =
      category.toLowerCase().trim();

    const safeCategory =
      validCategories.includes(normalized)
        ? normalized
        : "all";

    setSelectedMaterials([]);
    setSelectedPrices([]);
    setCurrentPage(1);

    const nextParams = {};

    if (safeCategory !== "all") {
      nextParams.category = safeCategory;
    }

    if (searchQuery) {
      nextParams.search = searchQuery;
    }

    setSearchParams(nextParams);

    setMobileFiltersOpen(false);
  };

  /* ==========================================
     MATERIAL
  ========================================== */

  const toggleMaterial = (material) => {
    setSelectedMaterials((previous) => {
      if (previous.includes(material)) {
        return previous.filter(
          (item) => item !== material
        );
      }

      return [
        ...previous,
        material,
      ];
    });
  };

  /* ==========================================
     PRICE
  ========================================== */

  const togglePrice = (price) => {
    setSelectedPrices((previous) => {
      if (previous.includes(price)) {
        return previous.filter(
          (item) => item !== price
        );
      }

      return [
        ...previous,
        price,
      ];
    });
  };

  /* ==========================================
     FILTER PRODUCTS
  ========================================== */

  const filteredProducts = useMemo(() => {
    const matchesPrice = (product) => {
      if (selectedPrices.length === 0) {
        return true;
      }

      return selectedPrices.some((filter) => {
        const productPrice = Number(product.price);

        if (filter === "under-5000") {
          return productPrice < 5000;
        }

        if (filter === "5000-15000") {
          return productPrice >= 5000 && productPrice <= 15000;
        }

        if (filter === "over-15000") {
          return productPrice > 15000;
        }

        return true;
      });
    };
    let result = [...products];

    /* ------------------------------------------
       CATEGORY
    ------------------------------------------ */

    if (selectedCategory !== "all") {
      result = result.filter(
        (product) =>
          String(product.category)
            .toLowerCase()
            .trim() === selectedCategory
      );
    }

    /* ------------------------------------------
       SEARCH
    ------------------------------------------ */

    if (searchQuery) {
      result = result.filter((product) => {
        const searchableText = [
          product.name,
          product.category,
          product.categoryLabel,
          product.material,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return searchableText.includes(
          searchQuery
        );
      });
    }

    /* ------------------------------------------
       MATERIAL
    ------------------------------------------ */

    if (selectedMaterials.length > 0) {
      result = result.filter((product) => {
        const productMaterial = String(
          product.material || ""
        )
          .toLowerCase()
          .trim();

        return selectedMaterials.includes(
          productMaterial
        );
      });
    }

    /* ------------------------------------------
       PRICE
    ------------------------------------------ */

    result = result.filter(matchesPrice);

    /* ------------------------------------------
       SORTING
    ------------------------------------------ */

    switch (sortBy) {
      case "price-low":
        result.sort(
          (a, b) =>
            Number(a.price) -
            Number(b.price)
        );
        break;

      case "price-high":
        result.sort(
          (a, b) =>
            Number(b.price) -
            Number(a.price)
        );
        break;

      case "name":
        result.sort((a, b) =>
          String(a.name).localeCompare(
            String(b.name)
          )
        );
        break;

      default:
        break;
    }

    return result;
  }, [
    products,
    selectedCategory,
    selectedMaterials,
    selectedPrices,
    sortBy,
    searchQuery,
  ]);

  /* ==========================================
     PAGINATION
  ========================================== */

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredProducts.length /
        PRODUCTS_PER_PAGE
    )
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  const visibleProducts = useMemo(() => {
    const startIndex =
      (currentPage - 1) *
      PRODUCTS_PER_PAGE;

    const endIndex =
      startIndex +
      PRODUCTS_PER_PAGE;

    return filteredProducts.slice(
      startIndex,
      endIndex
    );
  }, [
    filteredProducts,
    currentPage,
  ]);

  /* ==========================================
     CLEAR ALL FILTERS
  ========================================== */

  const clearFilters = () => {
    setSelectedMaterials([]);
    setSelectedPrices([]);
    setSortBy("featured");
    setCurrentPage(1);
    setMobileFiltersOpen(false);

    setSearchParams({});
  };

  /* ==========================================
     CLEAR SEARCH ONLY
  ========================================== */

  const clearSearch = () => {
    const nextParams = {};

    if (
      selectedCategory !== "all"
    ) {
      nextParams.category =
        selectedCategory;
    }

    setSearchParams(nextParams);

    setCurrentPage(1);
  };

  /* ==========================================
     ACTIVE FILTER CHECK
  ========================================== */

  const hasActiveFilters =
    selectedCategory !== "all" ||
    selectedMaterials.length > 0 ||
    selectedPrices.length > 0 ||
    Boolean(searchQuery);

  /* ==========================================
     SCROLL SHOP TOP
  ========================================== */

  const scrollShopTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* ==========================================
     RENDER
  ========================================== */

  return (
    <main className="shop-page">

      {/* ======================================
          INTRO
      ======================================= */}

      <section className="shop-intro">
        <div className="shop-container">
          <p>
            Discover refined pieces chosen for
            warmth, proportion, craftsmanship and
            timeless everyday living.
          </p>
        </div>
      </section>

      {/* ======================================
          SHOP
      ======================================= */}

      <section className="shop-section">
        <div className="shop-container shop-layout">

          {/* ==================================
              DESKTOP SIDEBAR
          =================================== */}

          <aside className="shop-sidebar">

            <div className="shop-filter-title">
              <h2>
                Filters
              </h2>
            </div>

            {/* CATEGORY */}

            <FilterSection title="Category">
              {categories.map(
                (category) => (
                  <FilterOption
                    key={category.value}
                    type="radio"
                    name="desktop-category"
                    label={category.label}
                    checked={
                      selectedCategory ===
                      category.value
                    }
                    onChange={() =>
                      handleCategoryChange(
                        category.value
                      )
                    }
                  />
                )
              )}
            </FilterSection>

            {/* MATERIAL */}

            <FilterSection title="Material">
              {materials.map(
                (material) => (
                  <FilterOption
                    key={material.value}
                    type="checkbox"
                    label={material.label}
                    checked={selectedMaterials.includes(
                      material.value
                    )}
                    onChange={() =>
                      toggleMaterial(
                        material.value
                      )
                    }
                  />
                )
              )}
            </FilterSection>

            {/* PRICE */}

            <FilterSection title="Price">
              {priceOptions.map(
                (price) => (
                  <FilterOption
                    key={price.value}
                    type="checkbox"
                    label={price.label}
                    checked={selectedPrices.includes(
                      price.value
                    )}
                    onChange={() =>
                      togglePrice(
                        price.value
                      )
                    }
                  />
                )
              )}
            </FilterSection>

            {/* CLEAR */}

            {hasActiveFilters && (
              <button
                type="button"
                className="shop-clear"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            )}

          </aside>

          {/* ==================================
              PRODUCTS AREA
          =================================== */}

          <div className="shop-products-area">

            {/* ==================================
                SEARCH TITLE
            =================================== */}

            {searchQuery && (
              <div className="mb-6 flex items-end justify-between gap-5 border-b border-[#ded5c9] pb-5">

                <div>

                  <p className="text-[14px] font-semibold uppercase tracking-[0.2em] text-[#9b8772]">
                    Search Results
                  </p>

                  <h2 className="mt-1 font-serif text-[28px] font-medium text-[#332b24]">
                    “{searchQuery}”
                  </h2>

                </div>

                <button
                  type="button"
                  onClick={clearSearch}
                  className="shrink-0 text-[14px] font-semibold uppercase tracking-[0.15em] text-[#77695c] transition hover:text-[#332b24]"
                >
                  Clear Search
                </button>

              </div>
            )}

            {/* ==================================
                TOOLBAR
            =================================== */}

            <div className="shop-toolbar">

              {/* Desktop Category Tabs */}

              <div className="shop-category-tabs">

                {categories.map(
                  (category) => (
                    <button
                      key={category.value}
                      type="button"
                      className={
                        selectedCategory ===
                        category.value
                          ? "active"
                          : ""
                      }
                      onClick={() =>
                        handleCategoryChange(
                          category.value
                        )
                      }
                    >
                      {category.label}
                    </button>
                  )
                )}

              </div>

              {/* Mobile Filters */}

              <button
                type="button"
                className="shop-mobile-filter-button"
                onClick={() =>
                  setMobileFiltersOpen(
                    true
                  )
                }
              >
                <FiSliders />
                Filters
              </button>

              {/* Toolbar Right */}

              <div className="shop-toolbar-right">

                <span className="shop-count">
                  {filteredProducts.length}{" "}
                  {filteredProducts.length ===
                  1
                    ? "Piece"
                    : "Pieces"}
                </span>

                <div className="shop-sort">

                  <select
                    value={sortBy}
                    onChange={(event) =>
                      setSortBy(
                        event.target.value
                      )
                    }
                  >
                    <option value="featured">
                      Sort by: Featured
                    </option>

                    <option value="price-low">
                      Price: Low to High
                    </option>

                    <option value="price-high">
                      Price: High to Low
                    </option>

                    <option value="name">
                      Name: A to Z
                    </option>
                  </select>

                  <FiChevronDown />

                </div>

              </div>
            </div>

            {/* ==================================
                PRODUCTS
            =================================== */}

            {loading ? (
              <div className="py-24 text-center text-[#8b7b6b]">
                <p className="text-[14px] uppercase tracking-[0.2em]">
                  Loading pieces...
                </p>
              </div>
            ) : visibleProducts.length >
            0 ? (
              <>
                <div className="shop-product-grid">

                  {visibleProducts.map(
                    (product) => {
                      const wishlisted =
                        isWishlisted(
                          product.id
                        );

                      return (
                        <article
                          key={product.id}
                          className="shop-product-card"
                        >

                          {/* Image */}

                          <div className="shop-product-image-wrap">

                            <Link
                              to={`/product/${product.id}`}
                              className="shop-product-image"
                            >
                              <img
                                src={
                                  product.image
                                }
                                alt={
                                  product.name
                                }
                                loading="lazy"
                              />
                            </Link>

                            {/* Wishlist */}

                            <button
                              type="button"
                              aria-label={
                                wishlisted
                                  ? `Remove ${product.name} from wishlist`
                                  : `Add ${product.name} to wishlist`
                              }
                              className={`shop-wishlist ${
                                wishlisted
                                  ? "active"
                                  : ""
                              }`}
                              onClick={() =>
                                toggleWishlist(
                                  product
                                )
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

                          {/* Information */}

                          <div className="shop-product-info">

                            <p className="shop-product-category">
                              {product.categoryLabel ||
                                product.category}
                            </p>

                            <div className="shop-product-bottom">

                              <Link
                                to={`/product/${product.id}`}
                                className="shop-product-name"
                              >
                                {
                                  product.name
                                }
                              </Link>

                              <span className="shop-product-price">
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
                    }
                  )}

                </div>

                {/* ==================================
                    PAGINATION
                =================================== */}

                {totalPages > 1 && (
                  <div className="shop-pagination">

                    {/* Previous */}

                    <button
                      type="button"
                      aria-label="Previous page"
                      disabled={
                        currentPage === 1
                      }
                      onClick={() => {
                        setCurrentPage(
                          (page) =>
                            Math.max(
                              1,
                              page - 1
                            )
                        );

                        scrollShopTop();
                      }}
                    >
                      <FiChevronLeft />
                    </button>

                    {/* Page Numbers */}

                    {Array.from(
                      {
                        length:
                          totalPages,
                      },
                      (_, index) =>
                        index + 1
                    ).map((page) => (
                      <button
                        key={page}
                        type="button"
                        className={
                          currentPage ===
                          page
                            ? "active"
                            : ""
                        }
                        onClick={() => {
                          setCurrentPage(
                            page
                          );

                          scrollShopTop();
                        }}
                      >
                        {page}
                      </button>
                    ))}

                    {/* Next */}

                    <button
                      type="button"
                      aria-label="Next page"
                      disabled={
                        currentPage ===
                        totalPages
                      }
                      onClick={() => {
                        setCurrentPage(
                          (page) =>
                            Math.min(
                              totalPages,
                              page + 1
                            )
                        );

                        scrollShopTop();
                      }}
                    >
                      <FiChevronRight />
                    </button>

                  </div>
                )}
              </>
            ) : (
              /* ==================================
                  EMPTY
              =================================== */

              <div className="shop-empty">

                <p>
                  No Products Found
                </p>

                <h2>
                  Try another combination.
                </h2>

                {searchQuery && (
                  <p className="mt-3 text-[15px] text-[#817468]">
                    No products matched
                    “{searchQuery}”.
                  </p>
                )}

                <button
                  type="button"
                  onClick={clearFilters}
                >
                  Clear Filters
                </button>

              </div>
            )}

          </div>
        </div>
      </section>

      {/* ======================================
          MOBILE FILTER DRAWER
      ======================================= */}

      {mobileFiltersOpen && (
        <>
          {/* Overlay */}

          <button
            type="button"
            className="shop-mobile-overlay"
            aria-label="Close filters"
            onClick={() =>
              setMobileFiltersOpen(
                false
              )
            }
          />

          {/* Drawer */}

          <aside className="shop-mobile-drawer">

            {/* Header */}

            <div className="shop-mobile-drawer-header">

              <h2>
                Filters
              </h2>

              <button
                type="button"
                aria-label="Close filters"
                onClick={() =>
                  setMobileFiltersOpen(
                    false
                  )
                }
              >
                <FiX />
              </button>

            </div>

            {/* Category */}

            <FilterSection title="Category">
              {categories.map(
                (category) => (
                  <FilterOption
                    key={category.value}
                    type="radio"
                    name="mobile-category"
                    label={category.label}
                    checked={
                      selectedCategory ===
                      category.value
                    }
                    onChange={() =>
                      handleCategoryChange(
                        category.value
                      )
                    }
                  />
                )
              )}
            </FilterSection>

            {/* Material */}

            <FilterSection title="Material">
              {materials.map(
                (material) => (
                  <FilterOption
                    key={material.value}
                    type="checkbox"
                    label={material.label}
                    checked={selectedMaterials.includes(
                      material.value
                    )}
                    onChange={() =>
                      toggleMaterial(
                        material.value
                      )
                    }
                  />
                )
              )}
            </FilterSection>

            {/* Price */}

            <FilterSection title="Price">
              {priceOptions.map(
                (price) => (
                  <FilterOption
                    key={price.value}
                    type="checkbox"
                    label={price.label}
                    checked={selectedPrices.includes(
                      price.value
                    )}
                    onChange={() =>
                      togglePrice(
                        price.value
                      )
                    }
                  />
                )
              )}
            </FilterSection>

            {/* Actions */}

            <div className="shop-mobile-actions">

              <button
                type="button"
                className="primary"
                onClick={() =>
                  setMobileFiltersOpen(
                    false
                  )
                }
              >
                View{" "}
                {
                  filteredProducts.length
                }{" "}
                {filteredProducts.length ===
                1
                  ? "Piece"
                  : "Pieces"}
              </button>

              <button
                type="button"
                className="secondary"
                onClick={clearFilters}
              >
                Clear Filters
              </button>

            </div>

          </aside>
        </>
      )}

    </main>
  );
}

/* ==========================================
   FILTER SECTION
========================================== */

function FilterSection({
  title,
  children,
}) {
  return (
    <div className="shop-filter-section">

      <p>
        {title}
      </p>

      <div className="shop-filter-options">
        {children}
      </div>

    </div>
  );
}

/* ==========================================
   FILTER OPTION
========================================== */

function FilterOption({
  type,
  name,
  label,
  checked,
  onChange,
}) {
  return (
    <label className="shop-filter-option">

      <input
        type={type}
        name={name}
        checked={checked}
        onChange={onChange}
      />

      <span>
        {label}
      </span>

    </label>
  );
}

export default Shop;
