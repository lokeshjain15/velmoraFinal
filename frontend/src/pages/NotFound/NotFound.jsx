import { Link } from "react-router-dom";
import { FiArrowRight, FiCompass } from "react-icons/fi";

function NotFound() {
  return (
    <main className="min-h-[calc(100vh-82px)] bg-[#faf7ef] text-[#332b24]">
      <div className="mx-auto flex min-h-[calc(100vh-82px)] w-full max-w-[1180px] items-center justify-center px-5 py-16 text-center sm:px-8 lg:px-10">
        <div className="max-w-[620px]">
          <div className="mx-auto flex h-[72px] w-[72px] items-center justify-center rounded-full border border-[#d8cfc3] bg-[#fffaf5] text-[#8c735b]">
            <FiCompass size={28} strokeWidth={1.4} />
          </div>

          <p className="mt-8 text-[14px] font-semibold uppercase tracking-[0.3em] text-[#9b8772]">
            Page Not Found
          </p>

          <h1 className="mt-4 font-serif text-[64px] font-medium leading-[0.9] tracking-[-0.03em] text-[#332b24] sm:text-[82px]">
            404
            <span className="block text-[28px] italic font-normal text-[#715f4e] sm:text-[36px]">
              Lost in Reflection
            </span>
          </h1>

          <div className="my-6 flex items-center justify-center">
            <span className="h-px w-10 bg-[#d4c7b8]" />
            <span className="mx-3 h-[5px] w-[5px] rotate-45 bg-[#8c735b]" />
            <span className="h-px w-10 bg-[#d4c7b8]" />
          </div>

          <p className="mx-auto max-w-[460px] text-[16px] leading-7 text-[#766b60]">
            The space you are looking for may have moved or no longer exists.
            Let us guide you back to our curated catalog.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/"
              className="group inline-flex min-h-[50px] w-full items-center justify-center gap-3 bg-[#332b24] px-8 text-[14px] font-semibold uppercase tracking-[0.17em] text-white transition hover:bg-[#514337] sm:w-auto"
            >
              Return Home
              <FiArrowRight
                size={14}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>

            <Link
              to="/shop"
              className="inline-flex min-h-[50px] w-full items-center justify-center border border-[#cfc2b3] bg-transparent px-8 text-[14px] font-semibold uppercase tracking-[0.17em] text-[#554637] transition hover:bg-[#f3ede3] sm:w-auto"
            >
              Browse Shop
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default NotFound;
