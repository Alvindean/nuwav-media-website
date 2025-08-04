'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Send, Menu, X, Sun, Moon, ShoppingCart, User, Search, ArrowRight, Star, Quote, CheckCircle, TrendingUp, Headphones, Users, Award, Globe, Zap, Target } from 'lucide-react';

const NuWavMedia = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, text: "Welcome to NU WAV Media! How can we help you today?", sender: "bot", timestamp: new Date() }
  ]);
  const [newMessage, setNewMessage] = useState('');

  // Hero slides data with expanded high-value niches
  const heroSlides = [
    {
      title: "Amplify Your Brand's Voice",
      subtitle: "We create powerful narratives for sports, podcasts, real estate, legal firms, healthcare, and luxury brands",
      background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
      pattern: "radial-gradient(circle at 20% 50%, rgba(255, 215, 0, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)",
      overlay: "linear-gradient(45deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 69, 0, 0.1) 100%)",
      cta: "Discover Our Services"
    },
    {
      title: "Premium Professional Marketing",
      subtitle: "Specialized marketing for law firms, medical practices, financial advisors, and high-end service providers",
      background: "linear-gradient(135deg, #2d1b69 0%, #11998e 100%)",
      pattern: "radial-gradient(circle at 70% 80%, rgba(17, 153, 142, 0.2) 0%, transparent 50%), radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)",
      overlay: "linear-gradient(45deg, rgba(45, 27, 105, 0.2) 0%, rgba(17, 153, 142, 0.2) 100%)",
      cta: "Explore Premium Services"
    },
    {
      title: "Luxury Brand Storytelling",
      subtitle: "Elite marketing solutions for real estate, hospitality, technology, and executive coaching professionals",
      background: "linear-gradient(135deg, #134e5e 0%, #71b280 100%)",
      pattern: "radial-gradient(circle at 40% 70%, rgba(113, 178, 128, 0.3) 0%, transparent 50%), radial-gradient(circle at 60% 20%, rgba(255, 255, 255, 0.15) 0%, transparent 50%)",
      overlay: "linear-gradient(45deg, rgba(19, 78, 94, 0.2) 0%, rgba(113, 178, 128, 0.1) 100%)",
      cta: "View Portfolio"
    }
  ];

  // Enhanced blog posts with high-value niches and SEO interlinking
  const blogPosts = [
    {
      id: 1,
      title: "Luxury Real Estate Marketing: 10 Strategies That Generate $10M+ Listings",
      excerpt: "Discover premium marketing tactics used by top-performing luxury real estate agents to attract high-net-worth clients and close million-dollar deals.",
      author: "Sarah Mitchell",
      date: "2025-01-15",
      readTime: "12 min read",
      background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #ff6b6b 100%)",
      overlay: "linear-gradient(45deg, rgba(30, 60, 114, 0.8) 0%, rgba(255, 107, 107, 0.6) 100%)",
      tags: ["Real Estate Marketing", "Luxury Properties", "Lead Generation"],
      slug: "luxury-real-estate-marketing-strategies-2025",
      metaDescription: "Master luxury real estate marketing with proven strategies from top agents. Learn virtual tours, staging, and high-end client acquisition techniques.",
      relatedPosts: [2, 3],
      internalLinks: ["real-estate-marketing-services", "virtual-property-tours", "luxury-brand-consulting"],
      externalLinks: [
        { text: "National Association of Realtors", url: "https://www.nar.realtor", rel: "nofollow" },
        { text: "Zillow Premier Agent", url: "https://www.zillow.com/premier-agent", rel: "nofollow" },
        { text: "Realtor.com Marketing Center", url: "https://marketing.realtor.com", rel: "nofollow" }
      ]
    },
    {
      id: 2,
      title: "Law Firm SEO: Ethical Marketing That Attracts High-Value Clients",
      excerpt: "Navigate legal marketing ethics while building a powerful online presence that generates qualified leads for your law practice.",
      author: "Attorney Mark Stevens",
      date: "2025-01-05",
      readTime: "14 min read",
      background: "linear-gradient(135deg, #134e5e 0%, #71b280 50%, #ffd89b 100%)",
      overlay: "linear-gradient(45deg, rgba(19, 78, 94, 0.8) 0%, rgba(255, 216, 155, 0.6) 100%)",
      tags: ["Legal Marketing", "Law Firm SEO", "Attorney Ethics"],
      slug: "law-firm-seo-ethical-marketing-guide",
      metaDescription: "Master ethical law firm SEO strategies. Learn compliant content marketing, local search optimization, and client acquisition for attorneys.",
      relatedPosts: [1, 3],
      internalLinks: ["legal-marketing-services", "law-firm-seo", "attorney-content-marketing"],
      externalLinks: [
        { text: "American Bar Association Marketing Rules", url: "https://www.americanbar.org", rel: "nofollow" },
        { text: "Martindale-Hubbell", url: "https://www.martindale.com", rel: "nofollow" },
        { text: "Avvo Legal Marketing", url: "https://www.avvo.com", rel: "nofollow" }
      ]
    },
    {
      id: 3,
      title: "Healthcare Marketing: HIPAA-Compliant Patient Acquisition Strategies",
      excerpt: "Learn HIPAA-compliant marketing strategies that help medical practices attract new patients while maintaining regulatory compliance.",
      author: "Dr. Jennifer Walsh",
      date: "2025-01-03",
      readTime: "11 min read",
      background: "linear-gradient(135deg, #2d1b69 0%, #11998e 50%, #38ef7d 100%)",
      overlay: "linear-gradient(45deg, rgba(45, 27, 105, 0.8) 0%, rgba(56, 239, 125, 0.6) 100%)",
      tags: ["Healthcare Marketing", "HIPAA Compliance", "Patient Acquisition"],
      slug: "healthcare-marketing-patient-acquisition-hipaa",
      metaDescription: "Discover HIPAA-compliant healthcare marketing strategies. Learn patient acquisition, medical SEO, and compliant digital marketing for practices.",
      relatedPosts: [1, 2],
      internalLinks: ["healthcare-marketing-services", "patient-acquisition", "medical-seo"],
      externalLinks: [
        { text: "HIPAA Journal", url: "https://www.hipaajournal.com", rel: "nofollow" },
        { text: "Healthcare Marketing Association", url: "https://www.healthcaremarketingassociation.org", rel: "nofollow" },
        { text: "Medical Marketing Compliance", url: "https://www.medicalmarketingcompliance.com", rel: "nofollow" }
      ]
    }
  ];

  // Navigation items
  const navItems = [
    { name: 'Home', id: 'home' },
    { name: 'Stories', id: 'stories' },
    { name: 'Works', id: 'works' },
    { name: 'Pages', id: 'pages' },
    { name: 'Contact', id: 'contact' },
    { name: 'Shop', id: 'shop' },
    { name: 'Blog', id: 'blog' }
  ];

  // Auto-advance hero slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  // Handle chat message send
  const sendMessage = () => {
    if (newMessage.trim()) {
      const userMessage = {
        id: Date.now(),
        text: newMessage,
        sender: "user",
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, userMessage]);
      
      // Simulate bot response
      setTimeout(() => {
        const botResponse = {
          id: Date.now() + 1,
          text: "Thanks for your message! Our team will get back to you shortly. In the meantime, feel free to explore our services and blog.",
          sender: "bot",
          timestamp: new Date()
        };
        setChatMessages(prev => [...prev, botResponse]);
      }, 1000);
      
      setNewMessage('');
    }
  };

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${darkMode ? 'bg-gray-900/95 backdrop-blur-sm' : 'bg-white/95 backdrop-blur-sm'} border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  NU WAV Media
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      activeSection === item.id
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                        : darkMode
                        ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Right side icons */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                }`}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              
              <button className={`p-2 rounded-lg transition-colors duration-200 ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
                <Search className="w-5 h-5" />
              </button>
              
              <button className={`p-2 rounded-lg transition-colors duration-200 ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
                <ShoppingCart className="w-5 h-5" />
              </button>
              
              <button className={`p-2 rounded-lg transition-colors duration-200 ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
                <User className="w-5 h-5" />
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className={`md:hidden ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border-t`}>
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                    activeSection === item.id
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : darkMode
                      ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="pt-16">
        {/* Hero Section */}
        {activeSection === 'home' && (
          <section className="relative h-screen overflow-hidden">
            {heroSlides.map((slide, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
                style={{
                  background: slide.background,
                  backgroundImage: `${slide.pattern}, ${slide.overlay}`
                }}
              >
                {/* Enhanced animated particles overlay */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute w-96 h-96 -top-48 -left-48 bg-gradient-to-r from-yellow-400 to-orange-500 opacity-10 rounded-full animate-pulse blur-xl"></div>
                  <div className="absolute w-64 h-64 top-1/3 -right-32 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-15 rounded-full animate-bounce blur-lg" style={{animationDuration: '3s'}}></div>
                  <div className="absolute w-32 h-32 bottom-1/4 left-1/4 bg-gradient-to-r from-pink-400 to-red-500 opacity-20 rounded-full animate-ping blur-md" style={{animationDuration: '4s'}}></div>
                  <div className="absolute w-48 h-48 top-1/4 left-1/3 bg-gradient-to-r from-green-400 to-emerald-500 opacity-8 rounded-full animate-pulse blur-2xl" style={{animationDuration: '6s'}}></div>
                </div>
                
                <div className="relative z-10 flex items-center justify-center h-full text-center text-white">
                  <div className="max-w-4xl mx-auto px-4">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
                      {slide.title}
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 animate-fade-in-delay opacity-90">
                      {slide.subtitle}
                    </p>
                    <button className="bg-black/30 backdrop-blur-md hover:bg-black/40 border-2 border-white/50 hover:border-yellow-400/70 text-white px-8 py-4 rounded-full text-lg font-bold transition-all duration-300 transform hover:scale-105 animate-fade-in-delay-2 shadow-2xl hover:shadow-yellow-400/20">
                      {slide.cta} <ArrowRight className="inline-block ml-2 w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Slider Controls */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/80 hover:text-white bg-white/20 backdrop-blur-sm rounded-full p-2 transition-all duration-200 hover:bg-white/30"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/80 hover:text-white bg-white/20 backdrop-blur-sm rounded-full p-2 transition-all duration-200 hover:bg-white/30"
            >
              <ChevronRight className="w-8 h-8" />
            </button>

            {/* Slider Indicators */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === currentSlide ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'
                  }`}
                />
              ))}
            </div>
          </section>
        )}

        {/* Services Section */}
        {activeSection === 'home' && (
          <section className={`py-20 relative overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
            {/* Background Pattern with higher contrast */}
            <div className="absolute inset-0 opacity-10">
              <div 
                className="absolute top-0 left-0 w-full h-full" 
                style={{
                  backgroundImage: `radial-gradient(circle at 25% 25%, ${darkMode ? '#fbbf24' : '#f59e0b'} 3px, transparent 3px), radial-gradient(circle at 75% 75%, ${darkMode ? '#3b82f6' : '#1d4ed8'} 3px, transparent 3px)`,
                  backgroundSize: '60px 60px'
                }}
              >
              </div>
            </div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-4">Premium Industry Solutions</h2>
                <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                  Specialized marketing expertise for high-value industries and professional services
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className={`p-8 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl relative overflow-hidden border-2 ${darkMode ? 'bg-gray-900 border-yellow-500/20 hover:border-yellow-500/40' : 'bg-white shadow-lg border-blue-500/20 hover:border-blue-500/40'}`}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-400/30 to-orange-500/30 rounded-full -translate-y-8 translate-x-8"></div>
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full flex items-center justify-center mb-6 relative z-10 shadow-lg">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 relative z-10 text-gray-900 dark:text-white">Real Estate Marketing</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 relative z-10 font-medium">
                    Premium marketing solutions for luxury real estate agents, brokerages, and property developers.
                  </p>
                  <ul className="space-y-2 relative z-10">
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-emerald-500 mr-2" />
                      <span className="text-gray-700 dark:text-gray-200 font-medium">Regulatory Compliance</span>
                    </li>
                  </ul>
                </div>

                <div className={`p-8 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl relative overflow-hidden border-2 ${darkMode ? 'bg-gray-900 border-amber-500/20 hover:border-amber-500/40' : 'bg-white shadow-lg border-amber-500/20 hover:border-amber-500/40'}`}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-400/30 to-orange-500/30 rounded-full -translate-y-8 translate-x-8"></div>
                  <div className="w-16 h-16 bg-gradient-to-r from-amber-600 to-orange-500 rounded-full flex items-center justify-center mb-6 relative z-10 shadow-lg">
                    <Star className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 relative z-10 text-gray-900 dark:text-white">Luxury Hospitality</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 relative z-10 font-medium">
                    Premium marketing for luxury hotels, resorts, restaurants, and hospitality brands.
                  </p>
                  <ul className="space-y-2 relative z-10">
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-emerald-500 mr-2" />
                      <span className="text-gray-700 dark:text-gray-200 font-medium">Experience Marketing</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-emerald-500 mr-2" />
                      <span className="text-gray-700 dark:text-gray-200 font-medium">Luxury Brand Storytelling</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-emerald-500 mr-2" />
                      <span className="text-gray-700 dark:text-gray-200 font-medium">VIP Customer Journey</span>
                    </li>
                  </ul>
                </div>

                <div className={`p-8 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl relative overflow-hidden border-2 ${darkMode ? 'bg-gray-900 border-violet-500/20 hover:border-violet-500/40' : 'bg-white shadow-lg border-violet-500/20 hover:border-violet-500/40'}`}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-violet-400/30 to-purple-500/30 rounded-full -translate-y-8 translate-x-8"></div>
                  <div className="w-16 h-16 bg-gradient-to-r from-violet-600 to-purple-500 rounded-full flex items-center justify-center mb-6 relative z-10 shadow-lg">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 relative z-10 text-gray-900 dark:text-white">Executive Coaching</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 relative z-10 font-medium">
                    Authority building and thought leadership for executive coaches, consultants, and business leaders.
                  </p>
                  <ul className="space-y-2 relative z-10">
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-emerald-500 mr-2" />
                      <span className="text-gray-700 dark:text-gray-200 font-medium">Thought Leadership</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-emerald-500 mr-2" />
                      <span className="text-gray-700 dark:text-gray-200 font-medium">Speaking Opportunities</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-emerald-500 mr-2" />
                      <span className="text-gray-700 dark:text-gray-200 font-medium">Executive Branding</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Blog Section */}
        {activeSection === 'blog' && (
          <section className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h1 className="text-4xl font-bold mb-4">Latest Insights</h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                  Expert insights on sports marketing, podcast production, and small business growth
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogPosts.map((post) => (
                  <article
                    key={post.id}
                    className={`rounded-2xl overflow-hidden transition-transform duration-300 hover:scale-105 ${
                      darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-lg'
                    }`}
                  >
                    <div 
                      className="aspect-video overflow-hidden relative flex items-center justify-center"
                      style={{ 
                        background: post.background,
                        backgroundImage: post.overlay
                      }}
                    >
                      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                      <div className="relative z-10 text-white text-center p-6">
                        <h3 className="text-lg font-bold mb-2 line-clamp-2 drop-shadow-lg">{post.title}</h3>
                        <div className="w-16 h-1 bg-white rounded-full mx-auto shadow-lg"></div>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                        <span>{post.author}</span>
                        <span className="mx-2">•</span>
                        <span>{post.date}</span>
                        <span className="mx-2">•</span>
                        <span>{post.readTime}</span>
                      </div>
                      <h2 className="text-xl font-bold mb-3 line-clamp-2">{post.title}</h2>
                      <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 text-xs font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center">
                          Read More <ArrowRight className="ml-2 w-4 h-4" />
                        </button>
                        <div className="flex space-x-2">
                          {post.internalLinks && post.internalLinks.slice(0, 2).map((link, index) => (
                            <a
                              key={index}
                              href={`/${link}`}
                              className="text-xs text-gray-500 hover:text-blue-600 transition-colors duration-200"
                            >
                              Related →
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Contact Section */}
        {activeSection === 'contact' && (
          <section className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h1 className="text-4xl font-bold mb-4">Get In Touch</h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                  Ready to amplify your brand's voice? Let's discuss your next project.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div>
                  <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                  <div className="space-y-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mr-4">
                        <Globe className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Website</h3>
                        <p className="text-gray-600 dark:text-gray-400">nuwavmedia.com</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mr-4">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Social Media</h3>
                        <p className="text-gray-600 dark:text-gray-400">Follow us on all platforms</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`p-8 rounded-2xl ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50'}`}>
                  <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Name</label>
                      <input
                        type="text"
                        className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 ${
                          darkMode
                            ? 'bg-gray-900 border-gray-600 focus:border-blue-500'
                            : 'bg-white border-gray-300 focus:border-blue-500'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20`}
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <input
                        type="email"
                        className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 ${
                          darkMode
                            ? 'bg-gray-900 border-gray-600 focus:border-blue-500'
                            : 'bg-white border-gray-300 focus:border-blue-500'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20`}
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Message</label>
                      <textarea
                        rows={4}
                        className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 ${
                          darkMode
                            ? 'bg-gray-900 border-gray-600 focus:border-blue-500'
                            : 'bg-white border-gray-300 focus:border-blue-500'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20`}
                        placeholder="Tell us about your project..."
                      />
                    </div>
                    <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105">
                      Send Message
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Shop Section */}
        {activeSection === 'shop' && (
          <section className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h1 className="text-4xl font-bold mb-4">Media Products</h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                  Professional tools and resources to elevate your media presence
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div
                    key={item}
                    className={`rounded-2xl overflow-hidden transition-transform duration-300 hover:scale-105 ${
                      darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-lg'
                    }`}
                  >
                    <div 
                      className="aspect-square flex items-center justify-center relative overflow-hidden"
                      style={{
                        background: item % 3 === 0 
                          ? 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #ff6b6b 100%)'
                          : item % 3 === 1
                          ? 'linear-gradient(135deg, #2d1b69 0%, #11998e 50%, #38ef7d 100%)'
                          : 'linear-gradient(135deg, #134e5e 0%, #71b280 50%, #ffd89b 100%)'
                      }}
                    >
                      <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                      <Award className="w-16 h-16 text-white relative z-10 drop-shadow-lg" />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Media Product {item}</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4 font-medium">
                        Professional media tool for enhanced productivity and quality.
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">$99</span>
                        <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Real-time Chat Widget */}
      <div className="fixed bottom-4 right-4 z-50">
        {!chatOpen && (
          <button
            onClick={() => setChatOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110"
          >
            <Send className="w-6 h-6" />
          </button>
        )}

        {chatOpen && (
          <div className={`w-80 h-96 rounded-2xl shadow-2xl transition-all duration-300 ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          }`}>
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold">Chat with NU WAV</h3>
              <button
                onClick={() => setChatOpen(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="h-64 p-4 overflow-y-auto space-y-3">
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs p-3 rounded-2xl ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                        : darkMode
                        ? 'bg-gray-700 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type your message..."
                  className={`flex-1 px-3 py-2 rounded-lg border transition-colors duration-200 ${
                    darkMode
                      ? 'bg-gray-900 border-gray-600 focus:border-blue-500'
                      : 'bg-white border-gray-300 focus:border-blue-500'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20`}
                />
                <button
                  onClick={sendMessage}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-2 rounded-lg transition-all duration-300"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className={`py-12 ${darkMode ? 'bg-gray-900 border-t border-gray-800' : 'bg-gray-900 text-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white">NU WAV Media</span>
              </div>
              <p className="text-gray-400 mb-4">
                Amplifying your brand's voice through sports, podcasts, and small business marketing.
              </p>
              <div className="flex space-x-4">
                <button className="text-gray-400 hover:text-white transition-colors duration-200">
                  <Globe className="w-5 h-5" />
                </button>
                <button className="text-gray-400 hover:text-white transition-colors duration-200">
                  <Users className="w-5 h-5" />
                </button>
                <button className="text-gray-400 hover:text-white transition-colors duration-200">
                  <Headphones className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Premium Services</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/real-estate-marketing" className="hover:text-white transition-colors duration-200">Real Estate Marketing</a></li>
                <li><a href="/legal-firm-marketing" className="hover:text-white transition-colors duration-200">Legal Firm Marketing</a></li>
                <li><a href="/healthcare-marketing" className="hover:text-white transition-colors duration-200">Healthcare Marketing</a></li>
                <li><a href="/financial-services-marketing" className="hover:text-white transition-colors duration-200">Financial Services</a></li>
                <li><a href="/luxury-hospitality-marketing" className="hover:text-white transition-colors duration-200">Luxury Hospitality</a></li>
                <li><a href="/executive-coaching-marketing" className="hover:text-white transition-colors duration-200">Executive Coaching</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Industry Solutions</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/sports-marketing" className="hover:text-white transition-colors duration-200">Sports Marketing</a></li>
                <li><a href="/podcast-production" className="hover:text-white transition-colors duration-200">Podcast Production</a></li>
                <li><a href="/content-strategy" className="hover:text-white transition-colors duration-200">Content Strategy</a></li>
                <li><a href="/seo-optimization" className="hover:text-white transition-colors duration-200">SEO Optimization</a></li>
                <li><a href="/social-media-marketing" className="hover:text-white transition-colors duration-200">Social Media Marketing</a></li>
                <li><a href="/lead-generation" className="hover:text-white transition-colors duration-200">Lead Generation</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Company & Partners</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/about" className="hover:text-white transition-colors duration-200">About NU WAV Media</a></li>
                <li><a href="/team" className="hover:text-white transition-colors duration-200">Our Team</a></li>
                <li><a href="/careers" className="hover:text-white transition-colors duration-200">Careers</a></li>
                <li><a href="/contact" className="hover:text-white transition-colors duration-200">Contact Us</a></li>
                <li><a href="/privacy-policy" className="hover:text-white transition-colors duration-200">Privacy Policy</a></li>
                <li><a href="/terms-of-service" className="hover:text-white transition-colors duration-200">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 NU WAV Media. All rights reserved. Built with ❤️ for creators and entrepreneurs.</p>
          </div>
        </div>
      </footer>

      {/* Custom CSS for animations */}
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        
        .animate-fade-in-delay {
          animation: fade-in 1s ease-out 0.3s both;
        }
        
        .animate-fade-in-delay-2 {
          animation: fade-in 1s ease-out 0.6s both;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default NuWavMedia; text-emerald-500 mr-2" />
                      <span className="text-gray-700 dark:text-gray-200 font-medium">Virtual Property Tours</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-emerald-500 mr-2" />
                      <span className="text-gray-700 dark:text-gray-200 font-medium">Lead Generation Systems</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-emerald-500 mr-2" />
                      <span className="text-gray-700 dark:text-gray-200 font-medium">Luxury Brand Positioning</span>
                    </li>
                  </ul>
                </div>

                <div className={`p-8 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl relative overflow-hidden border-2 ${darkMode ? 'bg-gray-900 border-purple-500/20 hover:border-purple-500/40' : 'bg-white shadow-lg border-purple-500/20 hover:border-purple-500/40'}`}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/30 to-indigo-500/30 rounded-full -translate-y-8 translate-x-8"></div>
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-indigo-500 rounded-full flex items-center justify-center mb-6 relative z-10 shadow-lg">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 relative z-10 text-gray-900 dark:text-white">Legal Firm Marketing</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 relative z-10 font-medium">
                    Ethical marketing strategies for law firms, attorneys, and legal professionals to build trust and attract clients.
                  </p>
                  <ul className="space-y-2 relative z-10">
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-emerald-500 mr-2" />
                      <span className="text-gray-700 dark:text-gray-200 font-medium">Legal SEO Optimization</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-emerald-500 mr-2" />
                      <span className="text-gray-700 dark:text-gray-200 font-medium">Reputation Management</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-emerald-500 mr-2" />
                      <span className="text-gray-700 dark:text-gray-200 font-medium">Content Marketing</span>
                    </li>
                  </ul>
                </div>

                <div className={`p-8 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl relative overflow-hidden border-2 ${darkMode ? 'bg-gray-900 border-green-500/20 hover:border-green-500/40' : 'bg-white shadow-lg border-emerald-500/20 hover:border-emerald-500/40'}`}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-400/30 to-teal-500/30 rounded-full -translate-y-8 translate-x-8"></div>
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-600 to-teal-500 rounded-full flex items-center justify-center mb-6 relative z-10 shadow-lg">
                    <Headphones className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 relative z-10 text-gray-900 dark:text-white">Healthcare Marketing</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 relative z-10 font-medium">
                    HIPAA-compliant marketing for medical practices, healthcare providers, and wellness brands.
                  </p>
                  <ul className="space-y-2 relative z-10">
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-emerald-500 mr-2" />
                      <span className="text-gray-700 dark:text-gray-200 font-medium">Patient Acquisition</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-emerald-500 mr-2" />
                      <span className="text-gray-700 dark:text-gray-200 font-medium">Medical SEO</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-emerald-500 mr-2" />
                      <span className="text-gray-700 dark:text-gray-200 font-medium">Telehealth Promotion</span>
                    </li>
                  </ul>
                </div>

                <div className={`p-8 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl relative overflow-hidden border-2 ${darkMode ? 'bg-gray-900 border-rose-500/20 hover:border-rose-500/40' : 'bg-white shadow-lg border-rose-500/20 hover:border-rose-500/40'}`}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-rose-400/30 to-pink-500/30 rounded-full -translate-y-8 translate-x-8"></div>
                  <div className="w-16 h-16 bg-gradient-to-r from-rose-600 to-pink-500 rounded-full flex items-center justify-center mb-6 relative z-10 shadow-lg">
                    <Globe className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 relative z-10 text-gray-900 dark:text-white">Financial Services</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 relative z-10 font-medium">
                    Compliant marketing for financial advisors, wealth management firms, and fintech companies.
                  </p>
                  <ul className="space-y-2 relative z-10">
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-emerald-500 mr-2" />
                      <span className="text-gray-700 dark:text-gray-200 font-medium">Wealth Management Marketing</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-emerald-500 mr-2" />
                      <span className="text-gray-700 dark:text-gray-200 font-medium">Trust Building Content</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5
