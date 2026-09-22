import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiSearch,
  FiHeart,
  FiShoppingBag,
  FiUser,
  FiMenu,
  FiX,
  FiLogIn,
  FiUserPlus,
  FiLogOut,
} from "react-icons/fi";

import NavLinks from "./NavLinks";
import SearchOverlay from "./SearchOverlay";

import { useCart } from "../../hooks/useCart";
import { useWishlist } from "../../hooks/useWishlist";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { logout } from "../../features/auth/services/auth.api";

function Navbar() {
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, setUser } = useAuth();

  const [accountOpen, setAccountOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const accountRef = useRef(null);

  /* ==========================================
     CLOSE ACCOUNT DROPDOWN OUTSIDE
  ========================================== */

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        accountRef.current &&
        !accountRef.current.contains(event.target)
      ) {
        setAccountOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  /* ==========================================
     ESC CLOSE
  ========================================== */

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setAccountOpen(false);
        setMobileOpen(false);
        setSearchOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, []);

  /* ==========================================
     OPEN SEARCH
  ========================================== */

  const openSearch = () => {
    setAccountOpen(false);
    setMobileOpen(false);
    setSearchOpen(true);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      setUser(null);
      setAccountOpen(false);
      setMobileOpen(false);
    }
  };

  return (
    <>
      <header className="fixed left-0 top-0 z-50 w-full border-b border-[#e9dfd3] bg-[#fffaf4]/95 shadow-[0_4px_18px_rgba(70,52,35,0.05)] backdrop-blur-xl">
        <div className="mx-auto grid h-[82px] w-full max-w-[1500px] grid-cols-[1fr_auto_1fr] items-center px-5 sm:px-8 lg:px-10 xl:px-14">

          {/* LEFT — LOGO */}
          <div className="flex items-center justify-start">
            <Link
              to="/"
              className="whitespace-nowrap font-serif text-[29px] font-medium tracking-[0.21em] text-[#6B5844] transition-opacity hover:opacity-75 sm:text-[33px] xl:text-[36px]"
            >
              VELMORA
            </Link>
          </div>

          {/* CENTER — DESKTOP NAVIGATION */}
          <nav className="hidden items-center justify-center lg:flex">
            <NavLinks />
          </nav>

          {/* RIGHT — DESKTOP ACTIONS */}
          <div className="hidden items-center justify-end gap-1 lg:flex">

            {/* Search */}
            <button
              type="button"
              aria-label="Search"
              onClick={openSearch}
              className="flex h-10 w-10 items-center justify-center rounded-full text-[#3f4854] transition hover:bg-[#f3ece4] hover:text-[#8A7356]"
            >
              <FiSearch size={20} />
            </button>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              aria-label={`Wishlist with ${wishlistCount} items`}
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-[#3f4854] transition hover:bg-[#f3ece4] hover:text-[#8A7356]"
            >
              <FiHeart size={20} />

              {wishlistCount > 0 && (
                <span className="absolute right-0 top-0 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#8A7356] px-1 text-[14px] font-semibold leading-none text-white">
                  {wishlistCount > 99
                    ? "99+"
                    : wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              aria-label={`Shopping bag with ${cartCount} items`}
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-[#3f4854] transition hover:bg-[#f3ece4] hover:text-[#8A7356]"
            >
              <FiShoppingBag size={20} />

              {cartCount > 0 && (
                <span className="absolute right-0 top-0 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#8A7356] px-1 text-[14px] font-semibold leading-none text-white">
                  {cartCount > 99
                    ? "99+"
                    : cartCount}
                </span>
              )}
            </Link>

            {/* Account */}
            <div
              ref={accountRef}
              className="relative"
            >
              <button
                type="button"
                aria-label="Account menu"
                aria-expanded={accountOpen}
                onClick={() =>
                  setAccountOpen((prev) => !prev)
                }
                className={`flex h-10 w-10 items-center justify-center rounded-full border transition ${
                  accountOpen
                    ? "border-[#cdbda9] bg-[#f3ece4] text-[#8A7356]"
                    : "border-transparent text-[#3f4854] hover:bg-[#f3ece4] hover:text-[#8A7356]"
                }`}
              >
                <FiUser size={20} />
              </button>

              {accountOpen && (
                <div className="absolute right-0 top-[58px] w-[260px] overflow-hidden rounded-2xl border border-[#e7dccd] bg-[#fffaf4] shadow-[0_20px_55px_rgba(74,55,36,0.16)]">
                  <div className="border-b border-[#eee3d6] px-5 py-4">
                    <p className="font-serif text-[21px] font-medium leading-tight text-[#5f4f3f]">
                      {user ? user.fullName : "Welcome to Velmora"}
                    </p>

                    <p className="mt-1.5 text-[16px] leading-5 text-[#9a8b7a]">
                      {user ? user.email : "Sign in or create your account"}
                    </p>
                  </div>

                  {user ? (
                    <>
                    {user.role === "seller" && (
                      <Link
                        to="/seller/dashboard"
                        onClick={() => setAccountOpen(false)}
                        className="flex w-full items-center gap-3 px-5 py-3.5 text-[14px] font-medium text-[#4f453a] transition hover:bg-[#f5eee6]"
                      >
                        <FiShoppingBag size={17} /> Seller Dashboard
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 border-t border-[#f0e6db] px-5 py-3.5 text-left text-[14px] font-medium text-[#4f453a] transition hover:bg-[#f5eee6] hover:text-[#7b664f]"
                    >
                      <FiLogOut size={17} />
                      Logout
                    </button>
                    </>
                  ) : <><Link
                    to="/login"
                    onClick={() =>
                      setAccountOpen(false)
                    }
                    className="flex items-center gap-3 px-5 py-3.5 text-[14px] font-medium text-[#4f453a] transition hover:bg-[#f5eee6] hover:text-[#7b664f]"
                  >
                    <FiLogIn size={17} />
                    Login
                  </Link>

                  <Link
                    to="/register"
                    onClick={() =>
                      setAccountOpen(false)
                    }
                    className="flex items-center gap-3 border-t border-[#f0e6db] px-5 py-3.5 text-[14px] font-medium text-[#4f453a] transition hover:bg-[#f5eee6] hover:text-[#7b664f]"
                  >
                    <FiUserPlus size={17} />
                    Create account
                  </Link>
                  </>}
                </div>
              )}
            </div>
          </div>

          {/* MOBILE RIGHT */}
          <div className="col-start-3 flex items-center justify-end gap-1 lg:hidden">

            {/* Mobile Wishlist */}
            <Link
              to="/wishlist"
              aria-label={`Wishlist with ${wishlistCount} items`}
              onClick={() =>
                setMobileOpen(false)
              }
              className="relative flex h-11 w-11 items-center justify-center rounded-full text-[#4f453a] transition hover:bg-[#f3ece4]"
            >
              <FiHeart size={20} />

              {wishlistCount > 0 && (
                <span className="absolute right-[2px] top-[2px] flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-[#8A7356] px-1 text-[14px] font-semibold leading-none text-white">
                  {wishlistCount > 99
                    ? "99+"
                    : wishlistCount}
                </span>
              )}
            </Link>

            {/* Mobile Cart */}
            <Link
              to="/cart"
              aria-label={`Shopping bag with ${cartCount} items`}
              onClick={() =>
                setMobileOpen(false)
              }
              className="relative flex h-11 w-11 items-center justify-center rounded-full text-[#4f453a] transition hover:bg-[#f3ece4]"
            >
              <FiShoppingBag size={21} />

              {cartCount > 0 && (
                <span className="absolute right-[2px] top-[2px] flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-[#8A7356] px-1 text-[14px] font-semibold leading-none text-white">
                  {cartCount > 99
                    ? "99+"
                    : cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu */}
            <button
              type="button"
              aria-label={
                mobileOpen
                  ? "Close menu"
                  : "Open menu"
              }
              onClick={() => {
                setMobileOpen(
                  (prev) => !prev
                );

                setAccountOpen(false);
              }}
              className="flex h-11 w-11 items-center justify-center rounded-full text-[#4f453a] transition hover:bg-[#f3ece4]"
            >
              {mobileOpen ? (
                <FiX size={24} />
              ) : (
                <FiMenu size={25} />
              )}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {mobileOpen && (
          <div className="max-h-[calc(100vh-82px)] overflow-y-auto border-t border-[#eadfd3] bg-[#fffaf4] px-6 py-6 shadow-[0_15px_35px_rgba(65,47,31,0.08)] lg:hidden">

            {/* Navigation */}
            <div
              onClick={() =>
                setMobileOpen(false)
              }
              className="mb-7"
            >
              <NavLinks />
            </div>

            {/* Utility Actions */}
            <div className="mb-6 grid grid-cols-3 gap-3 border-t border-[#eadfd3] pt-5">

              {/* Search */}
              <button
                type="button"
                onClick={openSearch}
                className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#e3d7c9] bg-white px-2 text-[16px] text-[#56493c]"
              >
                <FiSearch />
                Search
              </button>

              {/* Wishlist */}
              <Link
                to="/wishlist"
                onClick={() =>
                  setMobileOpen(false)
                }
                className="relative flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#e3d7c9] bg-white px-2 text-[16px] text-[#56493c]"
              >
                <FiHeart />

                Wishlist

                {wishlistCount > 0 && (
                  <span className="flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-[#8A7356] px-1 text-[14px] font-semibold text-white">
                    {wishlistCount > 99
                      ? "99+"
                      : wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                to="/cart"
                onClick={() =>
                  setMobileOpen(false)
                }
                className="relative flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#e3d7c9] bg-white px-2 text-[16px] text-[#56493c]"
              >
                <FiShoppingBag />
                Cart

                {cartCount > 0 && (
                  <span className="flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-[#8A7356] px-1 text-[14px] font-semibold text-white">
                    {cartCount > 99
                      ? "99+"
                      : cartCount}
                  </span>
                )}
              </Link>
            </div>

            {/* MOBILE ACCOUNT */}
            <div className="border-t border-[#eadfd3] pt-5">
              <p className="mb-3 text-[15px] font-medium uppercase tracking-[0.18em] text-[#a08f7d]">
                Account
              </p>

              {user && (
                <div className="mb-3 rounded-xl border border-[#ded2c3] bg-white px-4 py-3">
                  <p className="font-medium text-[#56493c]">{user.fullName}</p>
                  <p className="mt-1 truncate text-sm text-[#8c7c6b]">{user.email}</p>
                </div>
              )}

              <div className={user ? "grid grid-cols-1 gap-3" : "grid grid-cols-2 gap-3"}>
                {user ? (
                  <>
                  {user.role === "seller" && (
                    <Link to="/seller/dashboard" onClick={() => setMobileOpen(false)} className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#5a6247] text-sm font-medium text-white">
                      <FiShoppingBag /> Seller Dashboard
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex h-12 items-center justify-center gap-2 rounded-xl border border-[#ded2c3] bg-white text-sm font-medium text-[#56493c]"
                  >
                    <FiLogOut /> Logout
                  </button>
                  </>
                ) : <>
                <Link
                  to="/login"
                  onClick={() =>
                    setMobileOpen(false)
                  }
                  className="flex h-12 items-center justify-center gap-2 rounded-xl border border-[#ded2c3] bg-white text-sm font-medium text-[#56493c] transition hover:bg-[#f7f1ea]"
                >
                  <FiLogIn />
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={() =>
                    setMobileOpen(false)
                  }
                  className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#5a6247] text-sm font-medium text-white transition hover:bg-[#4d563e]"
                >
                  <FiUserPlus />
                  Register
                </Link>
                </>}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* SEARCH OVERLAY */}
      <SearchOverlay
        open={searchOpen}
        onClose={() =>
          setSearchOpen(false)
        }
      />
    </>
  );
}

export default Navbar;
