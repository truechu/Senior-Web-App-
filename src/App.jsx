import { useCallback, useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import NavBar from "./components/NavBar.jsx";
import Home from "./pages/Home.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import Cart from "./pages/Cart.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import NotFound from "./pages/NotFound.jsx";
import { addToCart, getCart, removeFromCart, resetCart, updateCartItem } from "./services/api.js";

const emptyCart = {
  items: [],
  totalQuantity: 0,
  subtotal: 0,
  tax: 0,
  shipping: 0,
  total: 0
};

function App() {
  const [cart, setCart] = useState(emptyCart);
  const [cartError, setCartError] = useState("");
  const navigate = useNavigate();

  const refreshCart = useCallback(async () => {
    try {
      const cartData = await getCart();
      setCart(cartData);
      setCartError("");
    } catch (error) {
      setCartError(error.message);
    }
  }, []);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  async function handleAddToCart(productId) {
    const updatedCart = await addToCart(productId);
    setCart(updatedCart);
    navigate("/cart");
  }

  async function handleUpdateQuantity(productId, quantity) {
    const updatedCart = await updateCartItem(productId, quantity);
    setCart(updatedCart);
  }

  async function handleRemoveItem(productId) {
    const updatedCart = await removeFromCart(productId);
    setCart(updatedCart);
  }

  async function handleResetCart() {
    const updatedCart = await resetCart();
    setCart(updatedCart);
  }

  return (
    <div className="app-shell">
      <NavBar cartCount={cart.totalQuantity} />
      {cartError && <div className="alert alert-warning rounded-0 mb-0">{cartError}</div>}
      <main>
        <Routes>
          <Route path="/" element={<Home onAddToCart={handleAddToCart} />} />
          <Route
            path="/products/:id"
            element={<ProductDetail onAddToCart={handleAddToCart} />}
          />
          <Route
            path="/cart"
            element={
              <Cart
                cart={cart}
                onRefresh={refreshCart}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
                onResetCart={handleResetCart}
              />
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer className="site-footer">
        <span>Campus Cart</span>
        <span>Small e-commerce project built with React, Bootstrap, Node, and JSON data.</span>
      </footer>
    </div>
  );
}

export default App;
