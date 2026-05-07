import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import { getProducts } from "../services/api.js";

const categories = ["All", "Electronics", "Dorm Room", "School Supplies", "Campus Gear"];

function Home({ onAddToCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "All";
  const bestSellers = products.filter((product) => product.bestSeller);
  const productHeading = search
    ? `Search results for "${search}"`
    : category !== "All"
      ? category
      : "Shop Products";

  function getCategoryLink(nextCategory) {
    const nextParams = new URLSearchParams(searchParams);

    if (nextCategory === "All") {
      nextParams.delete("category");
    } else {
      nextParams.set("category", nextCategory);
    }

    const query = nextParams.toString();
    return query ? `/?${query}` : "/";
  }

  useEffect(() => {
    let ignore = false;

    async function loadProducts() {
      setLoading(true);
      setError("");

      try {
        const productData = await getProducts(search, category);
        if (!ignore) {
          setProducts(productData);
        }
      } catch (apiError) {
        if (!ignore) {
          setError(apiError.message);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      ignore = true;
    };
  }, [search, category]);

  return (
    <>
      <section className="hero-strip">
        <div className="container">
          <div id="homeCarousel" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-inner">
              <div className="carousel-item active" data-bs-interval="3500">
                <div className="hero-slide hero-slide-one">
                  <div>
                    <p className="hero-eyebrow">Simple deals for campus life</p>
                    <h1>Campus Cart</h1>
                    <p>Shop school supplies, dorm basics, and small electronics from one clean page.</p>
                  </div>
                </div>
              </div>
              <div className="carousel-item" data-bs-interval="3500">
                <div className="hero-slide hero-slide-two">
                  <div>
                    <p className="hero-eyebrow">Best seller picks</p>
                    <h2>Study gear that students actually use</h2>
                    <p>Headphones, notebooks, bags, and desk items are ready to add to your cart.</p>
                  </div>
                </div>
              </div>
              <div className="carousel-item" data-bs-interval="3500">
                <div className="hero-slide hero-slide-three">
                  <div>
                    <p className="hero-eyebrow">Persistent cart</p>
                    <h2>Your cart stays saved after refresh</h2>
                    <p>The cart is stored by the Node backend in a JSON database file.</p>
                  </div>
                </div>
              </div>
            </div>
            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#homeCarousel"
              data-bs-slide="prev"
              aria-label="Previous slide"
            >
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#homeCarousel"
              data-bs-slide="next"
              aria-label="Next slide"
            >
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
            </button>
          </div>
        </div>
      </section>

      <section className="container category-section">
        <div className="category-filter-bar" aria-label="Product categories">
          {categories.map((item) => (
            <Link
              className={`category-filter ${category === item ? "active" : ""}`}
              key={item}
              to={getCategoryLink(item)}
              aria-current={category === item ? "page" : undefined}
            >
              {item}
            </Link>
          ))}
        </div>
      </section>

      <section className="container section-block" id="best-sellers">
        <div className="section-heading">
          <div>
            <p className="section-label">Popular now</p>
            <h2>Best Sellers</h2>
          </div>
          <span className="results-count">{bestSellers.length} items</span>
        </div>
        <div className="product-grid">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
          ))}
        </div>
      </section>

      <section className="container section-block">
        <div className="section-heading">
          <div>
            <p className="section-label">All products</p>
            <h2>{productHeading}</h2>
          </div>
          <span className="results-count">{products.length} items</span>
        </div>

        {loading && <div className="status-message">Loading products...</div>}
        {error && <div className="alert alert-danger">{error}</div>}
        {!loading && !error && products.length === 0 && (
          <div className="status-message">No products matched your search.</div>
        )}
        {!loading && !error && products.length > 0 && (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

export default Home;
