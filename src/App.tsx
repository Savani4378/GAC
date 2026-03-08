import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation, useParams, useSearchParams } from 'react-router-dom';
import { User, Users, Menu, X, Leaf, Sprout, Droplets, Bug, Trash2, Plus, Edit, LogOut, ChevronRight, Star, Mail, Phone, Search, ShoppingBag, Image as ImageIcon, LayoutDashboard } from 'lucide-react';
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

interface Review {
  id: number;
  product_id: number;
  user_id: number;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

// --- Components ---

const Navbar = ({ user, onLogout, products }: { user: any, onLogout: () => void, products: Product[] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = React.useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Contact Us', path: '/contact' },
  ];

  const serviceLinks = [
    { name: 'Seeds', path: '/products/Seeds', icon: <Sprout className="w-4 h-4" /> },
    { name: 'Fertilizers', path: '/products/Fertilizers', icon: <Droplets className="w-4 h-4" /> },
    { name: 'Pesticides', path: '/products/Pesticides', icon: <Bug className="w-4 h-4" /> },
  ];

  const suggestions = searchQuery.trim() 
    ? products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5)
    : [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products/all?search=${encodeURIComponent(searchQuery)}`);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (productId: number) => {
    navigate(`/product/${productId}`);
    setSearchQuery('');
    setShowSuggestions(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md border-b border-primary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center gap-4">
          <Link to="/" className="flex items-center space-x-2 shrink-0">
            <Leaf className="text-primary w-8 h-8" />
            <span className="text-2xl font-bold text-primary tracking-tight hidden sm:block">Gangeshwar Agro</span>
          </Link>

          {/* Search Bar */}
          <div ref={searchRef} className="flex-grow max-w-md relative min-w-0">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Search..."
                className="w-full pl-9 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <X className="w-3 h-3 text-gray-400" />
                </button>
              )}
            </form>

            {/* Suggestions Dropdown */}
            <AnimatePresence>
              {showSuggestions && suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white shadow-xl rounded-2xl border border-gray-100 overflow-hidden z-50"
                >
                  {suggestions.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleSuggestionClick(product.id)}
                      className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                    >
                      <img src={product.images[0]} alt="" className="w-8 h-8 rounded object-cover" referrerPolicy="no-referrer" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-400">{product.category}</p>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-8">
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
              Contact Us
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6 shrink-0">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to={user.role === 'admin' ? '/admin' : '/profile'} className="flex items-center space-x-1 text-gray-600 hover:text-primary">
                  <User className="w-5 h-5" />
                  <span className="text-sm font-medium hidden sm:inline">{user.name}</span>
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
          <div className="lg:hidden flex items-center space-x-2">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 p-2">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
            className="lg:hidden bg-white border-t border-gray-100 overflow-hidden"
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
                Contact Us
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
            <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-6">Contact Us</h3>
          <ul className="space-y-3 text-gray-300 text-sm">
            <li>
              <a 
                href="https://www.google.com/maps/search/?api=1&query=Gangeshwar+Agro+Center+New+Market+Yard+Modi+Nagar+Palanpur+Gujarat+385001" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                Gangeshwar Agro Center, New Market Yard,<br />
                Modi Nagar, Palanpur, Gujarat 385001
              </a>
            </li>
            <li>
              Phone: <a href="tel:+919712999082" className="hover:text-white transition-colors">+91 97129 99082</a> | <a href="tel:+919925457719" className="hover:text-white transition-colors">+91 99254 57719</a>
            </li>
            <li>Email: vivekprajapati4894@gmail.com</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 pt-8 text-center text-gray-400 text-xs">
        &copy; {new Date().getFullYear()} Gangeshwar Agro Center. All rights reserved.
      </div>
    </div>
  </footer>
);

const ProductCard = ({ product }: { product: Product, key?: React.Key }) => (
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
      </div>
    </div>
  </motion.div>
);

// --- Pages ---

const Home = ({ products, banners }: { products: Product[], banners: Banner[] }) => {
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
            <ProductCard key={product.id} product={product} />
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

// --- Main App Component ---

const AddProductPage = ({ setProducts, products }: any) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  const [formData, setFormData] = useState({
    name: '',
    category: 'Seeds',
    price: '',
    stock: '',
    brand: '',
    description: '',
    images: ['https://picsum.photos/seed/agro/600/600']
  });

  useEffect(() => {
    if (isEditing && products.length > 0) {
      const product = products.find((p: any) => p.id === Number(id));
      if (product) {
        setFormData({
          name: product.name,
          category: product.category,
          price: String(product.price),
          stock: String(product.stock),
          brand: product.brand,
          description: product.description,
          images: product.images
        });
      }
    }
  }, [id, products, isEditing]);

  const handleAddImage = () => {
    setFormData({ ...formData, images: [...formData.images, ''] });
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  const handleRemoveImage = (index: number) => {
    if (formData.images.length > 1) {
      setFormData({ ...formData, images: formData.images.filter((_, i) => i !== index) });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = isEditing ? `/api/products/${id}` : '/api/products';
    const method = isEditing ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        images: formData.images.filter(img => img.trim() !== ''),
        status: 'active'
      })
    });
    const data = await res.json();

    if (isEditing) {
      setProducts((prev: any) => prev.map((p: any) => p.id === Number(id) ? { 
        ...formData, 
        id: Number(id), 
        price: Number(formData.price), 
        stock: Number(formData.stock),
        images: formData.images.filter(img => img.trim() !== '')
      } : p));
      navigate('/admin');
    } else if (data.id) {
      const newProd = { 
        ...formData, 
        id: data.id, 
        price: Number(formData.price), 
        stock: Number(formData.stock),
        images: formData.images.filter(img => img.trim() !== '')
      };
      setProducts((prev: any) => [...prev, newProd]);
      navigate('/admin');
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold mb-8">{isEditing ? 'Edit Product' : 'Add New Product'}</h2>
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

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-bold">Product Images (URLs)</label>
              <button type="button" onClick={handleAddImage} className="text-primary text-xs font-bold flex items-center">
                <Plus className="w-3 h-3 mr-1" /> Add Image URL
              </button>
            </div>
            <div className="space-y-3">
              {formData.images.map((img, idx) => (
                <div key={idx} className="flex space-x-2">
                  <input
                    type="text"
                    value={img}
                    onChange={e => handleImageChange(idx, e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="flex-grow px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-primary text-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="p-2 text-gray-400 hover:text-red-500"
                    disabled={formData.images.length === 1}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex space-x-4">
            <button type="button" onClick={() => navigate('/admin')} className="flex-grow py-3 rounded-xl font-bold border border-gray-200 hover:bg-gray-50">Cancel</button>
            <button type="submit" className="flex-grow py-3 rounded-xl font-bold bg-primary text-white hover:bg-primary-dark shadow-lg shadow-primary/20">
              {isEditing ? 'Update Product' : 'Save Product'}
            </button>
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
        <h2 className="text-3xl font-bold">Contact Us</h2>
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="bg-white/10 p-3 rounded-xl"><Leaf className="w-5 h-5" /></div>
            <div>
              <p className="text-xs text-white/60 uppercase font-bold">Address</p>
              <a 
                href="https://www.google.com/maps/search/?api=1&query=Gangeshwar+Agro+Center+New+Market+Yard+Modi+Nagar+Palanpur+Gujarat+385001" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm hover:underline transition-all"
              >
                Gangeshwar Agro Center, New Market Yard, Modi Nagar, Palanpur, Gujarat 385001
              </a>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-white/10 p-3 rounded-xl"><Mail className="w-5 h-5" /></div>
            <div>
              <p className="text-xs text-white/60 uppercase font-bold">Email</p>
              <p className="text-sm">vivekprajapati4894@gmail.com</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-white/10 p-3 rounded-xl"><Phone className="w-5 h-5" /></div>
            <div>
              <p className="text-xs text-white/60 uppercase font-bold">Phone</p>
              <a href="tel:+919712999082" className="block text-sm hover:underline transition-all">+91 97129 99082</a>
              <a href="tel:+919925457719" className="block text-sm hover:underline transition-all">+91 99254 57719</a>
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
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, banRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/banners')
        ]);
        
        if (!prodRes.ok) {
          const text = await prodRes.text();
          throw new Error(`Failed to fetch products: ${prodRes.status} ${text}`);
        }
        if (!banRes.ok) {
          const text = await banRes.text();
          throw new Error(`Failed to fetch banners: ${banRes.status} ${text}`);
        }

        const prodData = await prodRes.json();
        const banData = await banRes.json();
        setProducts(prodData);
        setBanners(banData);

        // Load user from local storage
        const savedUser = localStorage.getItem('agro_user');
        if (savedUser) setUser(JSON.parse(savedUser));
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
        <Navbar user={user} onLogout={handleLogout} products={products} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home products={products} banners={banners} />} />
            <Route path="/products/:category" element={<ProductsPage products={products} />} />
            <Route path="/product/:id" element={<ProductDetailsPage products={products} user={user} />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage setUser={setUser} />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/admin/*" element={<AdminDashboard products={products} setProducts={setProducts} banners={banners} setBanners={setBanners} />} />
            <Route path="/admin/add-product" element={<AddProductPage setProducts={setProducts} products={products} />} />
            <Route path="/admin/edit-product/:id" element={<AddProductPage setProducts={setProducts} products={products} />} />
            <Route path="/admin/add-banner" element={<AddBannerPage setBanners={setBanners} />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

// --- Sub-Pages ---

const AddBannerPage = ({ setBanners }: any) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: 'https://picsum.photos/seed/farm/1920/1080',
    link: '/products/all'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/banners', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const data = await res.json();
    if (data.id) {
      setBanners((prev: any) => [...prev, { ...formData, id: data.id }]);
      navigate('/admin');
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold mb-8">Add New Banner</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold mb-2">Banner Title</label>
            <input type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-primary" required />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Description</label>
            <input type="text" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-primary" required />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Image URL</label>
            <input type="text" value={formData.image_url} onChange={e => setFormData({ ...formData, image_url: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-primary" required />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Link Path</label>
            <input type="text" value={formData.link} onChange={e => setFormData({ ...formData, link: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-primary" required />
          </div>
          <div className="flex space-x-4">
            <button type="button" onClick={() => navigate('/admin')} className="flex-grow py-3 rounded-xl font-bold border border-gray-200 hover:bg-gray-50">Cancel</button>
            <button type="submit" className="flex-grow py-3 rounded-xl font-bold bg-primary text-white hover:bg-primary-dark shadow-lg shadow-primary/20">Save Banner</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await res.json();
    if (res.ok) {
      setMessage(data.message);
      setTimeout(() => navigate(`/reset-password?email=${email}`), 2000);
    } else {
      setError(data.error);
    }
  };

  return (
    <div className="max-w-md mx-auto py-20 px-4">
      <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
        <h1 className="text-3xl font-black text-center mb-4">Forgot Password</h1>
        <p className="text-gray-500 text-center mb-8 text-sm">Enter your email to reset your password.</p>
        {message && <div className="bg-green-100 text-green-700 p-4 rounded-xl mb-6 text-sm font-bold">{message}</div>}
        {error && <div className="bg-red-100 text-red-700 p-4 rounded-xl mb-6 text-sm font-bold">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-primary outline-none transition-all"
              placeholder="vivekprajapati4894@gmail.com"
              required
            />
          </div>
          <button type="submit" className="w-full bg-primary text-white py-4 rounded-2xl font-bold hover:bg-primary-dark transition-all">
            Send Reset Link
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-500">
          Remember your password? <Link to="/login" className="text-primary font-bold">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, newPassword })
    });
    const data = await res.json();
    if (res.ok) {
      setMessage(data.message);
      setTimeout(() => navigate('/login'), 2000);
    } else {
      setError(data.error);
    }
  };

  return (
    <div className="max-w-md mx-auto py-20 px-4">
      <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
        <h1 className="text-3xl font-black text-center mb-4">Reset Password</h1>
        <p className="text-gray-500 text-center mb-8 text-sm">Create a new password for {email}</p>
        {message && <div className="bg-green-100 text-green-700 p-4 rounded-xl mb-6 text-sm font-bold">{message}</div>}
        {error && <div className="bg-red-100 text-red-700 p-4 rounded-xl mb-6 text-sm font-bold">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-primary outline-none transition-all"
              placeholder="••••••••"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-primary outline-none transition-all"
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" className="w-full bg-primary text-white py-4 rounded-2xl font-bold hover:bg-primary-dark transition-all">
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: ''
  });
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const data = await res.json();
    if (data.id) {
      alert('Registration successful! Please login.');
      navigate('/login');
    } else {
      alert(data.error);
    }
  };

  return (
    <div className="max-w-md mx-auto py-20 px-4">
      <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
        <h1 className="text-3xl font-black text-center mb-8">Create Account</h1>
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
            <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-primary" required />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
            <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-primary" required />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
            <input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-primary" required />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Phone</label>
            <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-primary" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Address</label>
            <textarea value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-primary h-20"></textarea>
          </div>
          <button type="submit" className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary-dark transition-all mt-4">Register</button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account? <Link to="/login" className="text-primary font-bold">Login</Link>
        </p>
      </div>
    </div>
  );
};

const ProductsPage = ({ products }: { products: Product[] }) => {
  const { category } = useParams() as any;
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search');

  let filtered = category === 'all' ? products : products.filter(p => p.category === category);
  
  if (searchQuery) {
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-gray-900 capitalize">
          {searchQuery ? `Search Results: ${searchQuery}` : category}
        </h1>
        <p className="text-gray-500 mt-2">Showing {filtered.length} products</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {filtered.length > 0 ? (
          filtered.map(p => <ProductCard key={p.id} product={p} />)
        ) : (
          <div className="col-span-full py-20 text-center text-gray-500">
            No products found matching your search.
          </div>
        )}
      </div>
    </div>
  );
};

const ProductDetailsPage = ({ products, user }: { products: Product[], user: any }) => {
  const { id } = useParams();
  const product = products.find(p => p.id === Number(id));
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchReviews();
    }
  }, [id]);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/products/${id}/reviews`);
      const data = await res.json();
      setReviews(data);
    } catch (err) {
      console.error("Failed to fetch reviews", err);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: Number(id),
          user_id: user.id,
          rating,
          comment
        })
      });
      if (res.ok) {
        setComment('');
        setRating(5);
        fetchReviews();
      }
    } catch (err) {
      console.error("Failed to submit review", err);
    } finally {
      setSubmitting(false);
    }
  };

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

      {/* Reviews Section */}
      <div className="mt-20 pt-12 border-t border-gray-100">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-1 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
              <div className="flex items-center mt-2 space-x-2">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-5 h-5 ${i < Math.round(reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1)) ? 'fill-current' : ''}`} />
                  ))}
                </div>
                <span className="text-gray-500 text-sm">Based on {reviews.length} reviews</span>
              </div>
            </div>

            {user ? (
              <form onSubmit={handleSubmitReview} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                <h3 className="font-bold text-gray-900">Write a Review</h3>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Rating</label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`p-1 transition-colors ${rating >= star ? 'text-yellow-400' : 'text-gray-200'}`}
                      >
                        <Star className={`w-6 h-6 ${rating >= star ? 'fill-current' : ''}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Comment</label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="What did you think about this product?"
                    className="w-full px-4 py-3 rounded-2xl border border-gray-100 focus:border-primary outline-none transition-all h-32 text-sm"
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-primary text-white py-3 rounded-2xl font-bold hover:bg-primary-dark transition-all disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            ) : (
              <div className="bg-gray-50 p-6 rounded-3xl text-center">
                <p className="text-gray-500 text-sm mb-4">Please login to write a review.</p>
                <Link to="/login" className="text-primary font-bold hover:underline">Login Now</Link>
              </div>
            )}
          </div>

          <div className="lg:col-span-2 space-y-8">
            {reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="font-bold text-gray-900">{review.user_name}</p>
                        <div className="flex text-yellow-400 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-current' : ''}`} />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">{new Date(review.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-gray-400">
                <p>No reviews yet. Be the first to review this product!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const LoginPage = ({ setUser }: { setUser: any }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
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
      setError('login failed username/password wrong');
    }
  };

  return (
    <div className="max-w-md mx-auto py-20 px-4">
      <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
        <h1 className="text-3xl font-black text-center mb-8">Welcome Back</h1>
        {error && <div className="bg-red-100 text-red-700 p-4 rounded-xl mb-6 text-sm font-bold">{error}</div>}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              placeholder="Enter Your Maild id"
              required
            />
          </div>
          <div className="flex justify-between items-center mb-6">
            <label className="block text-sm font-bold text-gray-700">Password</label>
            <Link to="/forgot-password" title="Forgot Password" id="forgot-password-link" className="text-xs text-primary font-bold hover:underline">Forgot Password?</Link>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            placeholder="Enter Your Password"
            required
          />
          <button type="submit" className="w-full bg-primary text-white py-4 rounded-2xl font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20">
            Sign In
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-500">
          Don't have an account? <Link to="/register" className="text-primary font-bold">Register Now</Link>
        </p>
  
      </div>
    </div>
  );
};

const AdminDashboard = ({ products, setProducts, banners, setBanners }: any) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('products');
  const [orders, setOrders] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    } else if (activeTab === 'customers') {
      fetchCustomers();
    }
  }, [activeTab]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/customers');
      const data = await res.json();
      setCustomers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (confirm('Delete this product?')) {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
      setProducts(products.filter((p: any) => p.id !== id));
    }
  };

  const handleUpdateOrderStatus = async (id: number, status: string) => {
    await fetch(`/api/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
  };

  const handleDeleteCustomer = async (id: number) => {
    if (confirm('Delete this customer?')) {
      await fetch(`/api/customers/${id}`, { method: 'DELETE' });
      setCustomers(customers.filter((c: any) => c.id !== id));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row gap-12">
        <aside className="w-full md:w-64 space-y-2">
          <h2 className="text-xl font-bold mb-6 px-4">Admin Panel</h2>
          <button onClick={() => setActiveTab('products')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'products' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-600 hover:bg-gray-100'}`}>
            <ShoppingBag className="w-5 h-5" />
            <span>Products</span>
          </button>
          <button onClick={() => setActiveTab('banners')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'banners' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-600 hover:bg-gray-100'}`}>
            <ImageIcon className="w-5 h-5" />
            <span>Banners</span>
          </button>
          <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'orders' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-600 hover:bg-gray-100'}`}>
            <LayoutDashboard className="w-5 h-5" />
            <span>Orders</span>
          </button>
          <button onClick={() => setActiveTab('customers')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'customers' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-600 hover:bg-gray-100'}`}>
            <Users className="w-5 h-5" />
            <span>Customers</span>
          </button>
        </aside>

        <div className="flex-grow bg-white p-8 rounded-3xl shadow-sm border border-gray-100 min-h-[600px]">
          {loading && (
            <div className="flex justify-center py-20">
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                <Sprout className="w-8 h-8 text-primary" />
              </motion.div>
            </div>
          )}

          {!loading && activeTab === 'products' && (
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
                            <button onClick={() => navigate(`/admin/edit-product/${p.id}`)} className="p-2 text-gray-400 hover:text-primary"><Edit className="w-4 h-4" /></button>
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
                <button onClick={() => navigate('/admin/add-banner')} className="bg-primary text-white px-6 py-2 rounded-full text-sm font-bold flex items-center">
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
          {!loading && activeTab === 'orders' && (
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
                      <th className="pb-4 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {orders.length > 0 ? orders.map((o: any) => (
                      <tr key={o.id}>
                        <td className="py-4 text-sm font-mono">#ORD-{o.id}</td>
                        <td className="py-4">
                          <div className="font-bold">{o.user_name}</div>
                          <div className="text-xs text-gray-400">{o.user_email}</div>
                        </td>
                        <td className="py-4 font-bold text-primary">₹{o.total_amount}</td>
                        <td className="py-4">
                          <select 
                            value={o.status} 
                            onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                            className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase outline-none ${
                              o.status === 'delivered' ? 'bg-green-100 text-green-700' : 
                              o.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                              'bg-blue-100 text-blue-700'
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="py-4 text-sm text-gray-500">{new Date(o.created_at).toLocaleDateString()}</td>
                        <td className="py-4">
                           <button 
                             onClick={() => alert(JSON.stringify(o.items, null, 2))}
                             className="text-xs text-primary hover:underline"
                           >
                             View Items
                           </button>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={6} className="py-10 text-center text-gray-400">No orders found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {!loading && activeTab === 'customers' && (
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h3 className="text-2xl font-bold">Customer Management</h3>
                <div className="relative w-full md:w-72">
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={customerSearchQuery}
                    onChange={(e) => setCustomerSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-400 text-sm">
                      <th className="pb-4 font-medium">Name</th>
                      <th className="pb-4 font-medium">Email</th>
                      <th className="pb-4 font-medium">Phone</th>
                      <th className="pb-4 font-medium">Joined Date</th>
                      <th className="pb-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {customers.filter(c => 
                      c.name.toLowerCase().includes(customerSearchQuery.toLowerCase()) ||
                      c.email.toLowerCase().includes(customerSearchQuery.toLowerCase())
                    ).length > 0 ? customers.filter(c => 
                      c.name.toLowerCase().includes(customerSearchQuery.toLowerCase()) ||
                      c.email.toLowerCase().includes(customerSearchQuery.toLowerCase())
                    ).map((c: any) => (
                      <tr key={c.id}>
                        <td className="py-4 font-bold">{c.name}</td>
                        <td className="py-4 text-sm">{c.email}</td>
                        <td className="py-4 text-sm">{c.phone || 'N/A'}</td>
                        <td className="py-4 text-sm text-gray-500">{new Date(c.created_at).toLocaleDateString()}</td>
                        <td className="py-4">
                          <button onClick={() => handleDeleteCustomer(c.id)} className="p-2 text-gray-400 hover:text-red-500">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={5} className="py-10 text-center text-gray-400">No customers found.</td>
                      </tr>
                    )}
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
