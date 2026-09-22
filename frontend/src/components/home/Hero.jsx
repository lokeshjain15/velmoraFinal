import { Link } from "react-router-dom";
import heroImage from "../../assets/images/hero/hero.jpeg";

function Hero() {
  return (
    <section className="relative h-[620px] w-full overflow-hidden sm:h-[680px] lg:h-[720px]">

      <img
        src={heroImage}
        alt="Velmora luxury interior"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />

      <div className="absolute inset-0 bg-black/30" />

      <div className="relative z-10 flex h-full items-center justify-center px-5">
        <div className="mx-auto max-w-[820px] text-center text-white">

          <p className="mb-5 text-[14px] font-medium uppercase tracking-[0.32em] text-white/80 sm:text-[14px]">
            Curated interiors for refined living
          </p>

          <h1 className="font-serif text-[42px] font-medium leading-[0.98] sm:text-[56px] lg:text-[64px]">
            Transform Your Home

            <span className="mt-2 block font-normal italic">
              Into Luxury
            </span>
          </h1>

          <p className="mx-auto mt-7 max-w-[600px] text-[16px] leading-6 text-white/90 sm:text-[16px]">
            Curated collections for the discerning eye. Experience timeless
            craftsmanship and modern elegance.
          </p>

          <Link
            to="/collections"
            className="mt-7 inline-flex min-h-[44px] items-center justify-center rounded-[3px] bg-[#171612] px-7 text-[14px] font-medium uppercase tracking-[0.08em] text-white transition hover:bg-black"
          >
            Explore Collection
          </Link>

        </div>
      </div>

    </section>
  );
}

export default Hero;