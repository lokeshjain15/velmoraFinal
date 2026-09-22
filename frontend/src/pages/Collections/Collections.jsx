import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiChevronRight,
} from "react-icons/fi";

const collections = [
  {
    id: "furniture",
    title: "Furniture",
    subtitle: "Considered forms for everyday living",
    category: "Furniture",
  },
  {
    id: "lighting",
    title: "Lighting",
    subtitle: "Warm illumination, thoughtfully designed",
    category: "Lighting",
  },
  {
    id: "decor",
    title: "Decor",
    subtitle: "Objects that give a room its character",
    category: "Decor",
  },
  {
    id: "textiles",
    title: "Textiles",
    subtitle: "Soft layers for quieter spaces",
    category: "Textiles",
  },
  {
    id: "rugs",
    title: "Rugs",
    subtitle: "Texture and warmth underfoot",
    category: "Rugs",
  },
];

function Collections() {
  return (
    <main className="min-h-screen bg-[#faf7ef] text-[#332b24]">

      {/* HERO */}
      <section className="border-b border-[#ded5c9]">
        <div className="mx-auto w-full max-w-[1180px] px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">

          <p className="text-[14px] font-semibold uppercase tracking-[0.3em] text-[#9b8772]">
            Discover Velmora
          </p>

          <div className="mt-5 grid gap-7 lg:grid-cols-[1fr_420px] lg:items-end">

            <h1 className="font-serif text-[52px] font-medium leading-[0.9] tracking-[-0.03em] sm:text-[64px] lg:text-[76px]">
              Curated
              <span className="block italic font-normal text-[#715f4e]">
                Collections
              </span>
            </h1>

            <p className="max-w-[430px] text-[16px] leading-7 text-[#766b60]">
              Explore thoughtfully selected furniture, lighting,
              textiles and objects designed to bring warmth,
              character and timeless elegance into your home.
            </p>

          </div>
        </div>
      </section>

      {/* COLLECTIONS */}
      <section>
        <div className="mx-auto w-full max-w-[1180px] px-5 py-14 sm:px-8 sm:py-16 lg:px-10 lg:py-20">

          <div className="mb-10 flex items-end justify-between border-b border-[#ddd3c6] pb-5">

            <div>
              <p className="text-[14px] font-semibold uppercase tracking-[0.25em] text-[#9b8772]">
                Shop by Category
              </p>

              <h2 className="mt-2 font-serif text-[32px] font-medium sm:text-[38px]">
                Explore Our World
              </h2>
            </div>

            <Link
              to="/shop"
              className="hidden items-center gap-2 text-[14px] font-semibold uppercase tracking-[0.16em] text-[#66584b] transition hover:text-black sm:flex"
            >
              Shop All
              <FiArrowRight />
            </Link>

          </div>

          <div className="grid grid-cols-1 border-t border-[#ddd3c6]">

            {collections.map((collection, index) => (
              <Link
                key={collection.id}
                to={`/shop?category=${collection.category}`}
                className="group grid min-h-[120px] grid-cols-[45px_minmax(0,1fr)_40px] items-center gap-4 border-b border-[#ddd3c6] transition duration-300 hover:bg-[#f3eee6] sm:min-h-[145px] sm:grid-cols-[70px_minmax(0,1fr)_50px] sm:px-4 lg:min-h-[160px]"
              >

                {/* NUMBER */}
                <span className="text-[14px] tracking-[0.18em] text-[#a18e7a]">
                  {String(index + 1).padStart(2, "0")}
                </span>

                {/* TEXT */}
                <div>
                  <p className="text-[14px] font-semibold uppercase tracking-[0.2em] text-[#9b8772]">
                    Collection
                  </p>

                  <h3 className="mt-1 font-serif text-[31px] font-medium leading-none transition duration-300 group-hover:translate-x-2 sm:text-[40px] lg:text-[46px]">
                    {collection.title}
                  </h3>

                  <p className="mt-3 text-[14px] text-[#817468]">
                    {collection.subtitle}
                  </p>
                </div>

                {/* ARROW */}
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d6cabd] transition duration-300 group-hover:border-[#332b24] group-hover:bg-[#332b24] group-hover:text-white sm:h-10 sm:w-10">
                  <FiChevronRight size={15} />
                </div>

              </Link>
            ))}

          </div>

          <Link
            to="/shop"
            className="mt-8 inline-flex items-center gap-2 text-[14px] font-semibold uppercase tracking-[0.16em] text-[#66584b] sm:hidden"
          >
            Shop All
            <FiArrowRight />
          </Link>

        </div>
      </section>


    </main>
  );
}

export default Collections;