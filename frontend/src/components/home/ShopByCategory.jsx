import { Link } from "react-router-dom";

import furnitureImg from "../../assets/images/categories/furniture.jpg";
import lightingImg from "../../assets/images/categories/lighting.jpg";
import textilesImg from "../../assets/images/categories/textiles.jpg";
import decorImg from "../../assets/images/categories/decor.jpg";
import rugsImg from "../../assets/images/categories/rugs.jpg";

import "./home-sections.css";

const categories = [
  {
    name: "Furniture",
    label: "Featured Category",
    image: furnitureImg,
    path: "/shop?category=furniture",
    featured: true,
  },
  {
    name: "Lighting",
    label: "Explore",
    image: lightingImg,
    path: "/shop?category=lighting",
  },
  {
    name: "Decor",
    label: "Explore",
    image: decorImg,
    path: "/shop?category=decor",
  },
  {
    name: "Textiles",
    label: "Explore",
    image: textilesImg,
    path: "/shop?category=textiles",
  },
  {
    name: "Rugs",
    label: "Explore",
    image: rugsImg,
    path: "/shop?category=rugs",
  },
];

function CategoryCard({ category, className = "" }) {
  return (
    <Link
      to={category.path}
      className={`vel-category-card ${className}`}
    >
      <img
        src={category.image}
        alt={category.name}
        className="vel-category-image"
      />

      <div className="vel-category-shade" />

      <div className="vel-category-copy">
        <span>{category.label}</span>
        <h3>{category.name}</h3>
      </div>
    </Link>
  );
}

function ShopByCategory() {
  return (
    <section className="vel-category-section">
      <div className="vel-home-container">

        <header className="vel-category-intro">
          <p className="vel-eyebrow">
            Discover Velmora
          </p>

          <h2>
            Curated Spaces,
            <em>Made to Feel Like Home</em>
          </h2>

          <div className="vel-ornament">
            <span />
            <i />
            <span />
          </div>

          <p className="vel-category-description">
            Thoughtfully selected pieces that bring warmth, character, and
            timeless elegance into every corner of your home.
          </p>
        </header>

        <div className="vel-category-grid">
          <CategoryCard
            category={categories[0]}
            className="vel-category-featured"
          />

          <CategoryCard category={categories[1]} />
          <CategoryCard category={categories[2]} />
          <CategoryCard category={categories[3]} />
          <CategoryCard category={categories[4]} />
        </div>

      </div>
    </section>
  );
}

export default ShopByCategory;