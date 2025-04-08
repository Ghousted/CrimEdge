import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaPhone, FaEnvelope } from 'react-icons/fa';
import { HiLocationMarker } from 'react-icons/hi';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import './auth.css';

export default function Landing() {
  const [hoveredFAQ, setHoveredFAQ] = useState(null); // Added state for hoveredFAQ

  useEffect(() => {
    document.body.style.background = "radial-gradient(circle, rgba(225,238,254,1) 0%, rgba(90,110,201,1) 100%)";
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.overflowX = "hidden";

    return () => {
      document.body.style.background = "";
      document.body.style.margin = "";
      document.body.style.padding = "";
      document.body.style.overflowX = "";
    };
  }, []);

  const headerRef = useRef(null);
  const getStartedRef = useRef(null);
  const aboutSectionRef = useRef(null);
  const aboutImageRef = useRef(null);
  const joinSectionRef = useRef(null);
  const faqRef = useRef(null);

  useGSAP(() => {
    gsap.from(headerRef.current, { y: -50, opacity: 0, duration: 1, ease: 'power2.out' });
    gsap.from(getStartedRef.current, { y: 50, opacity: 0, duration: 1, delay: 0.3, ease: 'power2.out' });

    // About Section Animation
    gsap.from(aboutSectionRef.current, { x: -50, opacity: 0, duration: 1, delay: 0.5, ease: 'power2.out' });
    gsap.from(aboutImageRef.current, { x: 50, opacity: 0, duration: 1, delay: 0.6, ease: 'power2.out' });

    gsap.from(joinSectionRef.current.children, { opacity: 0, y: 20, stagger: 0.2, duration: 1, delay: 0.7, ease: 'power2.out' });
    gsap.from(faqRef.current, { y: 30, opacity: 0, duration: 1, delay: 0.9, ease: 'power2.out' });
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Main Content */}
      <div className="flex-grow flex flex-col items-center justify-center px-4 sm:px-8 xl:px-30 py-10">
        
        {/* Header */}
        <div className="flex justify-between items-center w-full rounded-lg mb-10" ref={headerRef}>
          <img src="src/assets/CrimEdge.png" alt="" className="w-35 h-12" />
          <Link to="/signIn">
            <button className="bg-white text-black px-5 py-1 rounded-full hover:bg-blue-700">Sign In</button>
          </Link>
        </div>

        {/* Get Started Section */}
        <div className="dark-bg py-10 w-full sm:p-10 rounded-lg text-center space-y-4" ref={getStartedRef}>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white">
            EDGE over the <span className="text-blue-600">REST</span>
          </h2>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white">
            <span className="text-red-600">CONQUER</span> the TEST!
          </h2>
          <p className="text-sm sm:text-base md:text-lg">
            Ready to get started? Enter your email to create or resume your Crim Edge membership.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-">
            <input 
              type="email" 
              placeholder="Email address" 
              className="w-full sm:w-3/4 md:w-1/2 lg:w-1/3 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Link to="/signUp" className="gradient-btn rounded-full text-white px-8 py-2 sm:px-10 sm:py-3">
              Get Started
            </Link>
          </div>
        </div>

        {/* About Section */}
        <div className="w-full py-3 flex flex-col mt-10 md:flex-row items-center md:items-start space-y-10 md:space-x-20">
          <div className="w-full  space-y-6" ref={aboutSectionRef}>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">About Crim Edge</h1>
            <p className="text-gray-700 text-lg leading-relaxed text-justify">
              Our Criminology Review Platform offers a comprehensive and flexible learning experience for 
              aspiring criminologists, featuring expertly designed modules on key topics like Criminal 
              Jurisprudence, Criminalistics, and Law Enforcement. Students can access video lectures, 
              live classes, and downloadable materials, with interactive quizzes and AI-monitored mock 
              exams to ensure thorough preparation. With a variety of subscription plans, including free 
              and premium options, we also provide mentorship, live Q&A sessions, and career assistance 
              such as certification, job listings, and internship opportunities. Join us today and take 
              the next step toward acing your criminology board exam!
            </p>
          </div>
        </div>

        {/* Reasons to Join Section */}
        <div className="w-full py-3 mt-5 flex flex-col md:items-start space-y-10 md:space-x-20" ref={joinSectionRef}>
          <h1 className="text-2xl sm:text-3xl font-semibold mb-3 text-left">Reasons to Join Crim Edge</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full text-left">
            {['All-in-One Learning Platform', 'Expert Support & Guidance', 'Career-Boosting Opportunities', 'Personalized Learning Path'].map((title, i) => (
              <div key={i} className="p-4 dark-bg text-white rounded-lg shadow-lg">
                <h2 className="text-lg font-semibold">{title}</h2>
                <p className='text-sm mt-2'>
                  {["Access review materials, video lectures, and practice exams for all criminology board exam topics.", 
                    "Get insights through live Q&A, mentorship, and performance tracking.", 
                    "Earn a certificate, explore job listings, and internships.", 
                    "Personalized learning path based on your strengths and weaknesses."][i]}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="w-full mt-5 py-3 flex flex-col md:items-start space-y-10 md:space-x-20" ref={faqRef}>
          <h1 className="text-2xl sm:text-3xl font-semibold mb-3 text-left">Frequently Asked Questions</h1>
          <div className="w-full gap-6 grid grid-cols-1 lg:grid-cols-2">
            {[
              { 
                question: "What are the different subscription tiers available?", 
                answer: "We offer three subscription tiers:\n\nFree Tier: Limited access to sample quizzes and trial lessons.\n\nBasic Plan: Access to pre-recorded lectures and practice exams.\n\nPremium Plan: Full access to live coaching, mentorship, and mock exams."
              },
              { 
                question: "What payment methods do you accept?", 
                answer: "We accept payments through PayPal, credit/debit cards, GCash, PayMaya, and bank transfers."
              },
              { 
                question: "What happens if my subscription expires?", 
                answer: "If your subscription expires, access to certain content will be auto-locked. You will also receive notifications before the expiration date, and you can easily upgrade or renew your subscription."
              },
              { 
                question: "What topics do the review modules cover?", 
                answer: "The review modules cover criminology board exam topics, including:\n\n- Criminal Jurisprudence & Procedure\n- Law Enforcement Administration\n- Criminalistics\n- Crime Detection & Investigation\n- Sociology of Crimes & Ethics."
              },
              { 
                question: "Can I access downloadable study materials?", 
                answer: "Yes, downloadable materials such as PDF handouts, case studies, and e-books are available depending on your subscription plan."
              },
              { 
                question: "Are there practice exams available?", 
                answer: "Yes, we offer practice exams categorized by topics and difficulty levels to help you prepare."
              }
            ].map((faq, i) => (
              <div
                key={i}
                className="faq-item"
                onMouseEnter={() => setHoveredFAQ(i)} // Set the hovered FAQ item
                onMouseLeave={() => setHoveredFAQ(null)} // Reset when mouse leaves
              >
                <h2 className="font-medium text-2xl">{faq.question}</h2>
                {hoveredFAQ === i && (
                  <p className="text-sm text-gray-700">{faq.answer}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

    {/* Footer */}
<footer className="bg-gray-900 text-white py-10 px-6">
  <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
    {/* Contact Info */}
    <div className="space-y-4">
     
      <div className="flex items-center gap-3">
        <FaPhone className="text-xl text-gray-300" />
        <p className="font-medium text-base">+63 969 045 6744</p>
      </div>
      <div className="flex items-center gap-3">
        <FaEnvelope className="text-xl text-gray-300" />
        <a href="mailto:support@company.com" className="text-blue-400 hover:underline">
          support@company.com
        </a>
      </div>
    </div>

    {/* About + Socials */}
    <div>
      <h3 className="text-white font-semibold mb-3">Crim Edge</h3>
      <p className="text-sm text-gray-400 mb-5">
      Sharpen your mind and conquer the Criminology Licensure Exam with expert coaching, 
      top-notch materials, and a results-driven approach. Stay sharp, stay ahead—Get 
      the EDGE with CRIM EDGE!
      </p>
      <div className="flex space-x-4">
        <a href="https://www.facebook.com/CrimEdgeReviewCenter" className="bg-gray-700 hover:bg-gray-600 p-2 rounded">
          <FaFacebook />
        </a>
        <a href="#" className="bg-gray-700 hover:bg-gray-600 p-2 rounded">
          <FaTwitter />
        </a>
        <a href="#" className="bg-gray-700 hover:bg-gray-600 p-2 rounded">
          <FaInstagram />
        </a>
      </div>
    </div>
  </div>
</footer>

    </div>
  );
}
