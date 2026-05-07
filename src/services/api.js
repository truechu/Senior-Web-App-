async function request(path, options = {}) {
  const response = await fetch(path, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    },
    ...options
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

export function getProducts(search = "", category = "All") {
  const params = new URLSearchParams();

  if (search) {
    params.set("search", search);
  }

  if (category && category !== "All") {
    params.set("category", category);
  }

  const query = params.toString() ? `?${params.toString()}` : "";
  return request(`/api/products${query}`);
}

export function getProduct(id) {
  return request(`/api/products/${id}`);
}

export function getCart() {
  return request("/api/cart");
}

export function addToCart(productId, quantity = 1) {
  return request("/api/cart", {
    method: "POST",
    body: JSON.stringify({ productId, quantity })
  });
}

export function updateCartItem(productId, quantity) {
  return request(`/api/cart/${productId}`, {
    method: "PATCH",
    body: JSON.stringify({ quantity })
  });
}

export function removeFromCart(productId) {
  return request(`/api/cart/${productId}`, {
    method: "DELETE"
  });
}

export function resetCart() {
  return request("/api/cart", {
    method: "DELETE"
  });
}
