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
app.use(express.static(path.join(__dirname, "public")));

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

  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS subcategories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    UNIQUE(category_id, name)
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT, -- Kept for migration compatibility
    category_id INTEGER,
    subcategory_id INTEGER,
    description TEXT,
    price REAL NOT NULL,
    stock INTEGER NOT NULL,
    brand TEXT,
    images TEXT, -- JSON array of image URLs
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (subcategory_id) REFERENCES subcategories(id)
  );

  CREATE TABLE IF NOT EXISTS banners (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    description TEXT,
    image_url TEXT NOT NULL,
    link TEXT,
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS visitors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT DEFAULT 'Guest',
    location TEXT,
    ip_address TEXT,
    user_agent TEXT,
    visited_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER,
    user_id INTEGER,
    rating INTEGER NOT NULL,
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS wishlist (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    note TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
  );

  CREATE TABLE IF NOT EXISTS about_content (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS contact_info (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    address TEXT,
    phone TEXT,
    email TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS social_links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    facebook TEXT,
    facebook_visible INTEGER DEFAULT 1,
    instagram TEXT,
    instagram_visible INTEGER DEFAULT 1,
    twitter TEXT,
    twitter_visible INTEGER DEFAULT 1,
    whatsapp TEXT,
    whatsapp_visible INTEGER DEFAULT 1,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Add columns if they don't exist (for existing databases)
try { db.prepare("ALTER TABLE social_links ADD COLUMN facebook_visible INTEGER DEFAULT 1").run(); } catch(e) {}
try { db.prepare("ALTER TABLE social_links ADD COLUMN instagram_visible INTEGER DEFAULT 1").run(); } catch(e) {}
try { db.prepare("ALTER TABLE social_links ADD COLUMN twitter_visible INTEGER DEFAULT 1").run(); } catch(e) {}
try { db.prepare("ALTER TABLE social_links ADD COLUMN whatsapp_visible INTEGER DEFAULT 1").run(); } catch(e) {}

try { db.prepare("ALTER TABLE products ADD COLUMN category_id INTEGER").run(); } catch(e) {}
try { db.prepare("ALTER TABLE products ADD COLUMN subcategory_id INTEGER").run(); } catch(e) {}

// Migrate old category string to category_id if needed
const categoriesExist = db.prepare("SELECT COUNT(*) as count FROM categories").get().count;
if (categoriesExist === 0) {
  const defaultCategories = ["Seeds", "Fertilizers", "Pesticides"];
  const insertCat = db.prepare("INSERT INTO categories (name) VALUES (?)");
  defaultCategories.forEach(cat => insertCat.run(cat));
  
  // Seed subcategories
  const seedsId = db.prepare("SELECT id FROM categories WHERE name = 'Seeds'").get().id;
  const fertId = db.prepare("SELECT id FROM categories WHERE name = 'Fertilizers'").get().id;
  const pestId = db.prepare("SELECT id FROM categories WHERE name = 'Pesticides'").get().id;
  
  const insertSub = db.prepare("INSERT INTO subcategories (category_id, name) VALUES (?, ?)");
  ["Vegetable Seeds", "Fruit Seeds", "Cereal Seeds"].forEach(s => insertSub.run(seedsId, s));
  ["Organic Fertilizers", "Chemical Fertilizers", "Liquid Fertilizers"].forEach(s => insertSub.run(fertId, s));
  ["Insecticides", "Herbicides", "Fungicides"].forEach(s => insertSub.run(pestId, s));
  
  // Update existing products to link to categories
  const products = db.prepare("SELECT id, category FROM products").all();
  products.forEach(p => {
    const cat = db.prepare("SELECT id FROM categories WHERE name = ?").get(p.category);
    if (cat) {
      db.prepare("UPDATE products SET category_id = ? WHERE id = ?").run(cat.id, p.id);
    }
  });
}

// Seed About and Contact if not exists
const aboutExists = db.prepare("SELECT COUNT(*) as count FROM about_content").get().count;
if (aboutExists === 0) {
  db.prepare("INSERT INTO about_content (content) VALUES (?)").run(
    "Your trusted partner in agriculture. Providing high-quality seeds, fertilizers, and pesticides to farmers across the region. We are dedicated to improving crop yields and supporting sustainable farming practices."
  );
}

const contactExists = db.prepare("SELECT COUNT(*) as count FROM contact_info").get().count;
if (contactExists === 0) {
  db.prepare("INSERT INTO contact_info (address, phone, email) VALUES (?, ?, ?)").run(
    "Gangeshwar Agro Center, New Market Yard, Modi Nagar, Palanpur, Gujarat 385001",
    "+91 97129 99082 | +91 99254 57719",
    "gangeshwaragrocenter@gmail.com"
  );
}

const socialExists = db.prepare("SELECT COUNT(*) as count FROM social_links").get().count;
if (socialExists === 0) {
  db.prepare("INSERT INTO social_links (facebook, instagram, twitter, whatsapp) VALUES (?, ?, ?, ?)").run(
    "https://facebook.com",
    "https://instagram.com",
    "https://twitter.com",
    "+919712999082"
  );
}

// Seed Admin User if not exists
const adminExists = db.prepare("SELECT * FROM users WHERE email = ?").get("gangeshwaragrocenter@gmail.com");
if (!adminExists) {
  db.prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)").run(
    "Admin",
    "gangeshwaragrocenter@gmail.com",
    "admin123",
    "admin"
  );
}

// Seed Visitors if not exists
const visitorsExist = db.prepare("SELECT COUNT(*) as count FROM visitors").get().count;
if (visitorsExist === 0) {
  const seedVisitors = [
    { name: "Guest 1", location: "Ahmedabad", ip_address: "192.168.1.1", user_agent: "Mozilla/5.0", visited_at: "2026-03-01 10:00:00" },
    { name: "Guest 2", location: "Surat", ip_address: "192.168.1.2", user_agent: "Mozilla/5.0", visited_at: "2026-03-02 11:00:00" },
    { name: "Guest 3", location: "Ahmedabad", ip_address: "192.168.1.3", user_agent: "Mozilla/5.0", visited_at: "2026-03-03 12:00:00" },
    { name: "Guest 4", location: "Palanpur", ip_address: "192.168.1.4", user_agent: "Mozilla/5.0", visited_at: "2026-03-04 13:00:00" },
    { name: "Guest 5", location: "Ahmedabad", ip_address: "192.168.1.5", user_agent: "Mozilla/5.0", visited_at: "2026-03-05 14:00:00" },
    { name: "Guest 6", location: "Rajkot", ip_address: "192.168.1.6", user_agent: "Mozilla/5.0", visited_at: "2026-03-06 15:00:00" },
    { name: "Guest 7", location: "Surat", ip_address: "192.168.1.7", user_agent: "Mozilla/5.0", visited_at: "2026-03-07 16:00:00" },
    { name: "Guest 8", location: "Ahmedabad", ip_address: "192.168.1.8", user_agent: "Mozilla/5.0", visited_at: "2026-03-08 17:00:00" },
    { name: "Guest 9", location: "Mehsana", ip_address: "192.168.1.9", user_agent: "Mozilla/5.0", visited_at: "2026-03-08 18:00:00" },
    { name: "Guest 10", location: "Ahmedabad", ip_address: "192.168.1.10", user_agent: "Mozilla/5.0", visited_at: "2026-03-08 19:00:00" },
  ];

  const insertVisitor = db.prepare(`
    INSERT INTO visitors (name, location, ip_address, user_agent, visited_at)
    VALUES (?, ?, ?, ?, ?)
  `);

  seedVisitors.forEach(v => {
    insertVisitor.run(v.name, v.location, v.ip_address, v.user_agent, v.visited_at);
  });
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
    INSERT INTO products (name, category_id, description, price, stock, brand, images)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  seedProducts.forEach(p => {
    const cat = db.prepare("SELECT id FROM categories WHERE name = ?").get(p.category);
    insertProduct.run(p.name, cat ? cat.id : null, p.description, p.price, p.stock, p.brand, JSON.stringify(p.images));
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
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

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

app.post("/api/auth/forgot-password", (req, res) => {
  const { email } = req.body;
  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
  if (user) {
    // In a real app, send email with token. Here we just return success.
    res.json({ message: "Reset link sent to your email (simulated)" });
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

app.post("/api/auth/reset-password", (req, res) => {
  const { email, newPassword } = req.body;
  const result = db.prepare("UPDATE users SET password = ? WHERE email = ?").run(newPassword, email);
  if (result.changes > 0) {
    res.json({ message: "Password updated successfully" });
  } else {
    res.status(404).json({ error: "User not found" });
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
  const products = db.prepare(`
    SELECT products.*, categories.name as category_name, subcategories.name as subcategory_name
    FROM products
    LEFT JOIN categories ON products.category_id = categories.id
    LEFT JOIN subcategories ON products.subcategory_id = subcategories.id
  `).all();
  res.json(products.map(p => ({ ...p, images: JSON.parse(p.images || '[]') })));
});

app.post("/api/products", (req, res) => {
  const { name, category_id, subcategory_id, description, price, stock, brand, images, status } = req.body;
  const result = db.prepare(`
    INSERT INTO products (name, category_id, subcategory_id, description, price, stock, brand, images, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(name, category_id, subcategory_id, description, price, stock, brand, JSON.stringify(images || []), status || 'active');
  res.json({ id: result.lastInsertRowid });
});

app.put("/api/products/:id", (req, res) => {
  const { name, category_id, subcategory_id, description, price, stock, brand, images, status } = req.body;
  db.prepare(`
    UPDATE products SET name = ?, category_id = ?, subcategory_id = ?, description = ?, price = ?, stock = ?, brand = ?, images = ?, status = ?
    WHERE id = ?
  `).run(name, category_id, subcategory_id, description, price, stock, brand, JSON.stringify(images || []), status, req.params.id);
  res.json({ success: true });
});

app.delete("/api/products/:id", (req, res) => {
  db.prepare("DELETE FROM products WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

// Categories
app.get("/api/categories", (req, res) => {
  const categories = db.prepare("SELECT * FROM categories").all();
  res.json(categories);
});

app.post("/api/categories", (req, res) => {
  const { name } = req.body;
  try {
    const result = db.prepare("INSERT INTO categories (name) VALUES (?)").run(name);
    res.json({ id: result.lastInsertRowid });
  } catch (e) {
    res.status(400).json({ error: "Category already exists" });
  }
});

app.put("/api/categories/:id", (req, res) => {
  const { name } = req.body;
  try {
    db.prepare("UPDATE categories SET name = ? WHERE id = ?").run(name, req.params.id);
    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ error: "Category name already exists" });
  }
});

app.delete("/api/categories/:id", (req, res) => {
  db.prepare("DELETE FROM subcategories WHERE category_id = ?").run(req.params.id);
  db.prepare("DELETE FROM categories WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

// Subcategories
app.get("/api/subcategories", (req, res) => {
  const subcategories = db.prepare(`
    SELECT subcategories.*, categories.name as category_name
    FROM subcategories
    JOIN categories ON subcategories.category_id = categories.id
  `).all();
  res.json(subcategories);
});

app.get("/api/categories/:id/subcategories", (req, res) => {
  const subcategories = db.prepare("SELECT * FROM subcategories WHERE category_id = ?").all(req.params.id);
  res.json(subcategories);
});

app.post("/api/subcategories", (req, res) => {
  const { category_id, name } = req.body;
  try {
    const result = db.prepare("INSERT INTO subcategories (category_id, name) VALUES (?, ?)").run(category_id, name);
    res.json({ id: result.lastInsertRowid });
  } catch (e) {
    res.status(400).json({ error: "Subcategory already exists in this category" });
  }
});

app.put("/api/subcategories/:id", (req, res) => {
  const { category_id, name } = req.body;
  try {
    db.prepare("UPDATE subcategories SET category_id = ?, name = ? WHERE id = ?").run(category_id, name, req.params.id);
    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ error: "Subcategory name already exists in this category" });
  }
});

app.delete("/api/subcategories/:id", (req, res) => {
  db.prepare("DELETE FROM subcategories WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

// Banners
app.get("/api/banners", (req, res) => {
  const banners = db.prepare("SELECT * FROM banners").all();
  res.json(banners);
});

app.post("/api/banners", (req, res) => {
  const { title, description, image_url, link, status } = req.body;
  const result = db.prepare("INSERT INTO banners (title, description, image_url, link, status) VALUES (?, ?, ?, ?, ?)").run(
    title, description, image_url, link, status || 'active'
  );
  res.json({ id: result.lastInsertRowid });
});

app.put("/api/banners/:id", (req, res) => {
  const { title, description, image_url, link, status } = req.body;
  db.prepare(`
    UPDATE banners SET title = ?, description = ?, image_url = ?, link = ?, status = ?
    WHERE id = ?
  `).run(title, description, image_url, link, status, req.params.id);
  res.json({ success: true });
});

app.delete("/api/banners/:id", (req, res) => {
  db.prepare("DELETE FROM banners WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

// Visitors
app.get("/api/visitors", (req, res) => {
  const visitors = db.prepare("SELECT * FROM visitors ORDER BY visited_at DESC").all();
  res.json(visitors);
});

app.post("/api/visitors", (req, res) => {
  const { name, location, ip_address, user_agent } = req.body;
  const result = db.prepare("INSERT INTO visitors (name, location, ip_address, user_agent) VALUES (?, ?, ?, ?)").run(
    name || 'Guest', location || 'Unknown', ip_address || req.ip, user_agent || req.headers['user-agent']
  );
  res.json({ id: result.lastInsertRowid });
});

app.get("/api/visitors/stats", (req, res) => {
  const daily = db.prepare(`
    SELECT date(visited_at) as date, count(*) as count
    FROM visitors
    GROUP BY date(visited_at)
    ORDER BY date ASC
  `).all();
  
  const location = db.prepare(`
    SELECT location, count(*) as count
    FROM visitors
    GROUP BY location
    ORDER BY count DESC
  `).all();

  res.json({ daily, location });
});

// Reviews
app.get("/api/products/:id/reviews", (req, res) => {
  const reviews = db.prepare(`
    SELECT reviews.*, users.name as user_name
    FROM reviews
    JOIN users ON reviews.user_id = users.id
    WHERE product_id = ?
    ORDER BY created_at DESC
  `).all(req.params.id);
  res.json(reviews);
});

app.post("/api/reviews", (req, res) => {
  const { product_id, user_id, rating, comment } = req.body;
  const result = db.prepare(`
    INSERT INTO reviews (product_id, user_id, rating, comment)
    VALUES (?, ?, ?, ?)
  `).run(product_id, user_id, rating, comment);
  res.json({ id: result.lastInsertRowid });
});

// Wishlist
app.get("/api/wishlist/:user_id", (req, res) => {
  const wishlist = db.prepare(`
    SELECT products.*, wishlist.note
    FROM wishlist
    JOIN products ON wishlist.product_id = products.id
    WHERE wishlist.user_id = ?
  `).all(req.params.user_id);
  res.json(wishlist.map(p => ({ ...p, images: JSON.parse(p.images || '[]') })));
});

app.post("/api/wishlist", (req, res) => {
  const { user_id, product_id, note } = req.body;
  try {
    const result = db.prepare("INSERT INTO wishlist (user_id, product_id, note) VALUES (?, ?, ?)").run(user_id, product_id, note || "");
    res.json({ id: result.lastInsertRowid });
  } catch (e) {
    res.status(400).json({ error: "Already in wishlist" });
  }
});

app.put("/api/wishlist/:user_id/:product_id", (req, res) => {
  const { note } = req.body;
  db.prepare("UPDATE wishlist SET note = ? WHERE user_id = ? AND product_id = ?").run(note, req.params.user_id, req.params.product_id);
  res.json({ success: true });
});

app.delete("/api/wishlist/:user_id/:product_id", (req, res) => {
  db.prepare("DELETE FROM wishlist WHERE user_id = ? AND product_id = ?").run(req.params.user_id, req.params.product_id);
  res.json({ success: true });
});

// About Content
app.get("/api/about", (req, res) => {
  const about = db.prepare("SELECT * FROM about_content ORDER BY id DESC LIMIT 1").get();
  res.json(about || { content: "" });
});

app.put("/api/about", (req, res) => {
  const { content } = req.body;
  const exists = db.prepare("SELECT id FROM about_content LIMIT 1").get();
  if (exists) {
    db.prepare("UPDATE about_content SET content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(content, exists.id);
  } else {
    db.prepare("INSERT INTO about_content (content) VALUES (?)").run(content);
  }
  res.json({ success: true });
});

// Contact Info
app.get("/api/contact", (req, res) => {
  const contact = db.prepare("SELECT * FROM contact_info ORDER BY id DESC LIMIT 1").get();
  res.json(contact || { address: "", phone: "", email: "" });
});

app.put("/api/contact", (req, res) => {
  const { address, phone, email } = req.body;
  const exists = db.prepare("SELECT id FROM contact_info LIMIT 1").get();
  if (exists) {
    db.prepare("UPDATE contact_info SET address = ?, phone = ?, email = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(address, phone, email, exists.id);
  } else {
    db.prepare("INSERT INTO contact_info (address, phone, email) VALUES (?, ?, ?)").run(address, phone, email);
  }
  res.json({ success: true });
});

// Social Links
app.get("/api/social-links", (req, res) => {
  const links = db.prepare("SELECT * FROM social_links ORDER BY id DESC LIMIT 1").get();
  res.json(links || { 
    facebook: "", facebook_visible: 1, 
    instagram: "", instagram_visible: 1, 
    twitter: "", twitter_visible: 1, 
    whatsapp: "", whatsapp_visible: 1 
  });
});

app.put("/api/social-links", (req, res) => {
  const { 
    facebook, facebook_visible, 
    instagram, instagram_visible, 
    twitter, twitter_visible, 
    whatsapp, whatsapp_visible 
  } = req.body;
  const exists = db.prepare("SELECT id FROM social_links LIMIT 1").get();
  if (exists) {
    db.prepare(`
      UPDATE social_links 
      SET facebook = ?, facebook_visible = ?, 
          instagram = ?, instagram_visible = ?, 
          twitter = ?, twitter_visible = ?, 
          whatsapp = ?, whatsapp_visible = ?, 
          updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `).run(
      facebook, facebook_visible ? 1 : 0, 
      instagram, instagram_visible ? 1 : 0, 
      twitter, twitter_visible ? 1 : 0, 
      whatsapp, whatsapp_visible ? 1 : 0, 
      exists.id
    );
  } else {
    db.prepare(`
      INSERT INTO social_links (
        facebook, facebook_visible, 
        instagram, instagram_visible, 
        twitter, twitter_visible, 
        whatsapp, whatsapp_visible
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      facebook, facebook_visible ? 1 : 0, 
      instagram, instagram_visible ? 1 : 0, 
      twitter, twitter_visible ? 1 : 0, 
      whatsapp, whatsapp_visible ? 1 : 0
    );
  }
  res.json({ success: true });
});

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
