import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Leaf, Sprout, Droplets, Bug, Trash2, Plus, Edit, LogOut, ChevronRight, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
interface Product {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  stock: number;
  brand: string;
  images: string[];
  status: string;
}

interface Banner {
  id: number;
  title: string;
  description: string;
  image_url: string;
  link: string;
}

interface CartItem extends Product {
  quantity: number;
}

// --- Components ---

const Navbar = ({ cartCount, user, onLogout }: { cartCount: number, user: any, onLogout: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const serviceLinks = [
    { name: 'Seeds', path: '/products/Seeds', icon: <Sprout className="w-4 h-4" /> },
    { name: 'Fertilizers', path: '/products/Fertilizers', icon: <Droplets className="w-4 h-4" /> },
    { name: 'Pesticides', path: '/products/Pesticides', icon: <Bug className="w-4 h-4" /> },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md border-b border-primary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Leaf className="text-primary w-8 h-8" />
            <span className="text-2xl font-bold text-primary tracking-tight">Gangeshwar Agro</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === '/' ? 'text-primary' : 'text-gray-600'
              }`}
            >
              Home
            </Link>

            {/* Services Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsServicesOpen(true)}
              onMouseLeave={() => setIsServicesOpen(false)}
            >
              <button
                className={`flex items-center space-x-1 text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname.startsWith('/products') ? 'text-primary' : 'text-gray-600'
                }`}
              >
                <span>Services</span>
                <ChevronRight className={`w-4 h-4 transition-transform ${isServicesOpen ? 'rotate-90' : ''}`} />
              </button>

              <AnimatePresence>
                {isServicesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 w-48 bg-white shadow-xl rounded-2xl border border-gray-100 py-2 mt-2"
                  >
                    {serviceLinks.map((link) => (
                      <Link
                        key={link.name}
                        to={link.path}
                        className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-600 hover:bg-primary/5 hover:text-primary transition-colors"
                      >
                        {link.icon}
                        <span>{link.name}</span>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              to="/about"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === '/about' ? 'text-primary' : 'text-gray-600'
              }`}
            >
              About
            </Link>
            <Link
              to="/contact"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === '/contact' ? 'text-primary' : 'text-gray-600'
              }`}
            >
              Contact
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/cart" className="relative p-2 text-gray-600 hover:text-primary transition-colors">
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-accent text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to={user.role === 'admin' ? '/admin' : '/profile'} className="flex items-center space-x-1 text-gray-600 hover:text-primary">
                  <User className="w-5 h-5" />
                  <span className="text-sm font-medium">{user.name}</span>
                </Link>
                <button onClick={onLogout} className="text-gray-400 hover:text-red-500 transition-colors">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link to="/login" className="bg-primary text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-primary-dark transition-all shadow-sm">
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <Link to="/cart" className="relative p-2 text-gray-600">
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-accent text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600">
              {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              <Link
                to="/"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-4 text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg"
              >
                Home
              </Link>

              {/* Mobile Services Section */}
              <div className="px-3 py-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Services</p>
                <div className="grid grid-cols-1 gap-2">
                  {serviceLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-3 px-3 py-3 text-sm font-medium text-gray-600 hover:text-primary hover:bg-primary/5 rounded-xl transition-colors"
                    >
                      {link.icon}
                      <span>{link.name}</span>
                    </Link>
                  ))}
                </div>
              </div>

              <Link
                to="/about"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-4 text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg"
              >
                About
              </Link>
              <Link
                to="/contact"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-4 text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg"
              >
                Contact
              </Link>
              {!user ? (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-4 text-base font-medium text-primary"
                >
                  Login / Register
                </Link>
              ) : (
                <div className="pt-4 border-t border-gray-100">
                  <Link to="/admin" className="block px-3 py-4 text-base font-medium text-gray-700">Admin Panel</Link>
                  <button onClick={onLogout} className="block w-full text-left px-3 py-4 text-base font-medium text-red-500">Logout</button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Footer = () => (
  <footer className="bg-primary-dark text-white pt-16 pb-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Leaf className="text-white w-8 h-8" />
            <span className="text-2xl font-bold tracking-tight">Gangeshwar Agro</span>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed">
            Your trusted partner in agriculture. Providing high-quality seeds, fertilizers, and pesticides to farmers across the region.
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
          <ul className="space-y-3 text-gray-300 text-sm">
            <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
            <li><Link to="/products/Seeds" className="hover:text-white transition-colors">Seeds</Link></li>
            <li><Link to="/products/Fertilizers" className="hover:text-white transition-colors">Fertilizers</Link></li>
            <li><Link to="/products/Pesticides" className="hover:text-white transition-colors">Pesticides</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-6">Support</h3>
          <ul className="space-y-3 text-gray-300 text-sm">
            <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-6">Contact Us</h3>
          <ul className="space-y-3 text-gray-300 text-sm">
            <li>Main Road, Agro Market</li>
            <li>Gujarat, India</li>
            <li>Phone: +91 98765 43210</li>
            <li>Email: info@gangeshwaragro.com</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 pt-8 text-center text-gray-400 text-xs">
        &copy; {new Date().getFullYear()} Gangeshwar Agro Center. All rights reserved.
      </div>
    </div>
  </footer>
);

const ProductCard = ({ product, onAddToCart }: { product: Product, onAddToCart: (p: Product) => void, key?: React.Key }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group"
  >
    <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden bg-gray-50">
      <img
        src={product.images[0] || 'https://picsum.photos/seed/agro/400/400'}
        alt={product.name}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        referrerPolicy="no-referrer"
      />
      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-bold text-primary uppercase tracking-wider">
        {product.category}
      </div>
    </Link>
    <div className="p-5">
      <Link to={`/product/${product.id}`}>
        <h3 className="text-lg font-semibold text-gray-900 mb-1 hover:text-primary transition-colors line-clamp-1">{product.name}</h3>
      </Link>
      <p className="text-gray-500 text-xs mb-3 line-clamp-2">{product.description}</p>
      <div className="flex items-center justify-between mt-auto">
        <span className="text-xl font-bold text-primary">₹{product.price}</span>
        <button
          onClick={() => onAddToCart(product)}
          className="bg-primary/10 text-primary p-2.5 rounded-xl hover:bg-primary hover:text-white transition-all"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
    </div>
  </motion.div>
);

// --- Pages ---

const Home = ({ products, banners, onAddToCart }: { products: Product[], banners: Banner[], onAddToCart: (p: Product) => void }) => {
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    if (banners.length > 0) {
      const timer = setInterval(() => {
        setCurrentBanner((prev) => (prev + 1) % banners.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [banners]);

  const categories = [
    { name: 'Seeds', icon: <Sprout className="w-8 h-8" />, color: 'bg-green-100 text-green-700', desc: 'High-yield hybrid seeds' },
    { name: 'Fertilizers', icon: <Droplets className="w-8 h-8" />, color: 'bg-blue-100 text-blue-700', desc: 'Organic & chemical nutrients' },
    { name: 'Pesticides', icon: <Bug className="w-8 h-8" />, color: 'bg-orange-100 text-orange-700', desc: 'Effective crop protection' },
  ];

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Slider */}
      <section className="relative h-[500px] md:h-[600px] overflow-hidden bg-gray-900">
        {banners.length > 0 ? (
          banners.map((banner, idx) => (
            <motion.div
              key={banner.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: idx === currentBanner ? 1 : 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0"
            >
              <img
                src={banner.image_url}
                alt={banner.title}
                className="w-full h-full object-cover opacity-60"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 flex items-center justify-center text-center px-4">
                <div className="max-w-3xl space-y-6">
                  <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: idx === currentBanner ? 0 : 20, opacity: idx === currentBanner ? 1 : 0 }}
                    className="text-4xl md:text-6xl font-black text-white leading-tight"
                  >
                    {banner.title}
                  </motion.h1>
                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: idx === currentBanner ? 0 : 20, opacity: idx === currentBanner ? 1 : 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-lg md:text-xl text-gray-200"
                  >
                    {banner.description}
                  </motion.p>
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: idx === currentBanner ? 0 : 20, opacity: idx === currentBanner ? 1 : 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Link to={banner.link} className="inline-block bg-primary text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-primary-dark transition-all shadow-lg">
                      Shop Now
                    </Link>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
            <h1 className="text-4xl font-bold text-white">Welcome to Gangeshwar Agro</h1>
          </div>
        )}
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Shop by Category</h2>
          <p className="text-gray-500 mt-2">Everything you need for a bountiful harvest</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat) => (
            <Link key={cat.name} to={`/products/${cat.name}`} className="group">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center transition-all group-hover:shadow-md group-hover:border-primary/20">
                <div className={`inline-flex p-5 rounded-2xl mb-6 ${cat.color} transition-transform group-hover:scale-110`}>
                  {cat.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{cat.name}</h3>
                <p className="text-gray-500 text-sm">{cat.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
            <p className="text-gray-500 mt-1">Top rated items by our farmers</p>
          </div>
          <Link to="/products/all" className="text-primary font-semibold flex items-center hover:underline">
            View All <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-primary/5 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="bg-white p-4 rounded-full shadow-sm text-primary">
                <Star className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold">Premium Quality</h3>
              <p className="text-gray-600">We source only the best seeds and chemicals from trusted global brands.</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="bg-white p-4 rounded-full shadow-sm text-primary">
                <Droplets className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold">Expert Advice</h3>
              <p className="text-gray-600">Our agronomists are available to help you choose the right products for your soil.</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="bg-white p-4 rounded-full shadow-sm text-primary">
                <Leaf className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold">Fast Delivery</h3>
              <p className="text-gray-600">Get your agricultural supplies delivered right to your farm in record time.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const ProductListing = ({ products, onAddToCart }: { products: Product[], onAddToCart: (p: Product) => void }) => {
  const { category } = useNavigate() as any; // Mocking for now, will use useParams
  // Actually let's use useParams
  return null; // Placeholder
};

// --- Main App Component ---

const AddProductPage = ({ setProducts }: any) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    category: 'Seeds',
    price: '',
    stock: '',
    brand: '',
    description: '',
    images: ['https://picsum.photos/seed/agro/600/600']
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, price: Number(formData.price), stock: Number(formData.stock) })
    });
    const data = await res.json();
    if (data.id) {
      const newProd = { ...formData, id: data.id, price: Number(formData.price), stock: Number(formData.stock) };
      setProducts((prev: any) => [...prev, newProd]);
      navigate('/admin');
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold mb-8">Add New Product</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold mb-2">Product Name</label>
              <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-primary" required />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Category</label>
              <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-primary">
                <option>Seeds</option>
                <option>Fertilizers</option>
                <option>Pesticides</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold mb-2">Price (₹)</label>
              <input type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-primary" required />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Stock Quantity</label>
              <input type="number" value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-primary" required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Brand Name</label>
            <input type="text" value={formData.brand} onChange={e => setFormData({ ...formData, brand: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-primary" required />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Description</label>
            <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-primary h-32" required />
          </div>
          <div className="flex space-x-4">
            <button type="button" onClick={() => navigate('/admin')} className="flex-grow py-3 rounded-xl font-bold border border-gray-200 hover:bg-gray-50">Cancel</button>
            <button type="submit" className="flex-grow py-3 rounded-xl font-bold bg-primary text-white hover:bg-primary-dark shadow-lg shadow-primary/20">Save Product</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AboutPage = () => (
  <div className="max-w-4xl mx-auto py-20 px-4 space-y-12">
    <div className="text-center space-y-4">
      <h1 className="text-4xl font-black text-gray-900">About Gangeshwar Agro</h1>
      <p className="text-xl text-gray-500">Empowering farmers since 1995</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      <img src="https://picsum.photos/seed/farm3/800/600" className="rounded-3xl shadow-lg" referrerPolicy="no-referrer" />
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Our Mission</h2>
        <p className="text-gray-600 leading-relaxed">
          At Gangeshwar Agro Center, we believe that the backbone of our nation is the farmer. Our mission is to provide the highest quality agricultural inputs—seeds, fertilizers, and pesticides—at fair prices, combined with expert knowledge to ensure sustainable and profitable farming.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-gray-100">
            <h4 className="font-bold text-primary text-2xl">25+</h4>
            <p className="text-xs text-gray-500 uppercase">Years Experience</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-100">
            <h4 className="font-bold text-primary text-2xl">10k+</h4>
            <p className="text-xs text-gray-500 uppercase">Happy Farmers</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ContactPage = () => (
  <div className="max-w-5xl mx-auto py-20 px-4">
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">
      <div className="bg-primary p-12 text-white md:w-1/3 space-y-8">
        <h2 className="text-3xl font-bold">Contact Info</h2>
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="bg-white/10 p-3 rounded-xl"><Leaf className="w-5 h-5" /></div>
            <div>
              <p className="text-xs text-white/60 uppercase font-bold">Address</p>
              <p className="text-sm">Main Road, Agro Market, Gujarat</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-white/10 p-3 rounded-xl"><ShoppingCart className="w-5 h-5" /></div>
            <div>
              <p className="text-xs text-white/60 uppercase font-bold">Email</p>
              <p className="text-sm">info@gangeshwaragro.com</p>
            </div>
          </div>
        </div>
      </div>
      <div className="p-12 flex-grow">
        <h2 className="text-3xl font-bold mb-8">Send a Message</h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input type="text" placeholder="Your Name" className="w-full px-4 py-3 rounded-2xl border border-gray-100 outline-none focus:border-primary" />
          <input type="email" placeholder="Email Address" className="w-full px-4 py-3 rounded-2xl border border-gray-100 outline-none focus:border-primary" />
          <textarea placeholder="How can we help you?" className="w-full px-4 py-3 rounded-2xl border border-gray-100 outline-none focus:border-primary md:col-span-2 h-32"></textarea>
          <button className="bg-primary text-white py-4 rounded-2xl font-bold md:col-span-2 hover:bg-primary-dark transition-all">Send Message</button>
        </form>
      </div>
    </div>
  </div>
);

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, banRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/banners')
        ]);
        const prodData = await prodRes.json();
        const banData = await banRes.json();
        setProducts(prodData);
        setBanners(banData);

        // Load user from local storage
        const savedUser = localStorage.getItem('agro_user');
        if (savedUser) setUser(JSON.parse(savedUser));

        // Load cart
        const savedCart = localStorage.getItem('agro_cart');
        if (savedCart) setCart(JSON.parse(savedCart));
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      let newCart;
      if (existing) {
        newCart = prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        newCart = [...prev, { ...product, quantity: 1 }];
      }
      localStorage.setItem('agro_cart', JSON.stringify(newCart));
      return newCart;
    });
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('agro_user');
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-secondary">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="text-primary"
      >
        <Sprout className="w-12 h-12" />
      </motion.div>
    </div>
  );

  return (
    <Router>
      <div className="min-h-screen flex flex-col font-sans">
        <Navbar cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)} user={user} onLogout={handleLogout} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home products={products} banners={banners} onAddToCart={handleAddToCart} />} />
            <Route path="/products/:category" element={<ProductsPage products={products} onAddToCart={handleAddToCart} />} />
            <Route path="/product/:id" element={<ProductDetailsPage products={products} onAddToCart={handleAddToCart} />} />
            <Route path="/cart" element={<CartPage cart={cart} setCart={setCart} />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage setUser={setUser} />} />
            <Route path="/admin/*" element={<AdminDashboard products={products} setProducts={setProducts} banners={banners} setBanners={setBanners} />} />
            <Route path="/admin/add-product" element={<AddProductPage setProducts={setProducts} />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

// --- Sub-Pages (Defined here for brevity in this single file approach) ---

const ProductsPage = ({ products, onAddToCart }: { products: Product[], onAddToCart: (p: Product) => void }) => {
  const { category } = useParams() as any;
  const filtered = category === 'all' ? products : products.filter(p => p.category === category);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-gray-900 capitalize">{category}</h1>
        <p className="text-gray-500 mt-2">Showing {filtered.length} products</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {filtered.map(p => <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} />)}
      </div>
    </div>
  );
};

const ProductDetailsPage = ({ products, onAddToCart }: { products: Product[], onAddToCart: (p: Product) => void }) => {
  const { id } = useParams();
  const product = products.find(p => p.id === Number(id));
  const [qty, setQty] = useState(1);

  if (!product) return <div className="py-20 text-center">Product not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        <div className="space-y-4">
          <div className="aspect-square rounded-3xl overflow-hidden bg-white border border-gray-100">
            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((img, i) => (
              <div key={i} className="aspect-square rounded-xl overflow-hidden border border-gray-100">
                <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-8">
          <div>
            <span className="text-primary font-bold uppercase tracking-widest text-xs">{product.category}</span>
            <h1 className="text-4xl font-black text-gray-900 mt-2">{product.name}</h1>
            <p className="text-gray-500 mt-4 text-lg leading-relaxed">{product.description}</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-4xl font-black text-primary">₹{product.price}</span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center border border-gray-200 rounded-2xl p-1 bg-white">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-3 hover:bg-gray-50 rounded-xl transition-colors">
                <Trash2 className="w-4 h-4 text-gray-400" />
              </button>
              <span className="w-12 text-center font-bold">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="p-3 hover:bg-gray-50 rounded-xl transition-colors">
                <Plus className="w-4 h-4 text-primary" />
              </button>
            </div>
            <button
              onClick={() => onAddToCart({ ...product })}
              className="flex-grow bg-primary text-white py-4 rounded-2xl font-bold text-lg hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
            >
              Add to Cart
            </button>
          </div>
          <div className="pt-8 border-t border-gray-100">
            <h3 className="font-bold mb-4">Product Details</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><span className="font-semibold text-gray-900">Brand:</span> {product.brand}</li>
              <li><span className="font-semibold text-gray-900">Category:</span> {product.category}</li>
              <li><span className="font-semibold text-gray-900">Stock:</span> {product.stock} units</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const CartPage = ({ cart, setCart }: { cart: CartItem[], setCart: any }) => {
  const navigate = useNavigate();
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const updateQty = (id: number, delta: number) => {
    const newCart = cart.map(item =>
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    );
    setCart(newCart);
    localStorage.setItem('agro_cart', JSON.stringify(newCart));
  };

  const removeItem = (id: number) => {
    const newCart = cart.filter(item => item.id !== id);
    setCart(newCart);
    localStorage.setItem('agro_cart', JSON.stringify(newCart));
  };

  if (cart.length === 0) return (
    <div className="py-32 text-center space-y-6">
      <div className="bg-white w-24 h-24 rounded-full flex items-center justify-center mx-auto shadow-sm">
        <ShoppingCart className="w-10 h-10 text-gray-300" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900">Your cart is empty</h2>
      <Link to="/" className="inline-block bg-primary text-white px-8 py-3 rounded-full font-bold">Start Shopping</Link>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-black mb-10">Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          {cart.map(item => (
            <div key={item.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center space-x-6">
              <img src={item.images[0]} className="w-24 h-24 rounded-2xl object-cover" referrerPolicy="no-referrer" />
              <div className="flex-grow">
                <h3 className="font-bold text-lg">{item.name}</h3>
                <p className="text-gray-500 text-sm">{item.brand}</p>
                <div className="flex items-center space-x-4 mt-4">
                  <div className="flex items-center border border-gray-100 rounded-xl bg-gray-50">
                    <button onClick={() => updateQty(item.id, -1)} className="p-2 hover:text-primary"><Trash2 className="w-4 h-4" /></button>
                    <span className="w-8 text-center font-bold">{item.quantity}</span>
                    <button onClick={() => updateQty(item.id, 1)} className="p-2 hover:text-primary"><Plus className="w-4 h-4" /></button>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="text-red-500 text-sm font-medium hover:underline">Remove</button>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-black text-primary">₹{item.price * item.quantity}</p>
                <p className="text-gray-400 text-xs">₹{item.price} / unit</p>
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <h3 className="text-xl font-bold">Order Summary</h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{total}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-green-600 font-bold">FREE</span>
              </div>
              <div className="pt-4 border-t border-gray-100 flex justify-between text-xl font-black">
                <span>Total</span>
                <span className="text-primary">₹{total}</span>
              </div>
            </div>
            <button className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-lg hover:bg-primary-dark transition-all shadow-lg shadow-primary/20">
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const LoginPage = ({ setUser }: { setUser: any }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.user) {
      setUser(data.user);
      localStorage.setItem('agro_user', JSON.stringify(data.user));
      navigate(data.user.role === 'admin' ? '/admin' : '/');
    } else {
      alert(data.error);
    }
  };

  return (
    <div className="max-w-md mx-auto py-20 px-4">
      <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
        <h1 className="text-3xl font-black text-center mb-8">Welcome Back</h1>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              placeholder="admin@gangeshwar.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" className="w-full bg-primary text-white py-4 rounded-2xl font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20">
            Sign In
          </button>
        </form>
        <p className="mt-8 text-center text-sm text-gray-500">
          Admin: admin@gangeshwar.com / admin123
        </p>
      </div>
    </div>
  );
};

const AdminDashboard = ({ products, setProducts, banners, setBanners }: any) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('products');

  const handleDeleteProduct = async (id: number) => {
    if (confirm('Delete this product?')) {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
      setProducts(products.filter((p: any) => p.id !== id));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row gap-12">
        <aside className="w-full md:w-64 space-y-2">
          <h2 className="text-xl font-bold mb-6 px-4">Admin Panel</h2>
          <button onClick={() => setActiveTab('products')} className={`w-full text-left px-4 py-3 rounded-xl font-medium ${activeTab === 'products' ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}>Products</button>
          <button onClick={() => setActiveTab('banners')} className={`w-full text-left px-4 py-3 rounded-xl font-medium ${activeTab === 'banners' ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}>Banners</button>
          <button onClick={() => setActiveTab('orders')} className={`w-full text-left px-4 py-3 rounded-xl font-medium ${activeTab === 'orders' ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}>Orders</button>
        </aside>

        <div className="flex-grow bg-white p-8 rounded-3xl shadow-sm border border-gray-100 min-h-[600px]">
          {activeTab === 'products' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold">Manage Products</h3>
                <button onClick={() => navigate('/admin/add-product')} className="bg-primary text-white px-6 py-2 rounded-full text-sm font-bold flex items-center">
                  <Plus className="w-4 h-4 mr-2" /> Add Product
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-400 text-sm">
                      <th className="pb-4 font-medium">Product</th>
                      <th className="pb-4 font-medium">Category</th>
                      <th className="pb-4 font-medium">Price</th>
                      <th className="pb-4 font-medium">Stock</th>
                      <th className="pb-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {products.map((p: any) => (
                      <tr key={p.id} className="group">
                        <td className="py-4">
                          <div className="flex items-center space-x-3">
                            <img src={p.images[0]} className="w-10 h-10 rounded-lg object-cover" referrerPolicy="no-referrer" />
                            <span className="font-bold text-gray-900">{p.name}</span>
                          </div>
                        </td>
                        <td className="py-4 text-sm text-gray-600">{p.category}</td>
                        <td className="py-4 font-bold text-primary">₹{p.price}</td>
                        <td className="py-4 text-sm">{p.stock}</td>
                        <td className="py-4">
                          <div className="flex space-x-2">
                            <button className="p-2 text-gray-400 hover:text-primary"><Edit className="w-4 h-4" /></button>
                            <button onClick={() => handleDeleteProduct(p.id)} className="p-2 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {activeTab === 'banners' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold">Manage Banners</h3>
                <button className="bg-primary text-white px-6 py-2 rounded-full text-sm font-bold flex items-center">
                  <Plus className="w-4 h-4 mr-2" /> Add Banner
                </button>
              </div>
              <div className="grid grid-cols-1 gap-6">
                {banners.map((b: any) => (
                  <div key={b.id} className="flex items-center space-x-6 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <img src={b.image_url} className="w-32 h-20 rounded-xl object-cover" referrerPolicy="no-referrer" />
                    <div className="flex-grow">
                      <h4 className="font-bold">{b.title}</h4>
                      <p className="text-xs text-gray-500">{b.description}</p>
                    </div>
                    <button onClick={async () => {
                      if(confirm('Delete banner?')) {
                        await fetch(`/api/banners/${b.id}`, { method: 'DELETE' });
                        setBanners(banners.filter((ban: any) => ban.id !== b.id));
                      }
                    }} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === 'orders' && (
            <div className="space-y-8">
              <h3 className="text-2xl font-bold">Recent Orders</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-400 text-sm">
                      <th className="pb-4 font-medium">Order ID</th>
                      <th className="pb-4 font-medium">Customer</th>
                      <th className="pb-4 font-medium">Amount</th>
                      <th className="pb-4 font-medium">Status</th>
                      <th className="pb-4 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {/* Mock orders for now since we don't have real orders yet */}
                    {[
                      { id: 101, user_name: 'Rajesh Kumar', total_amount: 1250, status: 'Delivered', created_at: '2024-03-01' },
                      { id: 102, user_name: 'Suresh Patel', total_amount: 800, status: 'Pending', created_at: '2024-03-05' }
                    ].map((o: any) => (
                      <tr key={o.id}>
                        <td className="py-4 text-sm font-mono">#ORD-{o.id}</td>
                        <td className="py-4 font-bold">{o.user_name}</td>
                        <td className="py-4 font-bold text-primary">₹{o.total_amount}</td>
                        <td className="py-4">
                          <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${o.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {o.status}
                          </span>
                        </td>
                        <td className="py-4 text-sm text-gray-500">{o.created_at}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
