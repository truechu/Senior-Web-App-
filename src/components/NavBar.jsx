import { ShoppingCart, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate, useSearchParams } from "react-router-dom";

function NavBar({ cartCount }) {
  const [searchParams] = useSearchParams();
  const [searchText, setSearchText] = useState(searchParams.get("search") || "");
  const navigate = useNavigate();

  useEffect(() => {
    setSearchText(searchParams.get("search") || "");
  }, [searchParams]);

  function handleSubmit(event) {
    event.preventDefault();
    const cleanSearch = searchText.trim();
    navigate(cleanSearch ? `/?search=${encodeURIComponent(cleanSearch)}` : "/");
  }

  return (
    <header className="main-header">
      <nav className="navbar navbar-expand-lg navbar-dark">
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/">
            Campus Cart
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNavbar"
            aria-controls="mainNavbar"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse gap-3" id="mainNavbar">
            <form className="search-form flex-grow-1" onSubmit={handleSubmit}>
              <input
                className="form-control"
                type="search"
                placeholder="Search products"
                aria-label="Search products"
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
              />
              <button className="btn btn-warning search-button" type="submit" aria-label="Search">
                <Search size={18} />
              </button>
            </form>

            <div className="navbar-nav align-items-lg-center gap-lg-2">
              <NavLink className="nav-link" to="/">
                Home
              </NavLink>
              <a className="nav-link" href="/#best-sellers">
                Best Sellers
              </a>
              <NavLink className="nav-link" to="/about">
                About
              </NavLink>
              <NavLink className="nav-link" to="/contact">
                Contact
              </NavLink>
              <NavLink className="nav-link cart-link" to="/cart">
                <ShoppingCart size={20} />
                <span>Cart</span>
                <span className="cart-badge">{cartCount}</span>
              </NavLink>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default NavBar;
