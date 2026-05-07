import { Link } from "react-router-dom";

function ProductCard({ product, onAddToCart }) {
  return (
    <article className="product-card">
      <Link to={`/products/${product.id}`} className="product-image-link" aria-label={product.name}>
        <img src={product.image} alt={product.name} className="product-image" />
      </Link>
      <div className="product-card-body">
        <p className="product-category">{product.category}</p>
        <h3 className="product-title">
          <Link to={`/products/${product.id}`}>{product.name}</Link>
        </h3>
        <p className="product-description">{product.description}</p>
        <div className="product-meta">
          <span className="product-price">${product.price.toFixed(2)}</span>
          <span className="product-rating">{product.rating} stars</span>
        </div>
        <button className="btn btn-warning w-100" type="button" onClick={() => onAddToCart(product.id)}>
          Add to Cart
        </button>
      </div>
    </article>
  );
}

export default ProductCard;

