import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Layouts
import Layout from './components/Layout'; 
import AdminLayout from './pages/admin/components/AdminLayout';
import InstructorLayout from './pages/instructor/components/InstructorLayout';

// Pages
import Dashboard from './pages/Dashboard';
import Course from './pages/Course';
import Certification from './pages/Certification';
import Support from './pages/Support';
import Account from './pages/Account';

// Auth
import Landing from './auth/Landing'; 
import SignIn from './auth/SignIn';
import SignUp from './auth/SignUp';
import ForgotPassword from './auth/ForgotPassword';

// Subscriptions
import CreditDebit from './subscription/CreditDebit';
import DigitalWallet from './subscription/DigitalWallet';
import Membership from './subscription/Membership';
import Payment from './subscription/Payment';

// Admin & Instructor
import AdminDashboard from './pages/admin/adminDashboard';
import InstructorDashboard from './pages/instructor/insDashboard';

const App = () => {
  return (
    <Router>
      <Routes>

        {/* Redirect root path to landing */}
        <Route path="/" element={<Navigate to="/landing" replace />} />

        {/* Auth routes */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/signout" element={<Landing />} />

        {/* General user layout */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/course/:id" element={<Course />} />
          <Route path="/certification" element={<Certification />} />
          <Route path="/account" element={<Account />} />
          <Route path="/support" element={<Support />} />
        </Route>

        {/* Subscription */}
        <Route path="/creditdebit" element={<CreditDebit />} />
        <Route path="/digitalwallet" element={<DigitalWallet />} />
        <Route path="/membership" element={<Membership />} />
        <Route path="/payment" element={<Payment />} />

        {/* Admin-only layout */}
        <Route element={<AdminLayout />}>
          <Route path="/admindashboard" element={<AdminDashboard />} />
        </Route>

        {/* Instructor-only layout */}
        <Route element={<InstructorLayout />}>
          <Route path="/insdashboard" element={<InstructorDashboard />} />
        </Route>

      </Routes>
    </Router>
  );
};

export default App;
