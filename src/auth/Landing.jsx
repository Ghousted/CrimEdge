import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaSyncAlt, FaBullseye, FaEye, FaLaptop, FaCode, FaGamepad, FaMobileAlt, FaDesktop, FaWordpress, FaPuzzlePiece, FaHeadset, FaCalendarAlt, FaCheckCircle, FaUsers, FaAward, FaPhone, FaEnvelope, FaGraduationCap, FaBook, FaDownload, FaChartLine, FaQuoteLeft, FaBars, FaTimes, FaArrowRight } from 'react-icons/fa';
import './auth.css';

export default function Landing() {
  const [portfolioTab, setPortfolioTab] = useState('all');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const services = [
    { icon: <FaBook className="text-2xl text-blue-700" />, label: 'Structured Modules' },
    { icon: <FaGraduationCap className="text-2xl text-blue-700" />, label: 'Mock Tests' },
    { icon: <FaChartLine className="text-2xl text-blue-700" />, label: 'Performance Tracking' },
    { icon: <FaDownload className="text-2xl text-blue-700" />, label: 'Reviewer Downloads' },
    { icon: <FaHeadset className="text-2xl text-blue-700" />, label: 'Expert Support' },
    { icon: <FaDesktop className="text-2xl text-blue-700" />, label: 'Online Access' },
    { icon: <FaMobileAlt className="text-2xl text-blue-700" />, label: 'Mobile Learning' },
    { icon: <FaCheckCircle className="text-2xl text-blue-700" />, label: 'Practice Exams' },
  ];

  const stats = [
    { icon: <FaCheckCircle className="text-3xl text-blue-700 mb-2" />, value: '98%', label: 'First-time Passers' },
    { icon: <FaAward className="text-3xl text-blue-700 mb-2" />, value: '95%', label: 'Average Board Rating' },
    { icon: <FaUsers className="text-3xl text-blue-700 mb-2" />, value: '1000+', label: 'Successful Graduates' },
    { icon: <FaCalendarAlt className="text-3xl text-blue-700 mb-2" />, value: '24/7', label: 'Learning Access' },
  ];

  const subscriptionPlans = [
    {
      name: 'Free Plan',
      price: 'Free',
      features: [
        'Access to limited learning materials (e.g., 1 subject/module per week)',
        'Access to a few sample practice exams (e.g., 2 exams/month)',
        'Limited number of reviewer downloads (e.g., 2 per month)',
        'No performance tracking',
        'No offline access'
      ],
      color: 'bg-green-500'
    },
    {
      name: 'Basic Plan',
      price: '₱499',
      features: [
        'Unlimited access to all learning materials',
        'Access to all practice exams',
        '10 reviewer downloads per month',
        'Performance tracking and analytics',
        'No offline access'
      ],
      color: 'bg-blue-500'
    },
    {
      name: 'Premium Plan',
      price: '₱999',
      features: [
        'Unlimited access to all learning materials',
        'Unlimited access to practice exams',
        'Unlimited reviewer downloads',
        'Performance tracking and analytics',
        'Offline access to materials',
        'Priority support',
        'Exclusive content (e.g., bonus tips, advanced practice sets)'
      ],
      color: 'bg-purple-500'
    }
  ];

  const portfolioImages = [
    { src: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80', tag: 'web' },
    { src: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80', tag: 'game' },
    { src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80', tag: 'app' },
    { src: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80', tag: 'web' },
    { src: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80', tag: 'game' },
    { src: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80', tag: 'app' },
  ];

  const testimonials = [
    {
      name: "John Doe",
      role: "Criminology Graduate",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80",
      quote: "Review Hub's comprehensive materials and expert guidance were instrumental in my success. The practice exams were particularly helpful!"
    },
    {
      name: "Jane Smith",
      role: "Board Exam Passer",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80",
      quote: "The structured modules and performance tracking helped me identify my weak areas and improve significantly. Highly recommended!"
    },
    {
      name: "Mike Johnson",
      role: "Criminology Student",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
      quote: "The mobile learning feature is a game-changer. I can study anywhere, anytime. The quality of content is exceptional!"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#eaf0fb] to-white">
      {/* Header/Nav */}
      {!isMenuOpen && (
        <header className="w-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-between px-4 sm:px-6 md:px-8 p sticky top-0 z-50 transition-all duration-300 hover:shadow-lg">
          <div className="flex items-center gap-2">
            <img src="src/assets/ReviewHub.png" alt="Logo" className="w-32 sm:w-40 md:w-50 h-auto transform hover:scale-105 transition-transform duration-300 mb-2" />
          </div>
          {/* Mobile Menu Button - Always visible on mobile */}
          <button 
            onClick={toggleMenu}
            className="lg:hidden text-gray-700 hover:text-blue-700 transition-colors duration-300 p-2 rounded-full hover:bg-blue-50"
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
          {/* Desktop Navigation - Hidden on mobile */}
          <nav className="hidden lg:flex items-center gap-8">
            {['Home', 'Features', 'Plans', 'About', 'Contact'].map((item) => (
              <a 
                key={item}
                href={`#${item.toLowerCase()}`} 
                className="text-gray-700 hover:text-blue-700 transition-all duration-300 relative group text-sm font-medium uppercase tracking-wider"
              >
                {item}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-700 transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
            <Link 
              to="/signIn" 
              className="bg-gradient-to-r from-blue-700 to-blue-600 text-white px-6 sm:px-8 py-2.5 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2 group relative overflow-hidden"
            >
              <span className="relative z-10">Sign In</span>
              <FaArrowRight className="relative z-10 transform group-hover:translate-x-1 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          </nav>
        </header>
      )}
      {/* Mobile Navigation - Slide Down Drawer */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
            onClick={toggleMenu}
          ></div>
          {/* Slide Down Drawer */}
          <div className={`relative w-full bg-white shadow-2xl animate-slideDown flex flex-col`} style={{ minHeight: '100vh' }}>
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-6 h-20 border-b border-gray-200 sticky top-0 bg-white z-50">
              <img src="src/assets/ReviewHub.png" alt="Logo" className="w-32 h-auto" />
              <button 
                onClick={toggleMenu} 
                className="text-gray-700 hover:text-blue-700 p-2 rounded-full hover:bg-blue-50 transition-all duration-300"
              >
                <FaTimes size={24} />
              </button>
            </div>
            {/* Drawer Links */}
            <div className="flex-1 flex flex-col justify-start items-center w-full pt-8">
              {['Home', 'Features', 'Plans', 'About', 'Contact'].map((item, idx) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="w-full text-center py-4 text-lg font-medium text-gray-800 hover:text-blue-700 hover:bg-blue-50 transition-all duration-300 border-b border-gray-100"
                  onClick={toggleMenu}
                >
                  {item}
                </a>
              ))}
              <Link
                to="/signIn"
                className="mt-6 bg-gradient-to-r from-blue-700 to-blue-600 text-white px-8 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2 group"
              >
                Sign In
                <FaArrowRight className="transform group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
            {/* Social Links */}
            <div className="p-6 border-t border-gray-200">
              <div className="flex justify-center space-x-4">
                {[FaFacebook, FaTwitter, FaInstagram].map((Icon, i) => (
                  <a 
                    key={i}
                    href="#" 
                    className="bg-gray-100 hover:bg-blue-100 p-3 rounded-full text-blue-700 transition-all duration-300 hover:scale-110"
                  >
                    <Icon className="text-xl" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section id="home" className="relative w-full h-screen flex flex-col items-center justify-center text-center overflow-hidden" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=1200&q=80)', backgroundSize: 'cover', backgroundPosition: 'center'}}>
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/90 via-blue-900/70 to-blue-900/60 backdrop-blur-sm"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-blob"></div>
          <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full py-4 sm:py-8 md:py-12 px-4">
          <div className="animate-float">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white mb-4 sm:mb-6 md:mb-8 drop-shadow-xl tracking-tight leading-tight" style={{textShadow: '0 4px 24px rgba(0,0,0,0.25)'}}>
              Your Path to Excellence in{' '}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Criminology
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-blue-100 mb-6 sm:mb-8 md:mb-10 max-w-2xl sm:max-w-3xl mx-auto drop-shadow-lg font-medium px-2 sm:px-4 leading-relaxed" style={{textShadow: '0 2px 8px rgba(0,0,0,0.18)'}}>
              Master the Board Exam with our comprehensive review system designed for success
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 mb-6 sm:mb-8 md:mb-10 w-full max-w-3xl sm:max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-md rounded-lg sm:rounded-xl p-2 sm:p-4 transform hover:scale-105 transition-all duration-300 hover:bg-white/20">
                <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2">{stat.value}</div>
                <div className="text-xs sm:text-sm md:text-base text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row w-full max-w-lg sm:max-w-xl mx-auto px-2 sm:px-4 animate-fade-in gap-4 sm:gap-0">
            <div className="relative flex-1">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-6 sm:px-8 py-2.5 sm:py-3 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base md:text-lg bg-white/90 placeholder:text-blue-400 border border-blue-200"
              />
            </div>
            <Link
              to="/signUp"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold ml-5 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base md:text-lg flex items-center justify-center gap-2"
              style={{ minWidth: '120px', maxWidth: '200px' }}
            >
              Get Started
              <FaArrowRight className="text-sm sm:text-base" />
            </Link>
          </div>

        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <FaArrowRight className="text-white text-2xl transform rotate-90" />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full min-h-screen flex flex-col items-center justify-center text-center py-8 sm:py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent mb-3 sm:mb-4">Our Features</h2>
          <p className="text-gray-600 text-xs sm:text-sm md:text-base lg:text-lg mb-4 sm:mb-6 md:mb-8 max-w-xl sm:max-w-2xl mx-auto">Comprehensive tools and resources to help you succeed in your criminology journey</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
            {services.map((service, i) => (
              <div key={i} className="flex flex-col items-center bg-gradient-to-b from-[#f5f7fa] to-white rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 lg:p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
                <div className="bg-blue-50 p-2 sm:p-3 md:p-4 rounded-full mb-3 sm:mb-4 group-hover:bg-blue-100 transition-all duration-300 transform group-hover:scale-110">
                  {service.icon}
                </div>
                <span className="mt-2 sm:mt-3 md:mt-4 text-xs sm:text-sm md:text-base lg:text-lg font-medium text-blue-800 group-hover:text-blue-900 transition-colors duration-300">{service.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subscription Plans */}
      <section id="plans" className="w-full min-h-screen flex flex-col items-center justify-center text-center py-8 sm:py-12 md:py-16 bg-gradient-to-b from-[#eaf0fb] to-white">
        <div className="max-w-6xl mx-auto px-4 mt-10 sm:mt-16 md:mt-20">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent mb-3 sm:mb-4">Choose Your Plan</h2>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg mb-8 sm:mb-10 md:mb-12 max-w-xl sm:max-w-2xl mx-auto">Select the perfect plan that fits your learning needs and budget</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
            {subscriptionPlans.map((plan, i) => (
              <div key={i} className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-6 md:p-8 border-2 border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 relative overflow-hidden group">
                {/* Popular Tag */}
                {plan.name === 'Basic Plan' && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 sm:px-6 py-1 rounded-bl-lg font-medium text-xs sm:text-sm">
                    Most Popular
                  </div>
                )}
                
                {/* Plan Header */}
                <div className={`${plan.color} text-white rounded-xl sm:rounded-2xl w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto mb-4 sm:mb-6 transform group-hover:scale-110 transition-transform duration-300 relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-white/10 transform rotate-45 translate-x-1/2"></div>
                  <span className="text-xl sm:text-2xl font-bold relative z-10">{plan.price}</span>
                </div>
                
                <h3 className="text-xl sm:text-2xl font-bold text-blue-800 mb-4 sm:mb-6">{plan.name}</h3>
                
                {/* Features List */}
                <ul className="text-left space-y-2 sm:space-y-3 md:space-y-4 mb-6 sm:mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-2 sm:gap-3 text-gray-600 group/item">
                      {feature.startsWith('❌') ? (
                        <>
                          <FaTimes className="text-red-500 flex-shrink-0 mt-1 text-xs sm:text-sm transform group-hover/item:scale-110 transition-transform duration-300" />
                          <span className="text-xs sm:text-sm md:text-base text-gray-500">{feature.replace('❌', '').trim()}</span>
                        </>
                      ) : (
                        <>
                          <FaCheckCircle className="text-green-500 flex-shrink-0 mt-1 text-xs sm:text-sm transform group-hover/item:scale-110 transition-transform duration-300" />
                          <span className="text-xs sm:text-sm md:text-base">{feature.replace('✅', '').trim()}</span>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
                
                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-blue-50/0 to-blue-50/0 group-hover:from-blue-50/10 group-hover:to-blue-50/20 transition-all duration-300"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="w-full min-h-screen flex items-center justify-center py-8 sm:py-12 md:py-16 bg-gradient-to-b from-[#eaf0fb] to-white">
        <div className="max-w-6xl mx-auto px-2 mt-10 sm:mt-16 md:mt-20">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent mb-3 sm:mb-4 text-center">About Review Hub</h2>
          <p className="text-gray-600 text-xs sm:text-sm md:text-base mb-6 sm:mb-8 text-center max-w-2xl sm:max-w-3xl mx-auto">
            Review Hub is an online review platform tailored for future criminologists. We provide structured modules, live coaching, quizzes, and performance tracking—accessible anytime, anywhere. With flexible subscription plans, expert mentors, and a supportive learning community, we help students prepare confidently for the Criminology Licensure Exam.
          </p>
            
          {/* Mission and Vision Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-5">
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center gap-4 mb-2">
                <div className="bg-blue-100 p-2 rounded-full">
                  <FaBullseye className="text-base text-blue-700" />
                </div>
                <h3 className="text-xl font-bold text-blue-800">Our Mission</h3>
              </div>
              <p className="text-gray-600 leading-relaxed text-sm">
                To empower aspiring criminologists through accessible, high-quality, and exam-focused review resources that align with PRC standards. We are committed to providing comprehensive learning materials and personalized support to help students achieve their professional goals.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center gap-4 mb-2">
                <div className="bg-blue-100 p-2 rounded-full">
                  <FaEye className="text-lg text-blue-700" />
                </div>
                <h3 className="text-xl font-bold text-blue-800">Our Vision</h3>
              </div>
              <p className="text-gray-600 leading-relaxed text-sm">
                To be the leading digital review platform in the Philippines for criminology licensure exam preparation, fostering future law enforcers equipped with knowledge and integrity. We aim to revolutionize criminology education through innovative technology and expert guidance.
              </p>
            </div>
          </div>

          {/* Core Values */}
          <div className="bg-white rounded-2xl p-5 shadow-lg">
            <h3 className="text-2xl font-bold text-blue-800 mb-4 text-center">Our Core Values</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  icon: <FaSyncAlt className="text-lg text-blue-700" />,
                  title: "Excellence",
                  description: "We strive for the highest quality in our educational content and services."
                },
                {
                  icon: <FaUsers className="text-lg text-blue-700" />,
                  title: "Community",
                  description: "We foster a supportive learning environment where students can grow together."
                },
                {
                  icon: <FaCode className="text-lg text-blue-700" />,
                  title: "Innovation",
                  description: "We continuously improve our platform with cutting-edge technology and methods."
                }
              ].map((value, index) => (
                <div key={index} className="flex flex-col items-center text-center p-6 rounded-xl bg-blue-50 hover:bg-blue-100 transition-all duration-300">
                  <div className="bg-white p-4 rounded-full mb-4 shadow-md">
                    {value.icon}
                  </div>
                  <h4 className="text-xl font-bold text-blue-800 mb-2">{value.title}</h4>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="w-full min-h-screen flex flex-col items-center justify-center py-8 sm:py-12 md:py-16 bg-gradient-to-b from-white to-blue-50 text-gray-800 px-4 sm:px-6 md:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 lg:gap-16">
          {/* Left Column - Contact Info and Socials */}
          <div className="space-y-6 sm:space-y-8">
            {/* Contact Info */}
            <div className="space-y-3 sm:space-y-4 md:space-y-6">
              <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent mb-3 sm:mb-4 md:mb-6">Get in Touch</h3>
              <div className="flex items-center gap-3 sm:gap-4 group">
                <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-blue-700 group-hover:text-blue-800 transition-colors transform group-hover:scale-110"><FaPhone /></span>
                <p className="font-medium text-sm sm:text-base md:text-lg lg:text-xl group-hover:text-blue-800 transition-colors">+63 969 045 6744</p>
              </div>
              <div className="flex items-center gap-3 sm:gap-4 group">
                <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-blue-700 group-hover:text-blue-800 transition-colors transform group-hover:scale-110"><FaEnvelope /></span>
                <a href="mailto:support@reviewhub.com" className="text-blue-600 hover:text-blue-800 transition-colors duration-300 text-sm sm:text-base md:text-lg lg:text-xl">
                  support@reviewhub.com
                </a>
              </div>
            </div>

            {/* About + Socials */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent mb-3 sm:mb-4 md:mb-6">Review Hub</h3>
              <p className="text-gray-600 mb-3 sm:mb-4 md:mb-6 leading-relaxed text-xs sm:text-sm md:text-base lg:text-lg">
                Your trusted partner in criminology education. Join us to master the board exam
                with expert coaching, comprehensive materials, and proven success rates.
              </p>
              <div className="flex space-x-3 sm:space-x-4 md:space-x-6">
                {[FaFacebook, FaTwitter, FaInstagram].map((Icon, i) => (
                  <a 
                    key={i}
                    href="#" 
                    className="bg-white hover:bg-blue-100 p-2 sm:p-3 md:p-4 rounded-full text-blue-700 transition-all duration-300 hover:shadow-lg hover:scale-110 transform hover:-translate-y-1"
                  >
                    <Icon className="text-base sm:text-lg md:text-xl lg:text-2xl" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Inquiry Form */}
          <div>
            <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent mb-4 sm:mb-6">Send us an Inquiry</h3>
            <form className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 md:p-8 space-y-3 sm:space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    className="w-full px-3 sm:px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-sm sm:text-base"
                    placeholder="Enter your first name"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    className="w-full px-3 sm:px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-sm sm:text-base"
                    placeholder="Enter your last name"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label htmlFor="contactNumber" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                  <input
                    type="tel"
                    id="contactNumber"
                    className="w-full px-3 sm:px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-sm sm:text-base"
                    placeholder="Enter your contact number"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-3 sm:px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-sm sm:text-base"
                    placeholder="Enter your email"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="subject" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  id="subject"
                  className="w-full px-3 sm:px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-sm sm:text-base"
                  placeholder="Enter subject"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  id="message"
                  rows="4"
                  className="w-full px-3 sm:px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-sm sm:text-base"
                  placeholder="Enter your message"
                ></textarea>
              </div>
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-700 to-blue-600 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 transform hover:-translate-y-1 flex items-center gap-2 group text-sm sm:text-base"
                >
                  Send Message
                  <FaArrowRight className="transform group-hover:translate-x-1 transition-transform duration-300 text-sm sm:text-base" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </footer>
    </div>
  );
}
