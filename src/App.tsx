import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation, useParams, useSearchParams } from 'react-router-dom';
import { User, Users, Menu, X, Leaf, Sprout, Droplets, Bug, Trash2, Plus, Edit, LogOut, ChevronRight, Star, Mail, Phone, Search, ShoppingBag, Image as ImageIcon, LayoutDashboard, Shield, BarChart3, PieChart as PieChartIcon, Activity, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area, ComposedChart, Line, ScatterChart, Scatter
} from 'recharts';

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
  note?: string;
}

interface Banner {
  id: number;
  title: string;
  description: string;
  image_url: string;
  link: string;
  status: string;
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

const Navbar = ({ user, onLogout, products, wishlistCount, totalPrice }: { user: any, onLogout: () => void, products: Product[], wishlistCount: number, totalPrice: number }) => {
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
    { name: 'Contact', path: '/contact' },
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
            <img src="/logo.png" alt="Gangeshwar Agro Logo" className="w-10 h-10 object-contain" />
            <span className="text-2xl font-bold text-primary tracking-tight hidden sm:block">Gangeshwar Agro Center</span>
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
              Contact
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6 shrink-0">
            {/* Wishlist Summary */}
            <Link to="/wishlist" className="flex flex-col items-end mr-2 group">
              <div className="flex items-center space-x-2 text-primary group-hover:scale-110 transition-transform">
                <Star className="w-5 h-5 fill-current" />
                <span className="text-sm font-bold">{wishlistCount}</span>
              </div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider group-hover:text-primary transition-colors">Total: ₹{totalPrice}</span>
            </Link>

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

              <Link
                to="/wishlist"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-4 text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <Star className="w-5 h-5" />
                  <span>My Wishlist</span>
                </div>
                <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs font-bold">{wishlistCount}</span>
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
            <img src="/logo.png" alt="Gangeshwar Agro Logo" className="w-10 h-10 object-contain brightness-0 invert" onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://cdn-icons-png.flaticon.com/512/628/628283.png';
            }} />
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
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-6">Contact</h3>
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

const ProductCard = ({ product, onWishlistToggle, isInWishlist }: { product: Product, onWishlistToggle?: (p: Product) => void, isInWishlist?: boolean, key?: React.Key }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group relative"
  >
    {onWishlistToggle && (
      <button 
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onWishlistToggle(product);
        }}
        className={`absolute top-3 left-3 z-10 p-2 rounded-full shadow-md transition-all ${isInWishlist ? 'bg-primary text-white' : 'bg-white/90 text-gray-400 hover:text-primary'}`}
      >
        <Star className={`w-4 h-4 ${isInWishlist ? 'fill-current' : ''}`} />
      </button>
    )}
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

