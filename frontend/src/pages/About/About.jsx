import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";

function About() {
  return (
    <main className="min-h-screen bg-[#faf7ef] text-[#332b24]">

      {/* HERO */}
      <section className="border-b border-[#ded5c9]">
        <div className="mx-auto w-full max-w-[1180px] px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
          <p className="text-[14px] font-semibold uppercase tracking-[0.3em] text-[#9b8772]">
            About Velmora
          </p>

          <div className="mt-5 grid gap-8 lg:grid-cols-[1fr_430px] lg:items-end">
            <h1 className="font-serif text-[50px] font-medium leading-[0.92] tracking-[-0.03em] sm:text-[64px] lg:text-[76px]">
              Thoughtful Living,
              <span className="block italic font-normal text-[#715f4e]">
                Beautifully Considered
              </span>
            </h1>

            <p className="max-w-[430px] text-[16px] leading-7 text-[#766b60]">
              Velmora brings together furniture, lighting, textiles and
              meaningful objects chosen for their craftsmanship, warmth
              and enduring character.
            </p>
          </div>
        </div>
      </section>

      {/* STORY */}
      <section>
        <div className="mx-auto grid w-full max-w-[1180px] gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:px-10 lg:py-24">
          <div>
            <p className="text-[14px] font-semibold uppercase tracking-[0.25em] text-[#9b8772]">
              Our Philosophy
            </p>

            <h2 className="mt-4 font-serif text-[38px] font-medium leading-[0.95] sm:text-[46px]">
              Spaces that feel
              <span className="block italic font-normal text-[#715f4e]">
                personal and timeless.
              </span>
            </h2>
          </div>

          <div className="space-y-6 text-[16px] leading-7 text-[#766b60]">
            <p>
              We believe the most memorable interiors are not created by
              following trends, but by choosing pieces that feel considered,
              useful and deeply connected to everyday life.
            </p>

            <p>
              Every Velmora collection is shaped around natural materials,
              quiet proportions and objects designed to age beautifully with
              the spaces they inhabit.
            </p>

            <p>
              Our approach is simple: fewer, better pieces that bring comfort,
              character and lasting beauty into the home.
            </p>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="border-y border-[#ded5c9] bg-[#f3eee6]">
        <div className="mx-auto w-full max-w-[1180px] px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
          <div className="grid gap-10 md:grid-cols-3">
            <div>
              <span className="text-[14px] font-semibold uppercase tracking-[0.2em] text-[#9b8772]">
                01
              </span>

              <h3 className="mt-3 font-serif text-[28px] font-medium">
                Thoughtful Design
              </h3>

              <p className="mt-4 text-[15px] leading-6 text-[#766b60]">
                Pieces selected for proportion, functionality and a quiet
                sense of refinement.
              </p>
            </div>

            <div>
              <span className="text-[14px] font-semibold uppercase tracking-[0.2em] text-[#9b8772]">
                02
              </span>

              <h3 className="mt-3 font-serif text-[28px] font-medium">
                Lasting Materials
              </h3>

              <p className="mt-4 text-[15px] leading-6 text-[#766b60]">
                Natural textures and enduring materials chosen to become more
                beautiful with time.
              </p>
            </div>

            <div>
              <span className="text-[14px] font-semibold uppercase tracking-[0.2em] text-[#9b8772]">
                03
              </span>

              <h3 className="mt-3 font-serif text-[28px] font-medium">
                Considered Living
              </h3>

              <p className="mt-4 text-[15px] leading-6 text-[#766b60]">
                A slower approach to interiors built around meaningful objects
                and everyday comfort.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section>
        <div className="mx-auto flex w-full max-w-[1180px] flex-col items-start justify-between gap-8 px-5 py-16 sm:px-8 lg:flex-row lg:items-center lg:px-10 lg:py-20">
          <div>
            <p className="text-[14px] font-semibold uppercase tracking-[0.25em] text-[#9b8772]">
              Explore Velmora
            </p>

            <h2 className="mt-3 font-serif text-[36px] font-medium leading-[0.95] sm:text-[44px]">
              Discover pieces made
              <span className="block italic font-normal text-[#715f4e]">
                for everyday living.
              </span>
            </h2>
          </div>

          <Link
            to="/shop"
            className="group inline-flex min-h-[50px] items-center justify-center gap-3 bg-[#332b24] px-8 text-[14px] font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#514337]"
          >
            Explore Shop

            <FiArrowRight
              size={14}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
      </section>

    </main>
  );
}

export default About;