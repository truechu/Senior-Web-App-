import express from "express";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dbPath = path.join(__dirname, "db.json");
const app = express();

app.use(express.json());

async function readDb() {
  const data = await fs.readFile(dbPath, "utf-8");
  return JSON.parse(data);
}

async function writeDb(db) {
  await fs.writeFile(dbPath, JSON.stringify(db, null, 2));
}

function money(value) {
  return Number(value.toFixed(2));
}

function buildCart(db) {
  const items = db.cart
    .map((entry) => {
      const product = db.products.find((item) => item.id === entry.productId);
      if (!product) {
        return null;
      }

      return {
        ...product,
        quantity: entry.quantity,
        lineTotal: money(product.price * entry.quantity)
      };
    })
    .filter(Boolean);

  const subtotal = money(items.reduce((sum, item) => sum + item.lineTotal, 0));
  const tax = money(subtotal * 0.08);
  const shipping = subtotal === 0 || subtotal >= 50 ? 0 : 4.99;

  return {
    items,
    totalQuantity: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal,
    tax,
    shipping: money(shipping),
    total: money(subtotal + tax + shipping)
  };
}

app.get("/api/products", async (req, res) => {
  const db = await readDb();
  const search = String(req.query.search || "").trim().toLowerCase();
  const category = String(req.query.category || "").trim().toLowerCase();

  let products = db.products;

  if (search) {
    products = products.filter((product) =>
        [product.name, product.category, product.description]
          .join(" ")
          .toLowerCase()
          .includes(search)
      );
  }

  if (category && category !== "all") {
    products = products.filter((product) => product.category.toLowerCase() === category);
  }

  res.json(products);
});

app.get("/api/products/:id", async (req, res) => {
  const db = await readDb();
  const id = Number(req.params.id);
  const product = db.products.find((item) => item.id === id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json(product);
});

app.get("/api/cart", async (_req, res) => {
  const db = await readDb();
  res.json(buildCart(db));
});

app.post("/api/cart", async (req, res) => {
  const db = await readDb();
  const productId = Number(req.body.productId);
  const quantity = Math.max(1, Number(req.body.quantity) || 1);
  const product = db.products.find((item) => item.id === productId);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  const existing = db.cart.find((item) => item.productId === productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    db.cart.push({ productId, quantity });
  }

  await writeDb(db);
  res.status(201).json(buildCart(db));
});

app.patch("/api/cart/:productId", async (req, res) => {
  const db = await readDb();
  const productId = Number(req.params.productId);
  const quantity = Number(req.body.quantity);

  if (!Number.isInteger(quantity)) {
    return res.status(400).json({ message: "Quantity must be a whole number" });
  }

  const item = db.cart.find((entry) => entry.productId === productId);
  if (!item) {
    return res.status(404).json({ message: "Cart item not found" });
  }

  if (quantity <= 0) {
    db.cart = db.cart.filter((entry) => entry.productId !== productId);
  } else {
    item.quantity = quantity;
  }

  await writeDb(db);
  res.json(buildCart(db));
});

app.delete("/api/cart", async (_req, res) => {
  const db = await readDb();
  db.cart = [];

  await writeDb(db);
  res.json(buildCart(db));
});

app.delete("/api/cart/:productId", async (req, res) => {
  const db = await readDb();
  const productId = Number(req.params.productId);
  db.cart = db.cart.filter((entry) => entry.productId !== productId);

  await writeDb(db);
  res.json(buildCart(db));
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(root, "dist")));
  app.use((_req, res) => {
    res.sendFile(path.join(root, "dist", "index.html"));
  });
} else {
  const { createServer: createViteServer } = await import("vite");
  const vite = await createViteServer({
    root,
    appType: "custom",
    server: { middlewareMode: true }
  });

  app.use(vite.middlewares);
  app.use(async (req, res, next) => {
    try {
      const templatePath = path.join(root, "index.html");
      let template = await fs.readFile(templatePath, "utf-8");
      template = await vite.transformIndexHtml(req.originalUrl, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(template);
    } catch (error) {
      vite.ssrFixStacktrace(error);
      next(error);
    }
  });
}

const basePort = Number(process.env.PORT) || 3000;

function listen(port) {
  const server = app.listen(port, () => {
    console.log(`Campus Cart running at http://localhost:${port}`);
  });

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE" && !process.env.PORT && port < basePort + 10) {
      listen(port + 1);
      return;
    }

    console.error(error);
    process.exit(1);
  });
}

listen(basePort);
