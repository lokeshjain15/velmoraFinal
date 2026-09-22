import Hero from "../../components/home/Hero";
import ShopByCategory from "../../components/home/ShopByCategory";
import FeaturedCollection from "../../components/home/FeaturedCollection";

function Home() {
  return (
    <main className="w-full overflow-x-hidden bg-[#fbf8f3]">
      <Hero />
      <ShopByCategory />
      <FeaturedCollection />
    </main>
  );
}

export default Home;