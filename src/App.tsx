import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu as MenuIcon, 
  X, 
  ChevronDown, 
  ChevronRight, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Instagram, 
  Twitter, 
  Music,
  ArrowRight, 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  Calendar, 
  Users, 
  Check, 
  Navigation, 
  Share2, 
  ArrowLeft, 
  Compass, 
  Sparkles,
  ShoppingBag,
  ExternalLink,
  Info,
  CalendarDays,
  Utensils,
  Image as ImageIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MENU_ITEMS, 
  WEEKDAY_EVENTS, 
  GALLERY_IMAGES, 
  MenuItem, 
  WeekdayEvent, 
  GalleryImage 
} from './data';
// @ts-ignore
import logoImage from './assets/images/admin_logo_1783342382793.jpg';

type Page = 'home' | 'about' | 'activities' | 'menu' | 'gallery' | 'contact';

interface CartItem {
  item: MenuItem;
  quantity: number;
}

interface Reservation {
  id: string;
  name: string;
  email: string;
  phone: string;
  guests: number;
  date: string;
  time: string;
  section: string;
  requests: string;
  createdAt: string;
}

const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.warn('localStorage is not accessible:', e);
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn('localStorage is not accessible:', e);
    }
  }
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const [activitiesDropdownOpen, setActivitiesDropdownOpen] = useState(false);
  
  // Scrolled state for header background
  const [isScrolled, setIsScrolled] = useState(false);

  // Cart / Order Builder State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [menuSearch, setMenuSearch] = useState('');
  const [activeMenuCategory, setActiveMenuCategory] = useState<'all' | 'cocktails' | 'spirits' | 'small-chops' | 'garden'>('all');

  // Booking Form State
  const [bookingName, setBookingName] = useState('');
  const [bookingEmail, setBookingEmail] = useState('');
  const [bookingPhone, setBookingPhone] = useState('');
  const [bookingGuests, setBookingGuests] = useState(2);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('20:00');
  const [bookingSection, setBookingSection] = useState('The Brass Bar');
  const [bookingRequests, setBookingRequests] = useState('');
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [recentReservation, setRecentReservation] = useState<Reservation | null>(null);
  const [showBookingSuccess, setShowBookingSuccess] = useState(false);

  // Gallery State
  const [activeGalleryTab, setActiveGalleryTab] = useState<'all' | 'space' | 'drinks' | 'vibes'>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Weekday activities active day selection
  const [activeDayIndex, setActiveDayIndex] = useState(0);

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMobileMenuOpen(false);
    setAboutDropdownOpen(false);
    setActivitiesDropdownOpen(false);
  }, [currentPage]);

  // Handle header solidifying on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Load reservations from localStorage
  useEffect(() => {
    const saved = safeLocalStorage.getItem('admin_lounge_reservations');
    if (saved) {
      try {
        setReservations(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading reservations', e);
      }
    }
  }, []);

  // Cart operations
  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.item.id === item.id);
      if (existing) {
        return prev.map(i => i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart(prev => {
      return prev.map(i => {
        if (i.item.id === itemId) {
          const newQty = i.quantity + delta;
          return newQty > 0 ? { ...i, quantity: newQty } : null;
        }
        return i;
      }).filter((i): i is CartItem => i !== null);
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(i => i.item.id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, current) => total + (current.item.price * current.quantity), 0);
  };

  // Submit Booking Form
  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingName || !bookingEmail || !bookingPhone || !bookingDate) {
      alert('Please fill out all required fields.');
      return;
    }

    const newReservation: Reservation = {
      id: 'AL-' + Math.floor(100000 + Math.random() * 900000),
      name: bookingName,
      email: bookingEmail,
      phone: bookingPhone,
      guests: bookingGuests,
      date: bookingDate,
      time: bookingTime,
      section: bookingSection,
      requests: bookingRequests,
      createdAt: new Date().toLocaleDateString('en-NG', { dateStyle: 'medium' })
    };

    const updatedReservations = [newReservation, ...reservations];
    setReservations(updatedReservations);
    safeLocalStorage.setItem('admin_lounge_reservations', JSON.stringify(updatedReservations));
    setRecentReservation(newReservation);
    setShowBookingSuccess(true);

    // Reset fields
    setBookingName('');
    setBookingEmail('');
    setBookingPhone('');
    setBookingRequests('');
  };

  // Export Order to Clipboard or simulated WhatsApp
  const handleExportOrder = () => {
    if (cart.length === 0) return;
    const orderText = cart.map(i => `• ${i.item.name} (${i.quantity}x) - ₦${(i.item.price * i.quantity).toLocaleString()}`).join('\n');
    const totalText = `Total: ₦${getCartTotal().toLocaleString()}`;
    const fullMessage = `ADMIN IBADAN ORDER LIST:\n\n${orderText}\n\n${totalText}\n\nPrepared for our host/mixologist at Ring Road, Ibadan.`;
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(fullMessage).then(() => {
        alert('Order copied to clipboard! You can share this with your table server or mixologist.');
      }).catch(err => {
        console.error('Could not copy', err);
        alert('Could not copy order automatically. Order list:\n\n' + fullMessage);
      });
    } else {
      alert('Order details (copy this to share):\n\n' + fullMessage);
    }
  };

  const handleShareReservation = (res: Reservation) => {
    const text = `ADMIN IBADAN RESERVATION CONFIRMED!\n\nID: ${res.id}\nName: ${res.name}\nDate: ${res.date}\nTime: ${res.time}\nGuests: ${res.guests} people\nSection: ${res.section}\n\nWe look forward to hosting you at Ring Road, Ibadan.`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        alert('Reservation details copied! Share this via WhatsApp or save it.');
      }).catch(err => {
        console.error('Could not copy', err);
        alert('Reservation Confirmed! Details:\n\n' + text);
      });
    } else {
      alert('Reservation Confirmed! Details:\n\n' + text);
    }
  };

  const cancelReservation = (id: string) => {
    const updated = reservations.filter(r => r.id !== id);
    setReservations(updated);
    safeLocalStorage.setItem('admin_lounge_reservations', JSON.stringify(updated));
  };

  // Filter gallery images
  const filteredGallery = GALLERY_IMAGES.filter(img => 
    activeGalleryTab === 'all' || img.category === activeGalleryTab
  );

  // Filter menu items
  const filteredMenuItems = MENU_ITEMS.filter(item => {
    const matchesCategory = activeMenuCategory === 'all' || item.category === activeMenuCategory;
    const matchesSearch = item.name.toLowerCase().includes(menuSearch.toLowerCase()) || 
                          item.description.toLowerCase().includes(menuSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div id="app-root" className="min-h-screen bg-[#0A0A0A] text-[#EDEAE3] font-sans antialiased overflow-x-hidden selection:bg-[#C9A24B]/30 selection:text-white relative">
      
      {/* Subtle Grain overlay for premium speakeasy finish */}
      <div id="grain-overlay" className="fixed inset-0 pointer-events-none opacity-[0.015] bg-repeat bg-center z-[9999]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

      {/* STICKY HEADER */}
      <header 
        id="app-header" 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-[#0D0D0D]/95 backdrop-blur-md border-b border-amber-500/10 py-3 shadow-lg' 
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
          
          {/* Logo / Brand Crest */}
          <button 
            id="brand-logo"
            onClick={() => setCurrentPage('home')} 
            className="flex items-center gap-3 cursor-pointer group text-left"
          >
            {/* Minimal High-End Logo Crest Image */}
            <div className="w-10 h-10 rounded-lg border border-amber-500/40 bg-black/60 flex items-center justify-center relative overflow-hidden group-hover:border-amber-500 transition-colors duration-300">
              <div className="absolute inset-0 bg-gradient-to-t from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <img 
                src={logoImage} 
                alt="ADMIN Crest" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <span className="block font-serif text-lg md:text-xl tracking-[0.2em] uppercase font-bold text-white group-hover:text-[#C9A24B] transition-colors duration-300">
                ADMIN
              </span>
              <span className="block text-[8px] tracking-[0.4em] uppercase text-amber-500/80 -mt-1 font-mono">
                LOUNGE & CLUB
              </span>
            </div>
          </button>

          {/* DESKTOP NAVIGATION */}
          <nav id="desktop-nav" className="hidden lg:flex items-center gap-8">
            <button 
              id="nav-item-home"
              onClick={() => setCurrentPage('home')}
              className={`text-sm tracking-widest uppercase cursor-pointer hover:text-[#C9A24B] transition-all relative py-2 ${
                currentPage === 'home' ? 'text-[#C9A24B]' : 'text-[#EDEAE3]/80'
              }`}
            >
              Home
              {currentPage === 'home' && <motion.div layoutId="underline" className="absolute bottom-0 left-0 right-0 h-[1px] bg-[#C9A24B]" />}
            </button>

            {/* About Dropdown */}
            <div className="relative">
              <button 
                id="nav-item-about-trigger"
                onMouseEnter={() => setAboutDropdownOpen(true)}
                onMouseLeave={() => setAboutDropdownOpen(false)}
                onClick={() => {
                  setCurrentPage('about');
                  setAboutDropdownOpen(false);
                }}
                className={`text-sm tracking-widest uppercase flex items-center gap-1 py-2 hover:text-[#C9A24B] transition-colors cursor-pointer ${
                  currentPage === 'about' ? 'text-[#C9A24B]' : 'text-[#EDEAE3]/80'
                }`}
              >
                About Us
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              <AnimatePresence>
                {aboutDropdownOpen && (
                  <motion.div 
                    id="nav-dropdown-about"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    onMouseEnter={() => setAboutDropdownOpen(true)}
                    onMouseLeave={() => setAboutDropdownOpen(false)}
                    className="absolute left-0 mt-1 w-48 bg-[#121212] border border-amber-500/10 rounded-md py-2 shadow-2xl backdrop-blur-lg"
                  >
                    <button 
                      id="dropdown-item-story"
                      onClick={() => {
                        setCurrentPage('about');
                        setAboutDropdownOpen(false);
                        setTimeout(() => document.getElementById('our-story-section')?.scrollIntoView({ behavior: 'smooth' }), 100);
                      }}
                      className="w-full text-left px-4 py-2 text-xs uppercase tracking-wider hover:bg-[#181818] hover:text-[#C9A24B] text-[#EDEAE3]/80 transition-colors"
                    >
                      Our Story
                    </button>
                    <button 
                      id="dropdown-item-space"
                      onClick={() => {
                        setCurrentPage('about');
                        setAboutDropdownOpen(false);
                        setTimeout(() => document.getElementById('the-space-section')?.scrollIntoView({ behavior: 'smooth' }), 100);
                      }}
                      className="w-full text-left px-4 py-2 text-xs uppercase tracking-wider hover:bg-[#181818] hover:text-[#C9A24B] text-[#EDEAE3]/80 transition-colors"
                    >
                      The Space
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Activities Dropdown */}
            <div className="relative">
              <button 
                id="nav-item-activities-trigger"
                onMouseEnter={() => setActivitiesDropdownOpen(true)}
                onMouseLeave={() => setActivitiesDropdownOpen(false)}
                onClick={() => {
                  setCurrentPage('activities');
                  setActivitiesDropdownOpen(false);
                }}
                className={`text-sm tracking-widest uppercase flex items-center gap-1 py-2 hover:text-[#C9A24B] transition-colors cursor-pointer ${
                  currentPage === 'activities' ? 'text-[#C9A24B]' : 'text-[#EDEAE3]/80'
                }`}
              >
                Activities
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              <AnimatePresence>
                {activitiesDropdownOpen && (
                  <motion.div 
                    id="nav-dropdown-activities"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    onMouseEnter={() => setActivitiesDropdownOpen(true)}
                    onMouseLeave={() => setActivitiesDropdownOpen(false)}
                    className="absolute left-0 mt-1 w-56 bg-[#121212] border border-amber-500/10 rounded-md py-2 shadow-2xl backdrop-blur-lg z-50"
                  >
                    {WEEKDAY_EVENTS.map((event, idx) => (
                      <button 
                        key={event.day}
                        id={`dropdown-item-activity-${event.day.toLowerCase()}`}
                        onClick={() => {
                          setActiveDayIndex(idx);
                          setCurrentPage('activities');
                          setActivitiesDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-[11px] uppercase tracking-wider hover:bg-[#181818] hover:text-[#C9A24B] text-[#EDEAE3]/70 transition-colors flex items-center justify-between"
                      >
                        <span>{event.day}</span>
                        <span className="text-[9px] text-amber-500/50">{event.title}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button 
              id="nav-item-menu"
              onClick={() => setCurrentPage('menu')}
              className={`text-sm tracking-widest uppercase cursor-pointer hover:text-[#C9A24B] transition-all relative py-2 ${
                currentPage === 'menu' ? 'text-[#C9A24B]' : 'text-[#EDEAE3]/80'
              }`}
            >
              Menu
              {currentPage === 'menu' && <motion.div layoutId="underline" className="absolute bottom-0 left-0 right-0 h-[1px] bg-[#C9A24B]" />}
            </button>

            <button 
              id="nav-item-gallery"
              onClick={() => setCurrentPage('gallery')}
              className={`text-sm tracking-widest uppercase cursor-pointer hover:text-[#C9A24B] transition-all relative py-2 ${
                currentPage === 'gallery' ? 'text-[#C9A24B]' : 'text-[#EDEAE3]/80'
              }`}
            >
              Gallery
              {currentPage === 'gallery' && <motion.div layoutId="underline" className="absolute bottom-0 left-0 right-0 h-[1px] bg-[#C9A24B]" />}
            </button>

            <button 
              id="nav-item-contact"
              onClick={() => setCurrentPage('contact')}
              className={`text-sm tracking-widest uppercase cursor-pointer hover:text-[#C9A24B] transition-all relative py-2 ${
                currentPage === 'contact' ? 'text-[#C9A24B]' : 'text-[#EDEAE3]/80'
              }`}
            >
              Contact
              {currentPage === 'contact' && <motion.div layoutId="underline" className="absolute bottom-0 left-0 right-0 h-[1px] bg-[#C9A24B]" />}
            </button>
          </nav>

          {/* RIGHT ACTION CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <button 
              id="reserve-btn-desktop"
              onClick={() => setCurrentPage('contact')}
              className="border border-[#C9A24B] hover:bg-[#C9A24B] hover:text-black text-[#C9A24B] font-serif text-xs uppercase tracking-[0.15em] px-5 py-2.5 rounded transition-all duration-300 shadow-[0_0_15px_rgba(201,162,75,0.05)] hover:shadow-[0_0_20px_rgba(201,162,75,0.2)] cursor-pointer"
            >
              Reserve a Table
            </button>
          </div>

          {/* MOBILE ACTION BUTTONS */}
          <div className="flex lg:hidden items-center gap-3">
            {/* Hamburger menu trigger */}
            <button 
              id="mobile-menu-trigger"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-white hover:bg-white/5 rounded-full transition-colors z-50 min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer"
              aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE FULL-SCREEN NAVIGATION OVERLAY */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            id="mobile-menu-overlay"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed inset-0 bg-[#0D0D0D]/98 backdrop-blur-xl z-40 lg:hidden flex flex-col justify-between pt-24 pb-12 px-6"
          >
            {/* Nav links */}
            <div className="flex flex-col gap-6 overflow-y-auto pr-2 mt-4">
              <button 
                id="mob-nav-home"
                onClick={() => setCurrentPage('home')}
                className={`text-2xl font-serif text-left tracking-wider uppercase ${currentPage === 'home' ? 'text-[#C9A24B]' : 'text-[#EDEAE3]'}`}
              >
                Home
              </button>
              
              <div className="border-t border-amber-500/10 pt-4">
                <span className="text-[10px] tracking-[0.3em] uppercase text-amber-500/50 block mb-2">About Us</span>
                <div className="flex flex-col gap-3 pl-4">
                  <button 
                    id="mob-nav-story"
                    onClick={() => {
                      setCurrentPage('about');
                      setTimeout(() => document.getElementById('our-story-section')?.scrollIntoView({ behavior: 'smooth' }), 200);
                    }}
                    className="text-lg text-left text-white/80 hover:text-[#C9A24B]"
                  >
                    Our Story
                  </button>
                  <button 
                    id="mob-nav-space"
                    onClick={() => {
                      setCurrentPage('about');
                      setTimeout(() => document.getElementById('the-space-section')?.scrollIntoView({ behavior: 'smooth' }), 200);
                    }}
                    className="text-lg text-left text-white/80 hover:text-[#C9A24B]"
                  >
                    The Space
                  </button>
                </div>
              </div>

              <div className="border-t border-amber-500/10 pt-4">
                <span className="text-[10px] tracking-[0.3em] uppercase text-amber-500/50 block mb-2">Weekday Activities</span>
                <div className="grid grid-cols-2 gap-2 pl-4">
                  {WEEKDAY_EVENTS.map((event, idx) => (
                    <button 
                      key={event.day}
                      id={`mob-nav-activity-${event.day.toLowerCase()}`}
                      onClick={() => {
                        setActiveDayIndex(idx);
                        setCurrentPage('activities');
                      }}
                      className="text-sm text-left text-white/70 hover:text-[#C9A24B]"
                    >
                      {event.day} <span className="text-[9px] text-amber-500/40 block">{event.title}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button 
                id="mob-nav-menu"
                onClick={() => setCurrentPage('menu')}
                className={`text-2xl font-serif text-left tracking-wider uppercase border-t border-amber-500/10 pt-4 ${currentPage === 'menu' ? 'text-[#C9A24B]' : 'text-[#EDEAE3]'}`}
              >
                The Menu
              </button>

              <button 
                id="mob-nav-gallery"
                onClick={() => setCurrentPage('gallery')}
                className={`text-2xl font-serif text-left tracking-wider uppercase border-t border-amber-500/10 pt-4 ${currentPage === 'gallery' ? 'text-[#C9A24B]' : 'text-[#EDEAE3]'}`}
              >
                Gallery
              </button>

              <button 
                id="mob-nav-contact"
                onClick={() => setCurrentPage('contact')}
                className={`text-2xl font-serif text-left tracking-wider uppercase border-t border-amber-500/10 pt-4 ${currentPage === 'contact' ? 'text-[#C9A24B]' : 'text-[#EDEAE3]'}`}
              >
                Contact & Find Us
              </button>
            </div>

            {/* Bottom Info / CTA */}
            <div className="border-t border-amber-500/10 pt-6 mt-6 flex flex-col gap-4">
              <button 
                id="mob-nav-reserve-cta"
                onClick={() => {
                  setCurrentPage('contact');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-center bg-[#C9A24B] text-black font-serif text-sm uppercase tracking-[0.15em] py-3.5 rounded font-bold"
              >
                Reserve a Table
              </button>
              <div className="text-center text-xs text-[#EDEAE3]/50">
                <span>Ring Road, Ibadan</span>
                <span className="mx-2">•</span>
                <a href="tel:+2349122332703" className="underline hover:text-white">+234 912 233 2703</a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* RESERVATIONS & CART WIDGETS */}

      {/* Sticky Table Booking on mobile (persistent unless on contact page) */}
      {currentPage !== 'contact' && (
        <div id="sticky-reserve-mobile" className="fixed bottom-4 right-4 z-40 lg:hidden">
          <button 
            onClick={() => setCurrentPage('contact')}
            className="bg-[#C9A24B] text-black w-14 h-14 rounded-full flex items-center justify-center shadow-2xl border border-black/40 hover:scale-105 active:scale-95 transition-transform"
            aria-label="Reserve a Table"
          >
            <Calendar className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>
      )}

      {/* MAIN CONTENT PANELS */}
      <main id="app-main" className="pt-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            
            {/* HOME PAGE */}
            {currentPage === 'home' && (
              <div id="home-view" className="space-y-16">
                
                {/* HERO SECTION */}
                <section id="hero-section" className="relative min-h-[90vh] flex items-center justify-center overflow-hidden -mt-20">
                  {/* Hero Image with high-contrast moody dark speakeasy bar backdrop */}
                  <div className="absolute inset-0 bg-[#070707]">
                    <img 
                      src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=1920" 
                      alt="Admin Ibadan Bar" 
                      className="w-full h-full object-cover object-center opacity-40 scale-105 animate-[pulse_10s_infinite_alternate]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/70 to-transparent"></div>
                    {/* Golden Radial Backlight Glow behind heading */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-amber-500/5 blur-[120px] rounded-full"></div>
                  </div>

                  <div className="relative max-w-5xl mx-auto px-4 text-center space-y-8 z-10 pt-20 animate-fade-in">
                    <span className="text-xs md:text-sm uppercase tracking-[0.4em] text-[#C9A24B] block font-mono">
                      [ CLUB • LOUNGE • RESTAURANT • RING ROAD, IBADAN ]
                    </span>
                    <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl tracking-wide text-white leading-[1.15]">
                      Very Upscale & <br className="hidden sm:inline" />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 block mt-2 drop-shadow-[0_0_20px_rgba(201,162,75,0.15)] font-light italic">
                        Reserved for the Purple-Blooded
                      </span>
                    </h1>
                    <p className="text-sm md:text-xl text-[#EDEAE3]/90 max-w-2xl mx-auto font-light leading-relaxed font-serif">
                      Driving the premium nightlife wave in Ibadan with great music, high energy, and signature culinary offerings for the city's finest operators.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                      <button 
                        id="hero-reserve-btn"
                        onClick={() => setCurrentPage('contact')}
                        className="w-full sm:w-auto px-8 py-4 bg-[#C9A24B] hover:bg-[#b08c3d] text-black font-serif uppercase tracking-widest text-xs font-bold rounded transition-all shadow-[0_4px_20px_rgba(201,162,75,0.15)] hover:-translate-y-0.5"
                      >
                        Reserve a Table
                      </button>
                      <button 
                        id="hero-menu-btn"
                        onClick={() => setCurrentPage('menu')}
                        className="w-full sm:w-auto px-8 py-4 border border-[#EDEAE3]/30 hover:border-amber-500 hover:text-[#C9A24B] text-[#EDEAE3] font-serif uppercase tracking-widest text-xs rounded transition-all hover:bg-white/5"
                      >
                        See Our Club Menu
                      </button>
                    </div>
                  </div>

                  {/* Elegant bottom scroll indicator */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-amber-500/40 text-[9px] font-mono tracking-[0.3em] uppercase flex flex-col items-center gap-2 animate-bounce">
                    <span>Scroll down</span>
                    <div className="w-[1px] h-8 bg-amber-500/20"></div>
                  </div>
                </section>

                {/* INTRO / WELCOME STRIP */}
                <section id="welcome-strip" className="max-w-4xl mx-auto px-4 text-center">
                  <div className="h-[0.5px] bg-gradient-to-r from-transparent via-amber-500/30 to-transparent my-8"></div>
                  <h2 className="text-xs uppercase tracking-[0.3em] text-amber-500 mb-4 font-mono font-medium">The Sanctuary Entry</h2>
                  <p className="font-serif text-lg sm:text-2xl text-[#EDEAE3]/90 italic leading-relaxed font-light">
                    "Step inside the premier nightlife sanctuary of Ring Road. Admin Ibadan is the high-energy escape and premium club lounge for the city's high-impact class—where the finest music and signature grilled dishes flow as smoothly as our premium spirits."
                  </p>
                  <div className="h-[0.5px] bg-gradient-to-r from-transparent via-amber-500/30 to-transparent my-8"></div>
                </section>

                {/* FEATURE SPLIT-SECTIONS */}
                <section id="split-sections" className="max-w-7xl mx-auto px-4 md:px-8 space-y-16">
                  {/* Split 1: The Lounge */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    <div className="lg:col-span-7 overflow-hidden rounded group relative">
                      <div className="absolute inset-0 bg-[#801418]/10 mix-blend-color group-hover:opacity-0 transition-opacity duration-500"></div>
                      <img 
                        src="https://images.unsplash.com/photo-1560624052-449f5ddf0c31?auto=format&fit=crop&q=80&w=1200" 
                        alt="The Lounge Seating" 
                        className="w-full h-[300px] md:h-[450px] object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 border-l border-amber-500 pl-3">
                        <span className="block text-[10px] uppercase tracking-widest text-amber-500 font-mono">Environment 01</span>
                        <span className="block font-serif text-lg font-bold text-white tracking-widest uppercase">THE FOUNDER'S SUITE</span>
                      </div>
                    </div>
                    <div className="lg:col-span-5 space-y-6 lg:pl-6">
                      <span className="text-xs uppercase tracking-[0.3em] text-amber-500/80 font-mono block">Intimate Conversational Space</span>
                      <h3 className="font-serif text-3xl md:text-4xl text-white font-medium">Soft Light, Heavy Thoughts</h3>
                      <p className="text-[#EDEAE3]/80 leading-relaxed text-sm md:text-base">
                        Uncompromised comfort. Subdued leather booths, dim amber filaments, and custom acoustic zoning allow you to conduct discrete negotiations or simply unwind in comfortable luxury. No flashes, no alerts, absolute sanctuary.
                      </p>
                      <button 
                        onClick={() => {
                          setCurrentPage('about');
                          setTimeout(() => document.getElementById('the-space-section')?.scrollIntoView({ behavior: 'smooth' }), 200);
                        }}
                        className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#C9A24B] hover:text-white transition-colors group"
                      >
                        Explore the Space 
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>

                  {/* Split 2: The Bar/Club */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    <div className="lg:col-span-5 order-2 lg:order-1 space-y-6 lg:pr-6">
                      <span className="text-xs uppercase tracking-[0.3em] text-[#801418] font-mono block font-bold">High-Performance Rhythms</span>
                      <h3 className="font-serif text-3xl md:text-4xl text-white font-medium">Fine Mixology & Sound Resonance</h3>
                      <p className="text-[#EDEAE3]/80 leading-relaxed text-sm md:text-base">
                        Our copper-clad brass bar hosts world-class mixologists serving bespoke formulations. Under elegant warm lighting, the room transitions seamlessly from deep analog grooves and acoustic sets into raw, infectious Afro-house beats.
                      </p>
                      <button 
                        onClick={() => setCurrentPage('menu')}
                        className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#C9A24B] hover:text-white transition-colors group"
                      >
                        Explore Our Menu
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                    <div className="lg:col-span-7 order-1 lg:order-2 overflow-hidden rounded group relative">
                      <div className="absolute inset-0 bg-emerald-500/10 mix-blend-color group-hover:opacity-0 transition-opacity duration-500"></div>
                      <img 
                        src="https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&q=80&w=1200" 
                        alt="The Brass Bar" 
                        className="w-full h-[300px] md:h-[450px] object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 border-l border-[#801418] pl-3">
                        <span className="block text-[10px] uppercase tracking-widest text-[#801418] font-mono font-bold">Environment 02</span>
                        <span className="block font-serif text-lg font-bold text-white tracking-widest uppercase">THE BRASS BAR</span>
                      </div>
                    </div>
                  </div>
                </section>

                {/* WEEKDAY ACTIVITIES PREVIEW */}
                <section id="weekly-preview" className="bg-[#121212] py-16 border-y border-amber-500/5 relative overflow-hidden">
                  <div className="absolute inset-0 bg-radial-at-b from-[#801418]/5 via-transparent to-transparent"></div>
                  <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
                    
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
                      <div className="space-y-2">
                        <span className="text-xs uppercase tracking-[0.3em] text-amber-500 font-mono">Curated Weekly Program</span>
                        <h3 className="font-serif text-3xl md:text-5xl text-white font-medium">Weekly Activities</h3>
                      </div>
                      <button 
                        onClick={() => setCurrentPage('activities')}
                        className="text-xs uppercase tracking-widest text-[#C9A24B] hover:text-white transition-colors inline-flex items-center gap-2 mt-4 md:mt-0"
                      >
                        View Full 7-Day Calendar <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Horizontal scroll cards */}
                    <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-amber-500/10 scrollbar-track-transparent">
                      {WEEKDAY_EVENTS.slice(0, 4).map((event, idx) => (
                        <div 
                          key={event.day}
                          className="min-w-[280px] md:min-w-[340px] bg-[#181818] border border-amber-500/5 rounded p-6 space-y-4 hover:border-amber-500/20 transition-all group cursor-pointer relative"
                          onClick={() => {
                            setActiveDayIndex(idx);
                            setCurrentPage('activities');
                          }}
                        >
                          <div className="absolute top-0 right-0 p-4 font-mono text-3xl text-amber-500/5 select-none font-bold">
                            {event.shortDay}
                          </div>
                          <span className="text-xs font-mono text-amber-500 uppercase block">{event.day}</span>
                          <h4 className="font-serif text-xl text-white group-hover:text-[#C9A24B] transition-colors font-medium">{event.title}</h4>
                          <span className="text-xs text-[#EDEAE3]/50 block font-mono">{event.time}</span>
                          <p className="text-xs text-[#EDEAE3]/70 line-clamp-3 leading-relaxed">
                            {event.description}
                          </p>
                          <div className="pt-2 border-t border-amber-500/10 text-[10px] tracking-widest uppercase font-bold text-amber-500/80">
                            {event.motif}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* QUICK GALLERY PREVIEW / CAROUSEL */}
                <section id="gallery-carousel-section" className="max-w-7xl mx-auto px-4 md:px-8 py-4">
                  <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
                    <div className="space-y-2">
                      <span className="text-xs uppercase tracking-[0.3em] text-amber-500 font-mono">Captured Moments</span>
                      <h3 className="font-serif text-3xl md:text-4xl text-white font-medium">Lounge Atmosphere</h3>
                    </div>
                    <button 
                      onClick={() => setCurrentPage('gallery')}
                      className="text-xs uppercase tracking-widest text-[#C9A24B] hover:text-white transition-colors inline-flex items-center gap-2 mt-3 md:mt-0"
                    >
                      View Full Gallery <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Horizontally scrollable row with lightboxes */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {GALLERY_IMAGES.slice(0, 3).map((img, idx) => (
                      <div 
                        key={img.id}
                        onClick={() => {
                          setLightboxIndex(idx);
                        }}
                        className="relative h-64 rounded overflow-hidden group cursor-pointer border border-amber-500/5 shadow-xl"
                      >
                        <img 
                          src={img.url} 
                          alt={img.caption} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                          <p className="text-xs text-amber-400 font-mono uppercase tracking-wider mb-1">{img.category}</p>
                          <p className="text-sm font-serif text-white">{img.caption}</p>
                        </div>
                        {/* Soft backlight hover element */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-500/30 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* LOCATION & PROXIMITY STRIP */}
                <section id="location-strip" className="max-w-7xl mx-auto px-4 md:px-8 py-8">
                  <div className="bg-[#121212] rounded-lg border border-amber-500/10 overflow-hidden grid grid-cols-1 lg:grid-cols-12 shadow-2xl">
                    <div className="p-8 lg:p-12 lg:col-span-5 flex flex-col justify-between space-y-8">
                      <div className="space-y-4">
                        <span className="text-xs uppercase tracking-[0.3em] text-amber-500 font-mono">Our Location</span>
                        <h3 className="font-serif text-3xl text-white font-medium">Ring Road, Ibadan</h3>
                        <p className="text-[#EDEAE3]/70 text-sm leading-relaxed">
                          Conveniently and centrally located at Liberty Junction along Ring Road. Experience premium luxury club atmospheres and fresh delicacies with high-end security and easy parking.
                        </p>
                      </div>

                      <div className="space-y-4 text-sm font-mono border-t border-amber-500/10 pt-6">
                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                          <span className="text-xs text-[#EDEAE3]/90">
                            Inside Energy Filling Station, Liberty Junction, Opposite High Court, Ring Road, Ibadan, Oyo State, Nigeria
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-[#801418] shrink-0" />
                          <span className="text-xs text-[#EDEAE3]/90">
                            Tuesdays (Live Band): 8:00 PM | Flagship Friday: 7:45 PM | Elite Sunday: 6:00 PM
                          </span>
                        </div>
                      </div>

                      <div className="pt-2">
                        <a 
                          href="https://maps.google.com" 
                          target="_blank" 
                          rel="noreferrer"
                          className="inline-flex items-center gap-3 bg-[#801418] hover:bg-[#a31d22] text-white px-6 py-3 rounded text-xs uppercase tracking-widest font-mono font-bold transition-all w-full sm:w-auto text-center justify-center"
                        >
                          <Navigation className="w-4 h-4" /> Get Driving Directions
                        </a>
                      </div>
                    </div>

                    {/* STYLIZED VECTOR ARCHITECTURAL MAP */}
                    <div className="lg:col-span-7 h-[350px] lg:h-auto bg-[#0A0A0A] relative flex items-center justify-center overflow-hidden border-t lg:border-t-0 lg:border-l border-amber-500/10">
                      {/* Grid overlay lines */}
                      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                      
                      {/* Vector map graphic */}
                      <svg viewBox="0 0 400 300" className="w-[85%] h-[85%] text-amber-500/20" fill="none" stroke="currentColor" strokeWidth="1">
                        {/* Lagos Lagoon Boundary */}
                        <path d="M 0 50 Q 150 70 300 40 T 400 60" stroke="#801418" strokeWidth="2" strokeDasharray="4 4" className="opacity-40" />
                        
                        {/* Main Grid Streets */}
                        <line x1="50" y1="0" x2="100" y2="300" />
                        <line x1="150" y1="0" x2="180" y2="300" />
                        <line x1="300" y1="0" x2="280" y2="300" strokeWidth="2" stroke="#C9A24B" className="opacity-30" /> {/* Adetokunbo Ademola */}
                        
                        <line x1="0" y1="100" x2="400" y2="120" />
                        <line x1="0" y1="200" x2="400" y2="180" strokeWidth="1.5" />
                        
                        {/* Circle pulse for ADMIN-LOUNGE */}
                        <g transform="translate(285, 140)">
                          <circle r="25" className="animate-ping" fill="rgba(201,162,75,0.15)" stroke="rgba(201,162,75,0.3)" strokeWidth="0.5" />
                          <circle r="12" fill="rgba(128,20,24,0.4)" stroke="#801418" strokeWidth="1" />
                          <circle r="4" fill="#C9A24B" />
                        </g>

                        {/* Text Annotations */}
                        <text x="210" y="22" fill="#EDEAE3" fontSize="8" fontFamily="monospace" opacity="0.5" letterSpacing="1">[ ZONE: RING ROAD, IBADAN ]</text>
                        <text x="290" y="210" fill="#C9A24B" fontSize="9" fontFamily="serif" fontWeight="bold">RING ROAD / LIBERTY JUNCTION</text>
                        <text x="100" y="145" fill="#EDEAE3" fontSize="8" opacity="0.4" fontFamily="monospace">Opposite High Court</text>
                        <text x="300" y="135" fill="#EDEAE3" fontSize="10" fontFamily="serif" fontWeight="bold" letterSpacing="1">ADMIN IBADAN</text>
                        <text x="300" y="148" fill="#C9A24B" fontSize="8" fontFamily="monospace">[ RING ROAD ]</text>
                      </svg>
                      
                      {/* Live Status indicator */}
                      <div className="absolute bottom-4 right-4 bg-black/80 px-3 py-1.5 rounded border border-amber-500/10 font-mono text-[9px] text-amber-500/80">
                        GPS: 7.3551° N, 3.8647° E
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {/* ABOUT US PAGE */}
            {currentPage === 'about' && (
              <div id="about-view" className="space-y-16 max-w-7xl mx-auto px-4 md:px-8 py-8">
                
                {/* HERO Header */}
                <div className="text-center space-y-4 max-w-2xl mx-auto py-8">
                  <span className="text-xs uppercase tracking-[0.4em] text-amber-500 font-mono block">[ CONTEXT & CONCEPT ]</span>
                  <h1 className="font-serif text-4xl md:text-6xl text-white">Our Architecture</h1>
                  <p className="text-sm md:text-base text-[#EDEAE3]/80 leading-relaxed font-light">
                    Admin Ibadan is a high-end luxury setup driving the premium nightlife wave in the city. We blend the high energy of an elite club with the rich culinary experience of a restaurant and lounge.
                  </p>
                </div>

                {/* OUR STORY */}
                <section id="our-story-section" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-8 border-t border-amber-500/10">
                  <div className="lg:col-span-5 space-y-6">
                    <span className="text-xs uppercase tracking-[0.3em] text-[#801418] font-mono font-bold block">01 / The Origin</span>
                    <h2 className="font-serif text-3xl md:text-4xl text-white">Built for the City's Finest</h2>
                    <p className="text-[#EDEAE3]/80 leading-relaxed text-sm md:text-base">
                      Ibadan is a rapidly growing cultural, entertainment, and social hub. As one of the most popular lifestyle hotspots in the city, Admin Ibadan drives the premium nightlife wave under our three pillars: Club, Lounge, and Restaurant.
                    </p>
                    <p className="text-[#EDEAE3]/80 leading-relaxed text-sm md:text-base">
                      Recognized for great music, incredible energy, and our signature "Admin Food" fresh offerings, we have established a sanctuary where guests experience high-fidelity sound, vibrant light installations, and unbeatable hospitality. We are famous for serving some of the largest whole catfish in the area and supplying curated premium spirits and cocktails.
                    </p>
                  </div>
                  <div className="lg:col-span-7 grid grid-cols-2 gap-4">
                    <img 
                      src="https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&q=80&w=600" 
                      alt="Bar interior dim light" 
                      className="rounded object-cover h-64 w-full border border-amber-500/5 shadow-xl"
                    />
                    <img 
                      src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=600" 
                      alt="Mixology detail" 
                      className="rounded object-cover h-64 w-full mt-8 border border-amber-500/5 shadow-xl"
                    />
                  </div>
                </section>

                {/* THE SPACE */}
                <section id="the-space-section" className="space-y-12 pt-8 border-t border-amber-500/10">
                  <div className="text-center space-y-2 max-w-xl mx-auto">
                    <span className="text-xs uppercase tracking-[0.3em] text-amber-500 font-mono block">02 / Physical Layout</span>
                    <h2 className="font-serif text-3xl md:text-4xl text-white">Three Distinct Environments</h2>
                    <p className="text-xs text-[#EDEAE3]/60 font-light">Each optimized for different sensory programs</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Environment 1 */}
                    <div className="bg-[#121212] border border-amber-500/5 rounded p-8 space-y-4 hover:border-amber-500/20 transition-all">
                      <div className="w-12 h-12 bg-[#801418]/10 text-[#C9A24B] border border-amber-500/20 rounded-lg flex items-center justify-center font-mono font-bold text-lg">
                        01
                      </div>
                      <h3 className="font-serif text-xl text-white font-medium">The Main Club Room</h3>
                      <p className="text-xs text-[#EDEAE3]/70 leading-relaxed">
                        The heartbeat. A premium club ambiance featuring state-of-the-art light installations, a lively crowd, and a high-performance audio rig designed for late-night grooves, hype sessions, and top-tier guest DJ bookings.
                      </p>
                    </div>

                    {/* Environment 2 */}
                    <div className="bg-[#121212] border border-amber-500/5 rounded p-8 space-y-4 hover:border-amber-500/20 transition-all">
                      <div className="w-12 h-12 bg-[#801418]/10 text-[#C9A24B] border border-amber-500/20 rounded-lg flex items-center justify-center font-mono font-bold text-lg">
                        02
                      </div>
                      <h3 className="font-serif text-xl text-white font-medium">The VIP Lounge</h3>
                      <p className="text-xs text-[#EDEAE3]/70 leading-relaxed">
                        The inner sanctum. An upscale, reservation-only interior section designed for high-profile social networking, elite gaming, and celebrations, serviced by private wait captains and stocked with rare spirits.
                      </p>
                    </div>

                    {/* Environment 3 */}
                    <div className="bg-[#121212] border border-amber-500/5 rounded p-8 space-y-4 hover:border-amber-500/20 transition-all">
                      <div className="w-12 h-12 bg-[#801418]/10 text-[#C9A24B] border border-amber-500/20 rounded-lg flex items-center justify-center font-mono font-bold text-lg">
                        03
                      </div>
                      <h3 className="font-serif text-xl text-white font-medium">The Outdoor Section</h3>
                      <p className="text-xs text-[#EDEAE3]/70 leading-relaxed">
                        Breezy open-air courtyard styled with cozy furniture and soft warm lanterns. The perfect spot for tasting our signature giant grilled catfish and peppered snail straight from the Admin Food grill.
                      </p>
                    </div>
                  </div>
                </section>

                {/* PHOTO GRID OF INTERIORS */}
                <section id="interiors-grid" className="space-y-6 pt-8 border-t border-amber-500/10">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-2xl text-white font-medium">Lounge Design</h3>
                    <span className="text-xs font-mono text-[#EDEAE3]/40">IBADAN, NG • 2026</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="relative h-48 overflow-hidden rounded group border border-amber-500/5">
                      <img src="https://images.unsplash.com/photo-1560624052-449f5ddf0c31?auto=format&fit=crop&q=80&w=400" alt="Space 1" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="relative h-48 overflow-hidden rounded group border border-amber-500/5">
                      <img src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=400" alt="Space 2" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="relative h-48 overflow-hidden rounded group border border-amber-500/5">
                      <img src="https://images.unsplash.com/photo-1574096079513-d8259312b785?auto=format&fit=crop&q=80&w=400" alt="Space 3" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="relative h-48 overflow-hidden rounded group border border-amber-500/5">
                      <img src="https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&q=80&w=400" alt="Space 4" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  </div>
                </section>
              </div>
            )}

            {/* WEEKDAY ACTIVITIES PAGE */}
            {currentPage === 'activities' && (
              <div id="activities-view" className="space-y-12 max-w-7xl mx-auto px-4 md:px-8 py-8">
                
                {/* HERO HEADER */}
                <div className="text-center space-y-4 max-w-2xl mx-auto py-8">
                  <span className="text-xs uppercase tracking-[0.4em] text-amber-500 font-mono block">[ WEEKLY RECURRING PROGRAM ]</span>
                  <h1 className="font-serif text-4xl md:text-6xl text-white font-medium">Our Weekly Calendar</h1>
                  <p className="text-sm md:text-base text-[#EDEAE3]/80 leading-relaxed font-light">
                    Every evening represents a distinct atmospheric experience at Admin Ibadan. Choose a day to explore the active schedule, musical program, and reservation options.
                  </p>
                </div>

                {/* DAY CHIPS SELECTOR FOR DESKTOP */}
                <div className="flex flex-wrap justify-center gap-2 md:gap-4 border-b border-amber-500/10 pb-6">
                  {WEEKDAY_EVENTS.map((event, idx) => (
                    <button 
                      key={event.day}
                      id={`day-selector-btn-${event.day.toLowerCase()}`}
                      onClick={() => setActiveDayIndex(idx)}
                      className={`px-5 py-3 rounded font-mono text-xs uppercase tracking-widest transition-all cursor-pointer ${
                        activeDayIndex === idx 
                          ? 'bg-[#801418] text-white border border-amber-500/30 shadow-[0_0_15px_rgba(128,20,24,0.3)]' 
                          : 'bg-[#121212] border border-amber-500/5 text-[#EDEAE3]/70 hover:border-amber-500/20 hover:text-white'
                      }`}
                    >
                      {event.day}
                    </button>
                  ))}
                </div>

                {/* ACTIVE EVENT CONTAINER */}
                <div className="bg-[#121212] rounded-lg border border-amber-500/10 overflow-hidden shadow-2xl">
                  <div className="grid grid-cols-1 lg:grid-cols-12">
                    
                    {/* Left details */}
                    <div className="p-8 md:p-12 lg:col-span-7 space-y-6 flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <span className="bg-[#801418] text-white text-[10px] font-mono font-bold px-2.5 py-1 rounded">
                            {WEEKDAY_EVENTS[activeDayIndex].shortDay}
                          </span>
                          <span className="text-xs font-mono text-amber-500 uppercase">DAILY PROGRAM</span>
                        </div>
                        
                        <h2 className="font-serif text-3xl md:text-5xl text-white font-medium">
                          {WEEKDAY_EVENTS[activeDayIndex].title}
                        </h2>
                        
                        <div className="flex items-center gap-2 text-xs text-[#EDEAE3]/50 font-mono">
                          <Clock className="w-4 h-4 text-amber-500" />
                          <span>{WEEKDAY_EVENTS[activeDayIndex].time}</span>
                        </div>

                        <p className="text-[#EDEAE3]/85 text-sm md:text-base leading-relaxed pt-2">
                          {WEEKDAY_EVENTS[activeDayIndex].description}
                        </p>
                      </div>

                      {/* Motif tags */}
                      <div className="space-y-4 pt-6 border-t border-amber-500/10">
                        <span className="text-[10px] tracking-widest font-mono text-[#EDEAE3]/40 uppercase block">Curated Sensory Motifs</span>
                        <div className="flex flex-wrap gap-2">
                          {WEEKDAY_EVENTS[activeDayIndex].motif.split(' • ').map(motif => (
                            <span key={motif} className="bg-amber-500/5 border border-amber-500/20 text-[#C9A24B] px-3 py-1 rounded text-xs tracking-wider">
                              {motif}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Reserve CTAs */}
                      <div className="pt-6 flex flex-col sm:flex-row items-center gap-4">
                        <button 
                          id="activity-book-cta"
                          onClick={() => {
                            setBookingRequests(`Reservation for ${WEEKDAY_EVENTS[activeDayIndex].title} event.`);
                            setCurrentPage('contact');
                          }}
                          className="w-full sm:w-auto px-6 py-3 bg-[#C9A24B] hover:bg-[#b08c3d] text-black font-serif text-xs uppercase tracking-widest font-bold rounded transition-colors"
                        >
                          Book Table For This Night
                        </button>
                        <button 
                          id="activity-menu-cta"
                          onClick={() => setCurrentPage('menu')}
                          className="w-full sm:w-auto px-6 py-3 border border-[#EDEAE3]/20 hover:border-[#C9A24B] text-xs uppercase tracking-widest font-mono text-[#EDEAE3] rounded transition-colors"
                        >
                          View Pairing Menu
                        </button>
                      </div>
                    </div>

                    {/* Right Image */}
                    <div className="lg:col-span-5 h-[300px] lg:h-auto relative">
                      <img 
                        src={WEEKDAY_EVENTS[activeDayIndex].image} 
                        alt={WEEKDAY_EVENTS[activeDayIndex].title} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black/90 via-black/20 to-transparent"></div>
                      <div className="absolute top-4 right-4 bg-black/80 px-3 py-1.5 rounded border border-amber-500/10 text-[10px] text-amber-500 font-mono">
                        [ EXPERIENCE #{activeDayIndex + 1} ]
                      </div>
                    </div>

                  </div>
                </div>

                {/* 7-DAY WEEKLY CALENDAR */}
                <div className="space-y-6 pt-8 border-t border-amber-500/10">
                  <h3 className="font-serif text-2xl text-white font-medium">Full 7-Day Program</h3>
                  <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                    {WEEKDAY_EVENTS.map((event, idx) => (
                      <div 
                        key={event.day}
                        onClick={() => setActiveDayIndex(idx)}
                        className={`p-4 rounded border cursor-pointer transition-all space-y-2 ${
                          activeDayIndex === idx 
                            ? 'bg-[#181818] border-amber-500/40' 
                            : 'bg-[#121212] border-amber-500/5 opacity-70 hover:opacity-100 hover:border-amber-500/10'
                        }`}
                      >
                        <span className="text-[10px] font-mono text-amber-500 uppercase block">{event.day}</span>
                        <h4 className="font-serif text-sm font-bold text-white leading-tight truncate font-medium">{event.title}</h4>
                        <span className="text-[10px] text-[#EDEAE3]/40 font-mono block truncate">{event.time.split(' – ')[0]}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* MENU PAGE */}
            {currentPage === 'menu' && (
              <div id="menu-view" className="space-y-12 max-w-7xl mx-auto px-4 md:px-8 py-8">
                
                {/* HERO Header */}
                <div className="text-center space-y-4 max-w-2xl mx-auto py-8">
                  <span className="text-xs uppercase tracking-[0.4em] text-amber-500 font-mono block">[ ELIXIRS & GRAZING ]</span>
                  <h1 className="font-serif text-4xl md:text-6xl text-white font-medium">The Lounge Formulary</h1>
                  <p className="text-sm md:text-base text-[#EDEAE3]/80 leading-relaxed font-light">
                    Every dish and cocktail is meticulously crafted from premium spirits, organic botanicals, and local West African enhancements.
                  </p>
                </div>

                {/* SEARCH AND FILTERS */}
                <div className="space-y-6 bg-[#121212] p-6 rounded-lg border border-amber-500/10 shadow-xl">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    
                    {/* Search bar */}
                    <div className="md:col-span-5 relative">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-amber-500/50" />
                      <input 
                        id="menu-search-input"
                        type="text" 
                        value={menuSearch}
                        onChange={(e) => setMenuSearch(e.target.value)}
                        placeholder="Search formulas or ingredients..." 
                        className="w-full bg-[#181818] border border-amber-500/5 rounded-md py-2.5 pl-11 pr-4 text-sm text-white placeholder-white/30 focus:border-amber-500/30 focus:outline-none focus:ring-1 focus:ring-amber-500/20"
                      />
                      {menuSearch && (
                        <button 
                          onClick={() => setMenuSearch('')}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Horizontally scrolling Category Filter */}
                    <div className="md:col-span-7 flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
                      {(['all', 'cocktails', 'spirits', 'small-chops', 'garden'] as const).map(category => (
                        <button 
                          key={category}
                          id={`filter-btn-${category}`}
                          onClick={() => setActiveMenuCategory(category)}
                          className={`px-4 py-2 rounded text-xs uppercase tracking-widest font-mono transition-all shrink-0 cursor-pointer ${
                            activeMenuCategory === category 
                              ? 'bg-[#801418] text-white border border-amber-500/20' 
                              : 'bg-[#181818] text-[#EDEAE3]/70 hover:bg-[#1C1C1C] hover:text-white'
                          }`}
                        >
                          {category.replace('-', ' ')}
                        </button>
                      ))}
                    </div>

                  </div>
                </div>

                {/* MENU ITEM GRID */}
                <div>
                  {filteredMenuItems.length === 0 ? (
                    <div className="text-center py-16 space-y-4">
                      <p className="text-[#EDEAE3]/50 text-sm font-mono">No items found matching search parameters.</p>
                      <button 
                        onClick={() => { setMenuSearch(''); setActiveMenuCategory('all'); }} 
                        className="text-xs uppercase tracking-widest text-[#C9A24B] underline"
                      >
                        Reset Search Filters
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {filteredMenuItems.map(item => {
                        const isInCart = cart.some(c => c.item.id === item.id);
                        const cartQuantity = cart.find(c => c.item.id === item.id)?.quantity || 0;

                        return (
                          <div 
                            key={item.id}
                            className="bg-[#121212] border border-amber-500/5 rounded p-6 flex flex-col justify-between hover:border-amber-500/20 transition-all duration-300 relative group shadow-lg"
                          >
                            <div className="space-y-3">
                              <div className="flex justify-between items-start gap-4">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <h3 className="font-serif text-xl text-white group-hover:text-[#C9A24B] transition-colors font-medium">{item.name}</h3>
                                    {item.tag && (
                                      <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[9px] tracking-wider uppercase px-1.5 py-0.5 rounded">
                                        {item.tag}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-amber-500/70 font-mono capitalize">{item.category.replace('-', ' ')}</p>
                                </div>
                              </div>
                              <p className="text-xs text-[#EDEAE3]/70 leading-relaxed font-light">
                                {item.description}
                              </p>
                            </div>

                            {/* Menu Item Footer */}
                            <div className="pt-4 mt-4 border-t border-amber-500/5 flex items-center justify-between text-[10px] text-[#EDEAE3]/40 font-mono">
                              <span>ITEM: {item.id.toUpperCase()}</span>
                              <span className="text-amber-500/50">AVAILABLE AT THE LOUNGE</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* PAIRING CONCEPT BANNER */}
                <div className="bg-[#181818] rounded border border-amber-500/10 p-8 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#801418]/5 rounded-full blur-3xl pointer-events-none"></div>
                  <div className="space-y-3">
                    <span className="text-xs uppercase tracking-[0.3em] text-amber-500 font-mono block">The Chef Special Program</span>
                    <h3 className="font-serif text-2xl text-white font-medium">Need a Bespoke Pairing?</h3>
                    <p className="text-[#EDEAE3]/70 text-xs max-w-2xl leading-relaxed">
                      Our in-house culinary developers can customize the spice matrices, spirit bases, and flavor curves for private tables of 4 or more. Speak with your Table Captain to organize your custom menu experience.
                    </p>
                  </div>
                  <button 
                    onClick={() => setCurrentPage('contact')}
                    className="border border-[#C9A24B] text-[#C9A24B] hover:bg-[#C9A24B] hover:text-black px-6 py-3 rounded text-xs uppercase tracking-widest font-mono font-bold transition-colors shrink-0"
                  >
                    Reserve Table Now
                  </button>
                </div>

              </div>
            )}

            {/* GALLERY PAGE */}
            {currentPage === 'gallery' && (
              <div id="gallery-view" className="space-y-12 max-w-7xl mx-auto px-4 md:px-8 py-8">
                
                {/* HERO Header */}
                <div className="text-center space-y-4 max-w-2xl mx-auto py-8">
                  <span className="text-xs uppercase tracking-[0.4em] text-amber-500 font-mono block">[ AMBIENCE & CAPTURES ]</span>
                  <h1 className="font-serif text-4xl md:text-6xl text-white font-medium">Captured Atmosphere</h1>
                  <p className="text-sm md:text-base text-[#EDEAE3]/80 leading-relaxed font-light">
                    An authentic look inside the venue. Intimate environments, curated dining, and beautiful memories captured directly at Admin Ibadan.
                  </p>
                </div>

                {/* CATEGORY SWITCHERS */}
                <div className="flex justify-center gap-2 border-b border-amber-500/10 pb-6">
                  {(['all', 'space', 'drinks', 'vibes'] as const).map(tab => (
                    <button 
                      key={tab}
                      id={`gallery-tab-${tab}`}
                      onClick={() => setActiveGalleryTab(tab)}
                      className={`px-4 py-2 rounded text-xs uppercase tracking-widest font-mono transition-all cursor-pointer ${
                        activeGalleryTab === tab 
                          ? 'bg-[#801418] text-white border border-amber-500/20' 
                          : 'bg-[#121212] border border-amber-500/5 text-[#EDEAE3]/70 hover:border-amber-500/10 hover:text-white'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* BENTO GRID WITH CAPTIONS & ZOOM */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredGallery.map((img, index) => {
                    // Find actual index in original gallery images for correct Lightbox usage
                    const originalIndex = GALLERY_IMAGES.findIndex(g => g.id === img.id);
                    return (
                      <div 
                        key={img.id}
                        onClick={() => setLightboxIndex(originalIndex !== -1 ? originalIndex : 0)}
                        className="group relative h-72 rounded overflow-hidden cursor-pointer border border-amber-500/5 shadow-lg bg-[#121212]"
                      >
                        <img 
                          src={img.url} 
                          alt={img.caption} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-350 flex flex-col justify-end p-6">
                          <span className="text-[10px] font-mono text-amber-500 uppercase tracking-widest mb-1">{img.category}</span>
                          <h4 className="font-serif text-base text-white">{img.caption}</h4>
                          <span className="text-[10px] font-mono text-[#EDEAE3]/40 mt-2 block">TAP TO FULLSCREEN LIGHTBOX</span>
                        </div>
                        {/* Shimmering gold hairline on hover */}
                        <div className="absolute inset-0 border border-amber-500/0 group-hover:border-amber-500/20 transition-all duration-300 rounded"></div>
                      </div>
                    );
                  })}
                </div>

                {/* Touch interaction tip */}
                <p className="text-center text-xs text-[#EDEAE3]/40 font-mono">
                  [ Click or tap any capture to trigger interactive full-screen sensory view ]
                </p>

              </div>
            )}

            {/* CONTACT & BOOKING PAGE */}
            {currentPage === 'contact' && (
              <div id="contact-view" className="space-y-12 max-w-7xl mx-auto px-4 md:px-8 py-8">
                
                {/* HERO Header */}
                <div className="text-center space-y-4 max-w-2xl mx-auto py-8">
                  <span className="text-xs uppercase tracking-[0.4em] text-amber-500 font-mono block">[ RESERVATIONS ]</span>
                  <h1 className="font-serif text-4xl md:text-6xl text-white font-medium">Table Reservations</h1>
                  <p className="text-sm md:text-base text-[#EDEAE3]/80 leading-relaxed font-light">
                    Request a table placement or VIP study room. Walk-ins are subject to capacity and dress code compliance.
                  </p>
                </div>

                {/* BOOKING SUCCESS CARD / MODAL TICKET */}
                {showBookingSuccess && recentReservation && (
                  <motion.div 
                    id="booking-ticket-modal"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="max-w-xl mx-auto bg-[#181818] rounded-lg border border-[#C9A24B] p-8 space-y-6 shadow-2xl relative overflow-hidden"
                  >
                    {/* Gold shimmer glow background */}
                    <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#C9A24B]/10 rounded-full blur-2xl"></div>
                    
                    <div className="text-center space-y-2">
                      <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-500">
                        <Check className="w-6 h-6 stroke-[3]" />
                      </div>
                      <span className="text-xs uppercase tracking-widest text-[#C9A24B] font-mono font-bold block">RESERVATION CONFIRMED</span>
                      <h2 className="font-serif text-2xl text-white font-medium">Reservation Successful</h2>
                    </div>

                    {/* Premium Ticket Receipt */}
                    <div className="border border-dashed border-amber-500/20 rounded p-5 bg-black/40 space-y-4 font-mono text-xs">
                      <div className="flex justify-between border-b border-amber-500/10 pb-2.5">
                        <span className="text-[#EDEAE3]/50">RESERVATION ID</span>
                        <span className="text-[#C9A24B] font-bold">{recentReservation.id}</span>
                      </div>
                      <div className="flex justify-between border-b border-amber-500/10 pb-2.5">
                        <span className="text-[#EDEAE3]/50">GUEST NAME</span>
                        <span className="text-white font-bold">{recentReservation.name}</span>
                      </div>
                      <div className="flex justify-between border-b border-amber-500/10 pb-2.5">
                        <span className="text-[#EDEAE3]/50">DATE & TIME</span>
                        <span className="text-white font-bold">{recentReservation.date} @ {recentReservation.time}</span>
                      </div>
                      <div className="flex justify-between border-b border-amber-500/10 pb-2.5">
                        <span className="text-[#EDEAE3]/50">GUESTS</span>
                        <span className="text-white font-bold">{recentReservation.guests} Pax</span>
                      </div>
                      <div className="flex justify-between border-b border-amber-500/10 pb-2.5">
                        <span className="text-[#EDEAE3]/50">ZONE SELECTION</span>
                        <span className="text-amber-500 font-bold">{recentReservation.section}</span>
                      </div>
                      {recentReservation.requests && (
                        <div className="space-y-1">
                          <span className="text-[#EDEAE3]/50 block">SPECIAL REQUESTS</span>
                          <span className="text-white block italic">"{recentReservation.requests}"</span>
                        </div>
                      )}
                    </div>

                    <p className="text-[11px] text-[#EDEAE3]/60 text-center leading-relaxed">
                      Your reservation details have been saved. Please present this details to our reservation desk upon arrival.
                    </p>

                    <div className="flex gap-3">
                      <button 
                        id="share-ticket-btn"
                        onClick={() => handleShareReservation(recentReservation)}
                        className="flex-1 px-4 py-2.5 border border-[#C9A24B] text-[#C9A24B] rounded hover:bg-white/5 font-mono text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Share2 className="w-4 h-4" /> Share Ticket
                      </button>
                      <button 
                        id="close-ticket-btn"
                        onClick={() => setShowBookingSuccess(false)}
                        className="flex-1 px-4 py-2.5 bg-[#801418] hover:bg-[#a31d22] text-white rounded font-mono text-xs uppercase tracking-widest font-bold flex items-center justify-center cursor-pointer"
                      >
                        Done
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* CONTACT DETAILS & BOOKING FORM GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left panel: Info & Opening Hours */}
                  <div className="lg:col-span-4 space-y-6">
                    
                    {/* Opening Hours card */}
                    <div className="bg-[#121212] border border-amber-500/5 rounded p-6 space-y-4 shadow-lg">
                      <h3 className="font-serif text-xl text-white flex items-center gap-2">
                        <Clock className="w-5 h-5 text-amber-500" /> Opening Hours
                      </h3>
                      <div className="space-y-3 font-mono text-xs border-t border-amber-500/10 pt-4">
                        <div className="flex justify-between text-[#EDEAE3]/80">
                          <span>WEEKDAYS</span>
                          <span className="text-[#C9A24B]">5:00 PM – Late</span>
                        </div>
                        <div className="flex justify-between text-[#EDEAE3]/80">
                          <span>FRIDAYS</span>
                          <span className="text-[#C9A24B]">5:00 PM – 5:00 AM</span>
                        </div>
                        <div className="flex justify-between text-[#EDEAE3]/80">
                          <span>SATURDAYS</span>
                          <span className="text-[#C9A24B]">5:00 PM – Sunrise</span>
                        </div>
                        <div className="flex justify-between text-[#EDEAE3]/80">
                          <span>SUNDAYS</span>
                          <span className="text-[#C9A24B]">4:00 PM – Midnight</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-[#EDEAE3]/40 font-mono italic">
                        *Strict Dress Code after 8 PM: Sharp, Upscale, avant-garde. No slides, shorts, or sports apparel permitted.
                      </p>
                    </div>

                    {/* Quick Contacts */}
                    <div className="bg-[#121212] border border-amber-500/5 rounded p-6 space-y-4 shadow-lg">
                      <h3 className="font-serif text-xl text-white">Direct Line</h3>
                      <div className="space-y-3 font-mono text-xs border-t border-amber-500/10 pt-4">
                        <a href="tel:+2349122332703" className="flex items-center gap-3 text-[#EDEAE3]/80 hover:text-[#C9A24B] py-1">
                          <Phone className="w-4 h-4 text-[#801418]" />
                          <span>+234 912 233 2703</span>
                        </a>
                        <a href="mailto:info@adminibadan.com" className="flex items-center gap-3 text-[#EDEAE3]/80 hover:text-[#C9A24B] py-1">
                          <Mail className="w-4 h-4 text-[#801418]" />
                          <span>info@adminibadan.com</span>
                        </a>
                        <div className="flex items-start gap-3 text-[#EDEAE3]/80 py-1">
                          <MapPin className="w-4 h-4 text-[#801418] mt-0.5 shrink-0" />
                          <span>Inside Energy Filling Station, Liberty Junction, Ring Road, Ibadan</span>
                        </div>
                      </div>
                    </div>

                    {/* Saved reservations tab */}
                    {reservations.length > 0 && (
                      <div className="bg-[#121212] border border-amber-500/5 rounded p-6 space-y-4 shadow-lg max-h-[250px] overflow-y-auto">
                        <h3 className="font-serif text-sm font-bold text-white tracking-widest uppercase flex items-center justify-between">
                          <span>My Reservations</span>
                          <span className="bg-[#801418] text-white text-[9px] px-1.5 py-0.5 rounded font-mono">{reservations.length}</span>
                        </h3>
                        <div className="space-y-3 border-t border-amber-500/10 pt-4 font-mono text-[10px]">
                          {reservations.map(res => (
                            <div key={res.id} className="p-3 bg-black/40 rounded border border-amber-500/10 space-y-2">
                              <div className="flex justify-between font-bold">
                                <span className="text-[#C9A24B]">{res.id}</span>
                                <span className="text-white">{res.guests} Pax</span>
                              </div>
                              <p className="text-white/80">{res.date} @ {res.time}</p>
                              <div className="flex gap-2 pt-1 border-t border-amber-500/5">
                                <button 
                                  onClick={() => handleShareReservation(res)}
                                  className="text-[9px] text-[#C9A24B] underline"
                                >
                                  Share details
                                </button>
                                <span className="text-white/20">|</span>
                                <button 
                                  onClick={() => cancelReservation(res.id)}
                                  className="text-[9px] text-red-500 hover:underline cursor-pointer"
                                >
                                  Cancel Booking
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>

                  {/* Right panel: Request Form */}
                  <div className="lg:col-span-8 bg-[#121212] border border-amber-500/10 rounded-lg p-6 md:p-10 shadow-xl space-y-6">
                    <div className="space-y-1">
                      <h3 className="font-serif text-2xl text-white font-medium">Table Booking Form</h3>
                      <p className="text-xs text-[#EDEAE3]/60 font-light">Submit your details below; our reservation captain will confirm details within 15 minutes.</p>
                    </div>

                    <form onSubmit={handleBookingSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name */}
                        <div className="space-y-2">
                          <label className="block text-[11px] uppercase tracking-widest font-mono text-[#EDEAE3]/70">Full Name *</label>
                          <input 
                            id="form-name"
                            type="text" 
                            required
                            value={bookingName}
                            onChange={(e) => setBookingName(e.target.value)}
                            placeholder="e.g. Folarin Wahab" 
                            className="w-full bg-[#181818] border border-amber-500/5 rounded px-4 py-3 text-sm text-white focus:border-amber-500/30 focus:outline-none"
                          />
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                          <label className="block text-[11px] uppercase tracking-widest font-mono text-[#EDEAE3]/70">Email Address *</label>
                          <input 
                            id="form-email"
                            type="email" 
                            required
                            value={bookingEmail}
                            onChange={(e) => setBookingEmail(e.target.value)}
                            placeholder="e.g. folarin@wahab.com" 
                            className="w-full bg-[#181818] border border-amber-500/5 rounded px-4 py-3 text-sm text-white focus:border-amber-500/30 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Phone */}
                        <div className="space-y-2">
                          <label className="block text-[11px] uppercase tracking-widest font-mono text-[#EDEAE3]/70">Phone Number (WhatsApp Preferred) *</label>
                          <input 
                            id="form-phone"
                            type="tel" 
                            required
                            value={bookingPhone}
                            onChange={(e) => setBookingPhone(e.target.value)}
                            placeholder="e.g. +234 80 1234 5678" 
                            className="w-full bg-[#181818] border border-amber-500/5 rounded px-4 py-3 text-sm text-white focus:border-amber-500/30 focus:outline-none"
                          />
                        </div>

                        {/* Guests count */}
                        <div className="space-y-2">
                          <label className="block text-[11px] uppercase tracking-widest font-mono text-[#EDEAE3]/70">Guests count *</label>
                          <select 
                            id="form-guests"
                            value={bookingGuests}
                            onChange={(e) => setBookingGuests(parseInt(e.target.value))}
                            className="w-full bg-[#181818] border border-amber-500/5 rounded px-4 py-3 text-sm text-white focus:border-amber-500/30 focus:outline-none"
                          >
                            <option value="1">1 Person (Bar Counter)</option>
                            <option value="2">2 People (Standard Cozy Booth)</option>
                            <option value="4">4 People (Classic Table Placement)</option>
                            <option value="6">6 People (Executive Seating)</option>
                            <option value="10">10+ People (The VIP Study)</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Date */}
                        <div className="space-y-2">
                          <label className="block text-[11px] uppercase tracking-widest font-mono text-[#EDEAE3]/70">Reservation Date *</label>
                          <input 
                            id="form-date"
                            type="date" 
                            required
                            value={bookingDate}
                            onChange={(e) => setBookingDate(e.target.value)}
                            className="w-full bg-[#181818] border border-amber-500/5 rounded px-4 py-3 text-sm text-white focus:border-amber-500/30 focus:outline-none"
                          />
                        </div>

                        {/* Time */}
                        <div className="space-y-2">
                          <label className="block text-[11px] uppercase tracking-widest font-mono text-[#EDEAE3]/70">Reservation Time *</label>
                          <select 
                            id="form-time"
                            value={bookingTime}
                            onChange={(e) => setBookingTime(e.target.value)}
                            className="w-full bg-[#181818] border border-amber-500/5 rounded px-4 py-3 text-sm text-white focus:border-amber-500/30 focus:outline-none"
                          >
                            <option value="17:00">5:00 PM (Opening Hour)</option>
                            <option value="18:30">6:30 PM (Mid prelude)</option>
                            <option value="20:00">8:00 PM (Peak Program)</option>
                            <option value="22:00">10:00 PM (Late Shift)</option>
                            <option value="00:00">12:00 AM (Sunrise Circle)</option>
                          </select>
                        </div>

                        {/* Preferred Zone */}
                        <div className="space-y-2">
                          <label className="block text-[11px] uppercase tracking-widest font-mono text-[#EDEAE3]/70">Zone Preference *</label>
                          <select 
                            id="form-section"
                            value={bookingSection}
                            onChange={(e) => setBookingSection(e.target.value)}
                            className="w-full bg-[#181818] border border-amber-500/5 rounded px-4 py-3 text-sm text-white focus:border-amber-500/30 focus:outline-none"
                          >
                            <option value="The Brass Bar">The Brass Bar (Near Mixology)</option>
                            <option value="The Founder's Suite">The Founder's Suite (Cozy Comfort)</option>
                            <option value="The VIP Study">The VIP Study (Private Room)</option>
                          </select>
                        </div>
                      </div>

                      {/* Special Notes */}
                      <div className="space-y-2">
                        <label className="block text-[11px] uppercase tracking-widest font-mono text-[#EDEAE3]/70">Special Requests / Occasions</label>
                        <textarea 
                          id="form-requests"
                          rows={3}
                          value={bookingRequests}
                          onChange={(e) => setBookingRequests(e.target.value)}
                          placeholder="e.g. Birthday setup, specific single malt preferences, or extreme privacy requirements..." 
                          className="w-full bg-[#181818] border border-amber-500/5 rounded px-4 py-3 text-sm text-white placeholder-white/20 focus:border-amber-500/30 focus:outline-none"
                        ></textarea>
                      </div>

                      {/* Submit */}
                      <button 
                        id="form-submit-btn"
                        type="submit"
                        className="w-full py-4 bg-[#C9A24B] hover:bg-[#b08c3d] text-black font-serif uppercase tracking-widest text-xs font-bold rounded transition-colors cursor-pointer"
                      >
                        Confirm Table Booking
                      </button>
                    </form>
                  </div>

                </div>

              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </main>

      {/* FOOTER (Consistent on all pages) */}
      <footer id="app-footer" className="mt-20 border-t border-amber-500/10 bg-[#0A0A0A] pt-16 pb-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[0.5px] bg-gradient-to-r from-transparent via-amber-500/20 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-12 gap-10">
          
          {/* Col 1: Wordmark */}
          <div className="md:col-span-5 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded border border-amber-500/30 bg-black/60 flex items-center justify-center overflow-hidden">
                <img 
                  src={logoImage} 
                  alt="ADMIN Crest" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="font-serif text-lg tracking-[0.2em] uppercase font-bold text-white">ADMIN IBADAN</span>
            </div>
            <p className="text-xs text-[#EDEAE3]/65 max-w-sm leading-relaxed font-light">
              A premium club, lounge, and restaurant experience driving the premium nightlife wave at Ring Road, Ibadan.
            </p>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/adminibadan/" target="_blank" rel="noreferrer" className="p-2 border border-amber-500/10 hover:border-amber-500/30 hover:text-[#C9A24B] text-white/70 rounded transition-colors cursor-pointer" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://www.tiktok.com/@admin_ibadan" target="_blank" rel="noreferrer" className="p-2 border border-amber-500/10 hover:border-amber-500/30 hover:text-[#C9A24B] text-white/70 rounded transition-colors cursor-pointer" aria-label="TikTok">
                <Music className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Useful links */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="font-mono text-xs uppercase tracking-wider text-amber-500/85">Useful Protocol Links</h4>
            <div className="flex flex-col gap-2.5 text-xs text-[#EDEAE3]/80">
              <button onClick={() => setCurrentPage('home')} className="text-left hover:text-[#C9A24B] transition-colors cursor-pointer">Home Landing</button>
              <button onClick={() => setCurrentPage('about')} className="text-left hover:text-[#C9A24B] transition-colors cursor-pointer">About Concept</button>
              <button onClick={() => setCurrentPage('activities')} className="text-left hover:text-[#C9A24B] transition-colors cursor-pointer">Night Activities</button>
              <button onClick={() => setCurrentPage('menu')} className="text-left hover:text-[#C9A24B] transition-colors cursor-pointer">The Formulary Menu</button>
              <button onClick={() => setCurrentPage('gallery')} className="text-left hover:text-[#C9A24B] transition-colors cursor-pointer">Visual Captures</button>
              <button onClick={() => setCurrentPage('contact')} className="text-left hover:text-[#C9A24B] transition-colors cursor-pointer">Table Booking</button>
            </div>
          </div>

          {/* Col 3: Coordinates / Address */}
          <div className="md:col-span-4 space-y-4 font-mono text-xs">
            <h4 className="uppercase tracking-wider text-amber-500/85">HQ Node Coordinates</h4>
            <div className="space-y-3 text-[#EDEAE3]/75">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4.5 h-4.5 text-[#801418] shrink-0" />
                <span>Inside Energy Filling Station, Liberty Junction, Ring Road, Ibadan, Oyo State, NG</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4.5 h-4.5 text-[#801418] shrink-0" />
                <a href="tel:+2349122332703" className="underline hover:text-white">+234 912 233 2703</a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4.5 h-4.5 text-[#801418] shrink-0" />
                <a href="mailto:info@adminibadan.com" className="underline hover:text-white">info@adminibadan.com</a>
              </div>
            </div>

            {/* Newsletter Subscription (Anti-AI slop: humble, literal label, no bloated terminal output larp) */}
            <div className="pt-4 border-t border-amber-500/5 space-y-2">
              <span className="text-[10px] uppercase tracking-wider text-white/55 block">Join Newsletter for exclusive table alerts</span>
              {newsletterSubscribed ? (
                <div className="text-emerald-500 text-[11px] font-bold flex items-center gap-1.5 pt-1.5">
                  <Check className="w-3.5 h-3.5" /> Transmitted! Welcome to the whitelist.
                </div>
              ) : (
                <div className="flex gap-2">
                  <input 
                    id="newsletter-email-input"
                    type="email" 
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter email address" 
                    className="bg-[#121212] border border-amber-500/10 rounded px-2.5 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-amber-500/30 flex-grow"
                  />
                  <button 
                    id="newsletter-submit-btn"
                    onClick={() => {
                      if (newsletterEmail.includes('@')) {
                        setNewsletterSubscribed(true);
                        setNewsletterEmail('');
                      } else {
                        alert('Please input a valid email address.');
                      }
                    }}
                    className="bg-[#801418] hover:bg-[#a31d22] text-white px-3 py-1.5 rounded text-[10px] uppercase tracking-wider font-bold transition-all cursor-pointer"
                  >
                    Join
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 mt-12 pt-8 border-t border-amber-500/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono text-[#EDEAE3]/40">
          <span>&copy; 2026 Admin Ibadan. All Rights Reserved.</span>
          <span className="flex items-center gap-1.5">
            Made with <span className="text-amber-500/80">Admin Ibadan</span> gold program
          </span>
        </div>
      </footer>

      {/* INTERACTIVE DRAWER: ORDER BUILDER / CART */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              id="cart-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black z-50 cursor-pointer"
            />

            {/* Drawer Body */}
            <motion.div 
              id="cart-drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-[#0D0D0D] border-l border-amber-500/15 z-50 p-6 flex flex-col justify-between shadow-2xl"
            >
              {/* Header */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-amber-500/10 pb-4">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-amber-500" />
                    <h3 className="font-serif text-xl text-white font-medium">The Custom Order</h3>
                  </div>
                  <button 
                    id="close-cart-btn"
                    onClick={() => setIsCartOpen(false)}
                    className="p-1.5 hover:bg-white/5 rounded-full text-white/60 hover:text-white"
                  >
                    <X className="w-5.5 h-5.5" />
                  </button>
                </div>
                <p className="text-xs text-[#EDEAE3]/60 leading-relaxed font-light">
                  Build a draft list of your favored cocktails and bites to show our mixologists or table captain, or share with your party. No live transactions are initiated.
                </p>
              </div>

              {/* Items List */}
              <div className="flex-1 my-6 overflow-y-auto pr-1 space-y-4">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                    <ShoppingBag className="w-12 h-12 text-[#EDEAE3]/20 stroke-[1.5]" />
                    <p className="text-xs text-[#EDEAE3]/50 font-mono">Your custom order list is empty.</p>
                    <button 
                      onClick={() => {
                        setIsCartOpen(false);
                        setCurrentPage('menu');
                      }}
                      className="text-xs uppercase tracking-widest text-[#C9A24B] border border-amber-500/30 px-4 py-2 rounded bg-amber-500/5"
                    >
                      Browse Lounge Menu
                    </button>
                  </div>
                ) : (
                  cart.map(c => (
                    <div 
                      key={c.item.id}
                      className="p-4 bg-[#121212] rounded border border-amber-500/5 space-y-3"
                    >
                      <div className="flex justify-between gap-4">
                        <div className="space-y-0.5">
                          <h4 className="font-serif text-sm font-bold text-white">{c.item.name}</h4>
                          <p className="text-[10px] text-amber-500 font-mono">₦{c.item.price.toLocaleString()} each</p>
                        </div>
                        <span className="font-mono text-xs text-white font-bold">
                          ₦{(c.item.price * c.quantity).toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-white/5">
                        <button 
                          onClick={() => removeFromCart(c.item.id)}
                          className="text-xs text-white/30 hover:text-red-500 flex items-center gap-1.5 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Remove
                        </button>
                        
                        <div className="flex items-center gap-2 bg-black/60 border border-amber-500/10 rounded px-2 py-0.5">
                          <button 
                            onClick={() => updateQuantity(c.item.id, -1)}
                            className="p-1 text-white/60 hover:text-white"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-mono font-bold w-4 text-center">{c.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(c.item.id, 1)}
                            className="p-1 text-white/60 hover:text-white"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Tally Summary & Actions */}
              {cart.length > 0 && (
                <div className="border-t border-amber-500/15 pt-4 space-y-4 font-mono">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[#EDEAE3]/50 uppercase tracking-wider">TALLY TOTAL</span>
                    <span className="text-lg text-[#C9A24B] font-bold font-serif">
                      ₦{getCartTotal().toLocaleString()}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      id="clear-order-btn"
                      onClick={clearCart}
                      className="flex-1 border border-red-500/30 hover:bg-red-500/10 text-red-500 py-3 rounded text-[11px] uppercase tracking-widest font-bold transition-all cursor-pointer"
                    >
                      Clear List
                    </button>
                    <button 
                      id="export-order-btn"
                      onClick={handleExportOrder}
                      className="flex-[2] bg-[#801418] hover:bg-[#a31d22] text-white py-3 rounded text-[11px] uppercase tracking-widest font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Share2 className="w-4 h-4" /> Copy Draft list
                    </button>
                  </div>
                  
                  <p className="text-[10px] text-center text-white/30 leading-relaxed">
                    [ Copy draft order to share with your reservation group or table captain ]
                  </p>
                </div>
              )}

            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* FULLSCREEN TOUCH-FRIENDLY LIGHTBOX */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div 
            id="lightbox-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/98 z-[9999] flex flex-col justify-between p-4 md:p-8"
          >
            {/* Header: counter + close */}
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-amber-500 tracking-widest">
                [ CAPTURE {lightboxIndex + 1} OF {GALLERY_IMAGES.length} ]
              </span>
              <button 
                id="close-lightbox-btn"
                onClick={() => setLightboxIndex(null)}
                className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Close Lightbox"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Img Stage with navigation anchors */}
            <div className="flex-1 flex items-center justify-between relative max-w-5xl mx-auto w-full">
              {/* Prev Button */}
              <button 
                id="prev-lightbox-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex(prev => prev !== null ? (prev - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length : 0);
                }}
                className="absolute left-2 md:-left-12 p-3 rounded-full bg-black/50 border border-amber-500/10 hover:border-amber-500/30 text-white cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center z-10"
                aria-label="Previous Image"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>

              {/* Actual Image container with caption */}
              <div className="w-full flex flex-col items-center justify-center px-6">
                <img 
                  src={GALLERY_IMAGES[lightboxIndex].url} 
                  alt={GALLERY_IMAGES[lightboxIndex].caption} 
                  className="max-h-[65vh] md:max-h-[75vh] object-contain rounded border border-amber-500/15"
                />
                
                <div className="text-center mt-6 max-w-xl space-y-1">
                  <span className="text-[10px] font-mono text-amber-500 uppercase tracking-widest block">
                    {GALLERY_IMAGES[lightboxIndex].category}
                  </span>
                  <p className="font-serif text-base text-white">{GALLERY_IMAGES[lightboxIndex].caption}</p>
                </div>
              </div>

              {/* Next Button */}
              <button 
                id="next-lightbox-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex(prev => prev !== null ? (prev + 1) % GALLERY_IMAGES.length : 0);
                }}
                className="absolute right-2 md:-right-12 p-3 rounded-full bg-black/50 border border-amber-500/10 hover:border-amber-500/30 text-white cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center z-10"
                aria-label="Next Image"
              >
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>

            {/* Lightbox footer dots selector */}
            <div className="flex justify-center gap-2 pb-4">
              {GALLERY_IMAGES.map((_, idx) => (
                <button 
                  key={idx}
                  onClick={() => setLightboxIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${lightboxIndex === idx ? 'bg-[#C9A24B] w-4' : 'bg-white/20'}`}
                />
              ))}
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
