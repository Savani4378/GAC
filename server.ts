import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Database Initialization
const db = new Database("agro.db");

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'customer',
    phone TEXT,
    address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    stock INTEGER NOT NULL,
    brand TEXT,
    images TEXT, -- JSON array of image URLs
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS banners (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    description TEXT,
    image_url TEXT NOT NULL,
    link TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    total_amount REAL NOT NULL,
    status TEXT DEFAULT 'pending',
    items TEXT NOT NULL, -- JSON array of items
    shipping_address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);

// Seed Admin User if not exists
const adminExists = db.prepare("SELECT * FROM users WHERE email = ?").get("admin@gangeshwar.com");
if (!adminExists) {
  db.prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)").run(
    "Admin",
    "admin@gangeshwar.com",
    "admin123",
    "admin"
  );
}

// Seed Products if not exists
const productsExist = db.prepare("SELECT COUNT(*) as count FROM products").get().count;
if (productsExist === 0) {
  const seedProducts = [
    { name: "Hybrid Corn Seeds", category: "Seeds", description: "High-yield yellow corn seeds for summer season.", price: 450, stock: 100, brand: "Monsanto", images: ["https://picsum.photos/seed/corn/600/600"] },
    { name: "Organic Wheat Seeds", category: "Seeds", description: "Premium quality organic wheat seeds for winter.", price: 320, stock: 150, brand: "Syngenta", images: ["https://picsum.photos/seed/wheat/600/600"] },
    { name: "Urea Fertilizer", category: "Fertilizers", description: "Nitrogen-rich fertilizer for fast plant growth.", price: 800, stock: 50, brand: "IFFCO", images: ["https://picsum.photos/seed/urea/600/600"] },
    { name: "DAP Fertilizer", category: "Fertilizers", description: "Phosphorus-rich fertilizer for root development.", price: 1200, stock: 40, brand: "IFFCO", images: ["https://picsum.photos/seed/dap/600/600"] },
    { name: "Neem Oil Pesticide", category: "Pesticides", description: "Natural pest control for organic farming.", price: 250, stock: 80, brand: "AgroCare", images: ["https://picsum.photos/seed/neem/600/600"] },
    { name: "Glyphosate Herbicide", category: "Pesticides", description: "Effective weed control for large fields.", price: 600, stock: 30, brand: "Bayer", images: ["https://picsum.photos/seed/weed/600/600"] },
  ];

  const insertProduct = db.prepare(`
    INSERT INTO products (name, category, description, price, stock, brand, images)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  seedProducts.forEach(p => {
    insertProduct.run(p.name, p.category, p.description, p.price, p.stock, p.brand, JSON.stringify(p.images));
  });
}

// Seed Banners if not exists
const bannersExist = db.prepare("SELECT COUNT(*) as count FROM banners").get().count;
if (bannersExist === 0) {
  const seedBanners = [
    { title: "Bumper Harvest Sale!", description: "Get up to 30% off on all hybrid seeds this week.", image_url: "https://picsum.photos/seed/farm1/1920/1080", link: "/products/Seeds" },
    { title: "Protect Your Crops", description: "New range of organic pesticides available now.", image_url: "https://picsum.photos/seed/farm2/1920/1080", link: "/products/Pesticides" },
  ];

  const insertBanner = db.prepare(`
    INSERT INTO banners (title, description, image_url, link)
    VALUES (?, ?, ?, ?)
  `);

  seedBanners.forEach(b => {
    insertBanner.run(b.title, b.description, b.image_url, b.link);
  });
}

// API Routes
// Auth
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  const user = db.prepare("SELECT * FROM users WHERE email = ? AND password = ?").get(email, password);
  if (user) {
    const { password, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

app.post("/api/auth/register", (req, res) => {
  const { name, email, password, phone, address } = req.body;
  try {
    const result = db.prepare("INSERT INTO users (name, email, password, phone, address) VALUES (?, ?, ?, ?, ?)").run(
      name, email, password, phone, address
    );
    res.json({ id: result.lastInsertRowid });
  } catch (e) {
    res.status(400).json({ error: "Email already exists" });
  }
});

// Products
app.get("/api/products", (req, res) => {
  const products = db.prepare("SELECT * FROM products").all();
  res.json(products.map(p => ({ ...p, images: JSON.parse(p.images || '[]') })));
});

app.post("/api/products", (req, res) => {
  const { name, category, description, price, stock, brand, images, status } = req.body;
  const result = db.prepare(`
    INSERT INTO products (name, category, description, price, stock, brand, images, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(name, category, description, price, stock, brand, JSON.stringify(images || []), status || 'active');
  res.json({ id: result.lastInsertRowid });
});

app.put("/api/products/:id", (req, res) => {
  const { name, category, description, price, stock, brand, images, status } = req.body;
  db.prepare(`
    UPDATE products SET name = ?, category = ?, description = ?, price = ?, stock = ?, brand = ?, images = ?, status = ?
    WHERE id = ?
  `).run(name, category, description, price, stock, brand, JSON.stringify(images || []), status, req.params.id);
  res.json({ success: true });
});

app.delete("/api/products/:id", (req, res) => {
  db.prepare("DELETE FROM products WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

// Banners
app.get("/api/banners", (req, res) => {
  const banners = db.prepare("SELECT * FROM banners").all();
  res.json(banners);
});

app.post("/api/banners", (req, res) => {
  const { title, description, image_url, link } = req.body;
  const result = db.prepare("INSERT INTO banners (title, description, image_url, link) VALUES (?, ?, ?, ?)").run(
    title, description, image_url, link
  );
  res.json({ id: result.lastInsertRowid });
});

app.delete("/api/banners/:id", (req, res) => {
  db.prepare("DELETE FROM banners WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

// Orders
app.get("/api/orders", (req, res) => {
  const orders = db.prepare(`
    SELECT orders.*, users.name as user_name, users.email as user_email
    FROM orders
    JOIN users ON orders.user_id = users.id
  `).all();
  res.json(orders.map(o => ({ ...o, items: JSON.parse(o.items) })));
});

app.post("/api/orders", (req, res) => {
  const { user_id, total_amount, items, shipping_address } = req.body;
  const result = db.prepare(`
    INSERT INTO orders (user_id, total_amount, items, shipping_address)
    VALUES (?, ?, ?, ?)
  `).run(user_id, total_amount, JSON.stringify(items), shipping_address);
  res.json({ id: result.lastInsertRowid });
});

app.put("/api/orders/:id", (req, res) => {
  const { status } = req.body;
  db.prepare("UPDATE orders SET status = ? WHERE id = ?").run(status, req.params.id);
  res.json({ success: true });
});

// Customers
app.get("/api/customers", (req, res) => {
  const customers = db.prepare("SELECT * FROM users WHERE role = 'customer'").all();
  res.json(customers);
});

// Vite Middleware for Development
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