const Home = ({ products, banners, onWishlistToggle, wishlist }: { products: Product[], banners: Banner[], onWishlistToggle: (p: Product) => void, wishlist: Product[] }) => {
  const [currentBanner, setCurrentBanner] = useState(0);
  const activeBanners = banners.filter(b => b.status === 'active');
  const activeProducts = products.filter(p => p.status === 'active');

  useEffect(() => {
    if (activeBanners.length > 0) {
      const timer = setInterval(() => {
        setCurrentBanner((prev) => (prev + 1) % activeBanners.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [activeBanners]);

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Slider */}
      <section className="relative h-[500px] md:h-[600px] overflow-hidden bg-gray-900">
        {activeBanners.length > 0 ? (
          activeBanners.map((banner, idx) => (
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
          {activeProducts.slice(0, 8).map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onWishlistToggle={onWishlistToggle}
              isInWishlist={wishlist.some(item => item.id === product.id)}
            />
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

const AddProductPage = ({ setProducts, products, user }: any) => {
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/admin/login');
    }
  }, [user, navigate]);

  if (!user || user.role !== 'admin') return null;

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

const AboutPage = () => {
  const [about, setAbout] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/about')
      .then(res => res.json())
      .then(data => {
        setAbout(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="py-20 text-center">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto py-20 px-4 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-black text-gray-900">About Gangeshwar Agro</h1>
        <p className="text-xl text-gray-500">Empowering farmers since 1995</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <img src="https://picsum.photos/seed/farm3/800/600" className="rounded-3xl shadow-lg" referrerPolicy="no-referrer" />
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
            {about?.content || "At Gangeshwar Agro Center, we believe that the backbone of our nation is the farmer. Our mission is to provide the highest quality agricultural inputs—seeds, fertilizers, and pesticides—at fair prices, combined with expert knowledge to ensure sustainable and profitable farming."}
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
};

const ContactPage = () => {
  const [contact, setContact] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/contact')
      .then(res => res.json())
      .then(data => {
        setContact(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="py-20 text-center">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto py-20 px-4">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">
        <div className="bg-primary p-12 text-white md:w-1/3 space-y-8">
          <h2 className="text-3xl font-bold">Contact</h2>
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="bg-white/10 p-3 rounded-xl"><Leaf className="w-5 h-5" /></div>
              <div>
                <p className="text-xs text-white/60 uppercase font-bold">Address</p>
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact?.address || "Gangeshwar Agro Center, New Market Yard, Modi Nagar, Palanpur, Gujarat 385001")}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm hover:underline transition-all"
                >
                  {contact?.address || "Gangeshwar Agro Center, New Market Yard, Modi Nagar, Palanpur, Gujarat 385001"}
                </a>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-white/10 p-3 rounded-xl"><Mail className="w-5 h-5" /></div>
              <div>
                <p className="text-xs text-white/60 uppercase font-bold">Email</p>
                <p className="text-sm">{contact?.email || "vivekprajapati4894@gmail.com"}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-white/10 p-3 rounded-xl"><Phone className="w-5 h-5" /></div>
              <div>
                <p className="text-xs text-white/60 uppercase font-bold">Phone</p>
                <a href={`tel:${contact?.phone?.split('|')[0]?.trim() || "+919712999082"}`} className="block text-sm hover:underline transition-all">
                  {contact?.phone || "+91 97129 99082"}
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="p-12 flex-grow">
          <h2 className="text-3xl font-bold mb-8">Send a Message</h2>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input type="text" placeholder="Your Name" className="w-full px-4 py-3 rounded-2xl border border-gray-100 outline-none focus:border-primary" />
            <input type="email" placeholder="Email Address" className="w-full px-4 py-3 rounded-2xl border border-gray-200 outline-none focus:border-primary" />
            <textarea placeholder="How can we help you?" className="w-full px-4 py-3 rounded-2xl border border-gray-100 outline-none focus:border-primary md:col-span-2 h-32"></textarea>
            <button className="bg-primary text-white py-4 rounded-2xl font-bold md:col-span-2 hover:bg-primary-dark transition-all">Send Message</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const handleWishlistToggle = async (product: Product) => {
    if (!user) {
      setWishlist(prev => {
        const exists = prev.find(item => item.id === product.id);
        if (exists) {
          return prev.filter(item => item.id !== product.id);
        } else {
          return [...prev, product];
        }
      });
      return;
    }

    const exists = wishlist.find(item => item.id === product.id);
    if (exists) {
      await fetch(`/api/wishlist/${user.id}/${product.id}`, { method: 'DELETE' });
      setWishlist(prev => prev.filter(item => item.id !== product.id));
    } else {
      await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, product_id: product.id })
      });
      setWishlist(prev => [...prev, product]);
    }
  };

  const handleClearWishlist = async () => {
    if (user) {
      // We don't have a clear all endpoint, so we loop or add one.
      // For simplicity, I'll just remove them one by one or assume the user wants to manage them.
      // Actually, let's add a clear endpoint in server.ts later if needed.
      // For now, just local clear if guest, or alert.
      if (confirm('Clear all items from wishlist?')) {
        for (const item of wishlist) {
          await fetch(`/api/wishlist/${user.id}/${item.id}`, { method: 'DELETE' });
        }
        setWishlist([]);
      }
    } else {
      if (confirm('Clear all items from wishlist?')) {
        setWishlist([]);
      }
    }
  };

  const handleUpdateWishlistNote = async (productId: number, note: string) => {
    if (user) {
      await fetch(`/api/wishlist/${user.id}/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note })
      });
      setWishlist(prev => prev.map(item => item.id === productId ? { ...item, note } : item));
    } else {
      setWishlist(prev => prev.map(item => item.id === productId ? { ...item, note } : item));
    }
  };

  const totalPrice = wishlist.reduce((acc, item) => acc + item.price, 0);

  useEffect(() => {
    if (user) {
      fetch(`/api/wishlist/${user.id}`)
        .then(res => res.json())
        .then(data => setWishlist(data))
        .catch(err => console.error("Failed to fetch wishlist", err));
    }
  }, [user]);

  useEffect(() => {
    const trackVisitor = async () => {
      try {
        await fetch('/api/visitors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: user?.name || 'Guest',
            location: 'Unknown', // In a real app, use a geolocation API
          })
        });
      } catch (err) {
        console.error("Failed to track visitor", err);
      }
    };
    trackVisitor();
  }, []);

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
        <Navbar user={user} onLogout={handleLogout} products={products} wishlistCount={wishlist.length} totalPrice={totalPrice} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home products={products} banners={banners} onWishlistToggle={handleWishlistToggle} wishlist={wishlist} />} />
            <Route path="/products/:category" element={<ProductsPage products={products} onWishlistToggle={handleWishlistToggle} wishlist={wishlist} />} />
            <Route path="/product/:id" element={<ProductDetailsPage products={products} user={user} onWishlistToggle={handleWishlistToggle} wishlist={wishlist} />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage setUser={setUser} />} />
            <Route path="/admin/login" element={<AdminLoginPage setUser={setUser} />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/wishlist" element={<WishlistPage wishlist={wishlist} onWishlistToggle={handleWishlistToggle} onClearWishlist={handleClearWishlist} onUpdateNote={handleUpdateWishlistNote} />} />
            <Route path="/admin/*" element={<AdminDashboard products={products} setProducts={setProducts} banners={banners} setBanners={setBanners} user={user} />} />
            <Route path="/admin/add-product" element={<AddProductPage setProducts={setProducts} products={products} user={user} />} />
            <Route path="/admin/edit-product/:id" element={<AddProductPage setProducts={setProducts} products={products} user={user} />} />
            <Route path="/admin/add-banner" element={<AddBannerPage setBanners={setBanners} user={user} />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

// --- Sub-Pages ---

const WishlistPage = ({ wishlist, onWishlistToggle, onClearWishlist, onUpdateNote }: { wishlist: Product[], onWishlistToggle: (p: Product) => void, onClearWishlist: () => void, onUpdateNote: (id: number, note: string) => void }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black text-gray-900">My Wishlist</h1>
          <p className="text-gray-500 mt-1">Manage your saved agricultural products and add notes</p>
        </div>
        {wishlist.length > 0 && (
          <button 
            onClick={onClearWishlist}
            className="flex items-center space-x-2 text-red-500 hover:text-red-600 font-bold text-sm transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear Wishlist</span>
          </button>
        )}
      </div>

      {wishlist.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {wishlist.map((product) => (
            <div key={product.id} className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-gray-100 flex flex-col">
              <div className="relative group">
                <ProductCard 
                  product={product} 
                  onWishlistToggle={onWishlistToggle}
                  isInWishlist={true}
                />
                <button 
                  onClick={() => onWishlistToggle(product)}
                  className="absolute top-4 right-4 bg-white text-red-500 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110 z-20"
                  title="Remove from Wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="p-6 pt-0 mt-auto border-t border-gray-50">
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">My Notes</label>
                <textarea
                  value={product.note || ''}
                  onChange={(e) => onUpdateNote(product.id, e.target.value)}
                  placeholder="Add a note (e.g. 'For summer crop')"
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none h-20"
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-24 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200"
        >
          <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Star className="w-10 h-10 text-gray-200" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-10 max-w-sm mx-auto">Save items you like to see them here later. We'll help you track the total price of your farming needs.</p>
          <Link to="/products/all" className="bg-primary text-white px-10 py-4 rounded-2xl font-bold hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 inline-block">
            Browse Products
          </Link>
        </motion.div>
      )}
    </div>
  );
};

const AddBannerPage = ({ setBanners, user }: any) => {
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/admin/login');
    }
  }, [user, navigate]);

  if (!user || user.role !== 'admin') return null;

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
      body: JSON.stringify({ ...formData, status: 'active' })
    });
    const data = await res.json();
    if (data.id) {
      setBanners((prev: any) => [...prev, { ...formData, id: data.id, status: 'active' }]);
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
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-primary outline-none transition-all pr-12"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
              >
                {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Confirm New Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-primary outline-none transition-all pr-12"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
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
  const [showPassword, setShowPassword] = useState(false);
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
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                value={formData.password} 
                onChange={e => setFormData({...formData, password: e.target.value})} 
                className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-primary pr-10" 
                required 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
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

const ProductsPage = ({ products, onWishlistToggle, wishlist }: { products: Product[], onWishlistToggle: (p: Product) => void, wishlist: Product[] }) => {
  const { category } = useParams() as any;
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search');

  let filtered = category === 'all' ? products : products.filter(p => p.category === category);
  
  // Filter only active products for customers
  filtered = filtered.filter(p => p.status === 'active');
  
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
          filtered.map(p => (
            <ProductCard 
              key={p.id} 
              product={p} 
              onWishlistToggle={onWishlistToggle}
              isInWishlist={wishlist.some(item => item.id === p.id)}
            />
          ))
        ) : (
          <div className="col-span-full py-20 text-center text-gray-500">
            No products found matching your search.
          </div>
        )}
      </div>
    </div>
  );
};

const ProductDetailsPage = ({ products, user, onWishlistToggle, wishlist }: { products: Product[], user: any, onWishlistToggle: (p: Product) => void, wishlist: Product[] }) => {
  const { id } = useParams();
  const product = products.find(p => p.id === Number(id));
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const isInWishlist = product ? wishlist.some(item => item.id === product.id) : false;

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
            <button 
              onClick={() => onWishlistToggle(product)}
              className={`w-full py-4 rounded-2xl font-bold text-lg shadow-lg transition-all flex items-center justify-center space-x-2 ${isInWishlist ? 'bg-gray-100 text-gray-600' : 'bg-primary text-white hover:bg-primary-dark shadow-primary/20'}`}
            >
              <Star className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
              <span>{isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}</span>
            </button>
            <p className="text-center text-xs text-gray-400 mt-4 uppercase tracking-widest font-bold">Secure Checkout Guaranteed</p>
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

const AdminLoginPage = ({ setUser }: { setUser: any }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
    if (data.user && data.user.role === 'admin') {
      setUser(data.user);
      localStorage.setItem('agro_user', JSON.stringify(data.user));
      navigate('/admin');
    } else if (data.user && data.user.role !== 'admin') {
      setError('Access denied. This portal is for administrators only.');
    } else {
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-gray-50">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="bg-white p-10 rounded-[2rem] shadow-2xl border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
          
          <div className="flex flex-col items-center mb-8">
            <div className="bg-primary/10 p-4 rounded-2xl mb-4">
              <Shield className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-3xl font-black text-gray-900">Admin Portal</h1>
            <p className="text-gray-500 text-sm mt-2">Secure access for Gangeshwar Agro staff</p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-xl mb-6 text-sm font-medium"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Admin Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all bg-gray-50/50"
                placeholder="admin@gangeshwaragro.com"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Security Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all bg-gray-50/50 pr-14"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <button 
              type="submit" 
              className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-black transition-all shadow-xl shadow-gray-200 flex items-center justify-center space-x-2"
            >
              <span>Authenticate</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <Link to="/login" className="text-sm text-gray-400 hover:text-primary transition-colors">
              Return to Customer Login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const LoginPage = ({ setUser }: { setUser: any }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
        <h1 className="text-3xl font-black text-center mb-8">Customer Login</h1>
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
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all pr-12"
              placeholder="Enter Your Password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          <button type="submit" className="w-full bg-primary text-white py-4 rounded-2xl font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20">
            Sign In
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-500">
          Don't have an account? <Link to="/register" className="text-primary font-bold">Register Now</Link>
        </p>
        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <Link to="/admin/login" className="text-xs text-gray-400 hover:text-primary transition-colors flex items-center justify-center space-x-1">
            <Shield className="w-3 h-3" />
            <span>Admin Portal</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = ({ products, setProducts, banners, setBanners, user }: any) => {
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/admin/login');
    }
  }, [user, navigate]);

  if (!user || user.role !== 'admin') return null;

  const [activeTab, setActiveTab] = useState('products');
  const [visitors, setVisitors] = useState<any[]>([]);
  const [visitorStats, setVisitorStats] = useState<any>({ daily: [], location: [] });
  const [chartType, setChartType] = useState('bar');
  const [loading, setLoading] = useState(false);
  const [aboutContent, setAboutContent] = useState('');
  const [contactInfo, setContactInfo] = useState({ address: '', phone: '', email: '' });

  useEffect(() => {
    if (activeTab === 'visitors') {
      fetchVisitors();
    } else if (activeTab === 'analytics') {
      fetchVisitorStats();
    } else if (activeTab === 'about') {
      fetchAbout();
    } else if (activeTab === 'contact') {
      fetchContact();
    }
  }, [activeTab]);

  const fetchAbout = async () => {
    setLoading(true);
    const res = await fetch('/api/about');
    const data = await res.json();
    setAboutContent(data.content);
    setLoading(false);
  };

  const fetchContact = async () => {
    setLoading(true);
    const res = await fetch('/api/contact');
    const data = await res.json();
    setContactInfo(data);
    setLoading(false);
  };

  const handleSaveAbout = async () => {
    await fetch('/api/about', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: aboutContent })
    });
    alert('About content updated!');
  };

  const handleSaveContact = async () => {
    await fetch('/api/contact', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contactInfo)
    });
    alert('Contact info updated!');
  };

  const fetchVisitors = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/visitors');
      const data = await res.json();
      setVisitors(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchVisitorStats = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/visitors/stats');
      const data = await res.json();
      setVisitorStats(data);
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

  const handleToggleProductStatus = async (product: Product) => {
    const newStatus = product.status === 'active' ? 'inactive' : 'active';
    await fetch(`/api/products/${product.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...product, status: newStatus })
    });
    setProducts(products.map((p: any) => p.id === product.id ? { ...p, status: newStatus } : p));
  };

  const handleToggleBannerStatus = async (banner: Banner) => {
    const newStatus = banner.status === 'active' ? 'inactive' : 'active';
    await fetch(`/api/banners/${banner.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...banner, status: newStatus })
    });
    setBanners(banners.map((b: any) => b.id === banner.id ? { ...b, status: newStatus } : b));
  };

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  const renderChart = () => {
    const data = chartType === 'pie' || chartType === 'donut' ? visitorStats.location : visitorStats.daily;
    
    if (!data || data.length === 0) return <div className="h-full flex items-center justify-center text-gray-400">No data available for charts</div>;

    switch (chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={visitorStats.daily}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'pie':
      case 'donut':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={visitorStats.location}
                cx="50%"
                cy="50%"
                innerRadius={chartType === 'donut' ? 60 : 0}
                outerRadius={120}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="count"
                nameKey="location"
                label
              >
                {visitorStats.location.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={visitorStats.daily}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
              <Tooltip />
              <Area type="monotone" dataKey="count" stroke="#10b981" fillOpacity={1} fill="url(#colorCount)" />
            </AreaChart>
          </ResponsiveContainer>
        );
      case 'bullet':
        // Bullet chart simulation using BarChart
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart layout="vertical" data={visitorStats.daily.slice(-5)}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
              <XAxis type="number" hide />
              <YAxis dataKey="date" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
              <Tooltip />
              <Bar dataKey="count" fill="#10b981" barSize={20} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'waterfall':
        // Waterfall chart simulation
        const waterfallData = visitorStats.daily.reduce((acc: any[], curr: any, i: number) => {
          const prev = i === 0 ? 0 : acc[i-1].end;
          acc.push({
            ...curr,
            start: prev,
            end: prev + curr.count,
            display: [prev, prev + curr.count]
          });
          return acc;
        }, []);
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={waterfallData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
              <Tooltip />
              <Bar dataKey="display" fill="#3b82f6" radius={[4, 4, 4, 4]} />
            </BarChart>
          </ResponsiveContainer>
        );
      default:
        return null;
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
          <button onClick={() => setActiveTab('visitors')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'visitors' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-600 hover:bg-gray-100'}`}>
            <Users className="w-5 h-5" />
            <span>Visitors</span>
          </button>
          <button onClick={() => setActiveTab('analytics')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'analytics' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-600 hover:bg-gray-100'}`}>
            <Activity className="w-5 h-5" />
            <span>Analytics</span>
          </button>
          <button onClick={() => setActiveTab('about')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'about' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-600 hover:bg-gray-100'}`}>
            <Leaf className="w-5 h-5" />
            <span>About</span>
          </button>
          <button onClick={() => setActiveTab('contact')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'contact' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-600 hover:bg-gray-100'}`}>
            <Phone className="w-5 h-5" />
            <span>Contact</span>
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
                            <button 
                              onClick={() => handleToggleProductStatus(p)}
                              className={`p-2 rounded-lg transition-colors ${p.status === 'active' ? 'text-green-500 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-50'}`}
                              title={p.status === 'active' ? 'Deactivate' : 'Activate'}
                            >
                              {p.status === 'active' ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                            </button>
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
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${b.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {b.status}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleToggleBannerStatus(b)}
                        className={`p-2 rounded-lg transition-colors ${b.status === 'active' ? 'text-green-500 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-50'}`}
                        title={b.status === 'active' ? 'Deactivate' : 'Activate'}
                      >
                        {b.status === 'active' ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                      </button>
                      <button onClick={async () => {
                        if(confirm('Delete banner?')) {
                          await fetch(`/api/banners/${b.id}`, { method: 'DELETE' });
                          setBanners(banners.filter((ban: any) => ban.id !== b.id));
                        }
                      }} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {!loading && activeTab === 'visitors' && (
            <div className="space-y-8">
              <h3 className="text-2xl font-bold">Website Visitors</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-400 text-sm">
                      <th className="pb-4 font-medium">ID</th>
                      <th className="pb-4 font-medium">Name</th>
                      <th className="pb-4 font-medium">Location</th>
                      <th className="pb-4 font-medium">IP Address</th>
                      <th className="pb-4 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {visitors.length > 0 ? visitors.map((v: any) => (
                      <tr key={v.id}>
                        <td className="py-4 text-sm font-mono text-gray-400">#{v.id}</td>
                        <td className="py-4 font-bold">{v.name}</td>
                        <td className="py-4 text-sm">{v.location}</td>
                        <td className="py-4 text-sm text-gray-500">{v.ip_address}</td>
                        <td className="py-4 text-sm text-gray-500">{new Date(v.visited_at).toLocaleString()}</td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={5} className="py-10 text-center text-gray-400">No visitors found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {!loading && activeTab === 'analytics' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold">Visitor Analytics</h3>
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Chart Type:</span>
                  <select 
                    value={chartType} 
                    onChange={(e) => setChartType(e.target.value)}
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="bar">Bar Chart</option>
                    <option value="pie">Pie Chart</option>
                    <option value="donut">Donut Chart</option>
                    <option value="area">Area Chart</option>
                    <option value="bullet">Bullet Chart</option>
                    <option value="waterfall">Waterfall Chart</option>
                  </select>
                </div>
              </div>
              <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
                {renderChart()}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                  <h4 className="font-bold mb-4 flex items-center">
                    <BarChart3 className="w-4 h-4 mr-2 text-primary" />
                    Top Locations
                  </h4>
                  <div className="space-y-4">
                    {visitorStats.location.slice(0, 5).map((loc: any, i: number) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{loc.location}</span>
                        <div className="flex items-center space-x-3 flex-grow mx-4">
                          <div className="h-2 bg-gray-100 rounded-full flex-grow overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${(loc.count / Math.max(...visitorStats.location.map((l:any) => l.count))) * 100}%` }}
                              className="h-full bg-primary"
                            />
                          </div>
                          <span className="text-xs font-bold text-gray-900">{loc.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                  <h4 className="font-bold mb-4 flex items-center">
                    <PieChartIcon className="w-4 h-4 mr-2 text-primary" />
                    Visit Summary
                  </h4>
                  <div className="flex items-center justify-center h-40">
                    <div className="text-center">
                      <p className="text-4xl font-black text-primary">{visitorStats.daily.reduce((acc:any, curr:any) => acc + curr.count, 0)}</p>
                      <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">Total Visits</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {!loading && activeTab === 'about' && (
            <div className="space-y-8">
              <h3 className="text-2xl font-bold">Manage About Us</h3>
              <div className="space-y-4">
                <label className="block text-sm font-bold text-gray-700">About Content</label>
                <textarea 
                  value={aboutContent} 
                  onChange={(e) => setAboutContent(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 outline-none focus:border-primary h-64"
                  placeholder="Write about your company..."
                />
                <button 
                  onClick={handleSaveAbout}
                  className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}
          {!loading && activeTab === 'contact' && (
            <div className="space-y-8">
              <h3 className="text-2xl font-bold">Manage Contact Info</h3>
              <div className="space-y-6 max-w-2xl">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Address</label>
                  <textarea 
                    value={contactInfo.address} 
                    onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 outline-none focus:border-primary h-24"
                    placeholder="Enter full address..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Phone Numbers (use | to separate multiple)</label>
                  <input 
                    type="text"
                    value={contactInfo.phone} 
                    onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 outline-none focus:border-primary"
                    placeholder="+91 97129 99082 | +91 99254 57719"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                  <input 
                    type="email"
                    value={contactInfo.email} 
                    onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 outline-none focus:border-primary"
                    placeholder="example@gmail.com"
                  />
                </div>
                <button 
                  onClick={handleSaveContact}
                  className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
