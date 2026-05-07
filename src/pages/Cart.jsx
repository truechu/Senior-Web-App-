import { CheckCircle2, Minus, Plus, RotateCcw, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

function Cart({ cart, onUpdateQuantity, onRemoveItem, onResetCart }) {
  const [showOrderModal, setShowOrderModal] = useState(false);
  const hasItems = cart.items.length > 0;
  const tax = cart.tax ?? Number((cart.subtotal * 0.08).toFixed(2));
  const shipping = cart.shipping ?? (cart.subtotal === 0 || cart.subtotal >= 50 ? 0 : 4.99);
  const total = cart.total ?? Number((cart.subtotal + tax + shipping).toFixed(2));

  return (
    <section className="container section-block">
      <div className="cart-header">
        <div>
          <p className="section-label">Shopping cart</p>
          <h1>Your Cart</h1>
        </div>
        <div className="cart-actions">
          {hasItems && (
            <button className="btn btn-outline-danger" type="button" onClick={onResetCart}>
              <RotateCcw size={17} />
              Reset cart
            </button>
          )}
          <Link className="btn btn-outline-secondary" to="/">
            Keep shopping
          </Link>
        </div>
      </div>

      {!hasItems && (
        <div className="empty-cart">
          <h2>Your cart is empty.</h2>
          <p>Add an item from the home page to see it here.</p>
          <Link className="btn btn-warning" to="/">
            Browse products
          </Link>
        </div>
      )}

      {hasItems && (
        <div className="cart-layout">
          <div className="cart-items">
            {cart.items.map((item) => (
              <article className="cart-item" key={item.id}>
                <img src={item.image} alt={item.name} className="cart-item-image" />
                <div className="cart-item-info">
                  <p className="product-category">{item.category}</p>
                  <h2>{item.name}</h2>
                  <p>${item.price.toFixed(2)} each</p>
                </div>
                <div className="cart-controls" aria-label={`Quantity for ${item.name}`}>
                  <button
                    className="icon-button"
                    type="button"
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    aria-label={`Decrease ${item.name} quantity`}
                    title="Decrease quantity"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="quantity-number">{item.quantity}</span>
                  <button
                    className="icon-button"
                    type="button"
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    aria-label={`Increase ${item.name} quantity`}
                    title="Increase quantity"
                  >
                    <Plus size={18} />
                  </button>
                </div>
                <div className="cart-line-total">${item.lineTotal.toFixed(2)}</div>
                <button
                  className="icon-button trash-button"
                  type="button"
                  onClick={() => onRemoveItem(item.id)}
                  aria-label={`Remove ${item.name}`}
                  title="Remove item"
                >
                  <Trash2 size={19} />
                </button>
              </article>
            ))}
          </div>

          <aside className="cart-summary">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Items</span>
              <span>{cart.totalQuantity}</span>
            </div>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${cart.subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Estimated tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className="summary-row summary-total">
              <span>Estimated total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <button
              className="btn btn-warning w-100"
              type="button"
              onClick={() => setShowOrderModal(true)}
            >
              Checkout
            </button>
          </aside>
        </div>
      )}

      {showOrderModal && (
        <>
          <div className="modal-backdrop-custom" onClick={() => setShowOrderModal(false)}></div>
          <div className="order-modal" role="dialog" aria-modal="true" aria-labelledby="order-title">
            <CheckCircle2 size={44} />
            <h2 id="order-title">Order placed!</h2>
            <p>Your order was submitted successfully.</p>
            <button className="btn btn-warning" type="button" onClick={() => setShowOrderModal(false)}>
              Close
            </button>
          </div>
        </>
      )}
    </section>
  );
}

export default Cart;

