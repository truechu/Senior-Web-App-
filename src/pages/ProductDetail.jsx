import { ArrowLeft, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProduct } from "../services/api.js";

function ProductDetail({ onAddToCart }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadProduct() {
      setLoading(true);
      setError("");

      try {
        const productData = await getProduct(id);
        if (!ignore) {
          setProduct(productData);
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

    loadProduct();

    return () => {
      ignore = true;
    };
  }, [id]);

  if (loading) {
    return <div className="container status-message">Loading product...</div>;
  }

  if (error || !product) {
    return (
      <div className="container section-block">
        <div className="alert alert-danger">{error || "Product not found"}</div>
        <Link className="btn btn-outline-secondary" to="/">
          Back to products
        </Link>
      </div>
    );
  }

  return (
    <section className="container section-block">
      <Link className="back-link" to="/">
        <ArrowLeft size={18} />
        Back to products
      </Link>

      <div className="detail-layout">
        <div className="detail-image-panel">
          <img src={product.image} alt={product.name} className="detail-image" />
        </div>

        <div className="detail-info">
          <p className="product-category">{product.category}</p>
          <h1>{product.name}</h1>
          <p className="detail-description">{product.description}</p>
          <div className="detail-rating">{product.rating} out of 5 stars</div>
          <span className="stock-badge">In stock</span>
          <div className="detail-price">${product.price.toFixed(2)}</div>

          <button
            className="btn btn-warning btn-lg add-detail-button"
            type="button"
            onClick={() => onAddToCart(product.id)}
          >
            <ShoppingCart size={20} />
            Add to Cart
          </button>

          <div className="detail-list">
            <h2>Product Details</h2>
            <ul>
              {product.details.map((detail) => (
                <li key={detail}>{detail}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductDetail;
