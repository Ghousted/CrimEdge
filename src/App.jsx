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
import SignIn from './auth/signIn';
import SignUp from './auth/signUp';
import ForgotPassword from './auth/ForgotPassword';
import VerifyEmailNotice from './auth/VerifyEmailNotice';

// Subscriptions
import CreditDebit from './subscription/CreditDebit';
import DigitalWallet from './subscription/DigitalWallet';
import Membership from './subscription/Membership';
import Payment from './subscription/Payment';

// Admin & Instructor
import AdminDashboard from './pages/admin/adminDashboard';
import AdminSetting from './pages/admin/adminSetting';
import UserManagement from './pages/admin/UserManagement';
import InstructorDashboard from './pages/instructor/insDashboard';
import CoursePage from './pages/instructor/CoursePage';

// Routes
import PublicRoute from '../src/auth/components/PublicRoute';
import PrivateRoute from '../src/auth/components/PrivateRoute';

const App = () => {
  return (
    <Routes>
      {/* Redirect root path to landing */}
      <Route path="/" element={<Navigate to="/landing" replace />} />

      {/* Public routes: Prevent logged-in users from accessing these pages */}
      <Route path="/signin" element={<PublicRoute element={<SignIn />} />} />
      <Route path="/signup" element={<PublicRoute element={<SignUp />} />} />
      <Route path="/forgot-password" element={<PublicRoute element={<ForgotPassword />} />} />
      <Route path="/landing" element={<PublicRoute element={<Landing />} />} />
      <Route path="/signout" element={<Landing />} />
      <Route path='/verify-email' element={<PublicRoute element={<VerifyEmailNotice />} />} />

      {/* General user layout */}
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} requiredRole="user" />} />
        <Route path="/course/:id" element={<PrivateRoute element={<Course />} requiredRole="user" />} />
        <Route path="/certification" element={<PrivateRoute element={<Certification />} requiredRole="user" />} />
        <Route path="/account" element={<PrivateRoute element={<Account />} requiredRole="user" />} />
        <Route path="/support" element={<PrivateRoute element={<Support />} requiredRole="user" />} />
      </Route>

      {/* Subscription routes */}
      <Route path="/creditdebit" element={<PrivateRoute element={<CreditDebit />} requiredRole="user" />} />
      <Route path="/digitalwallet" element={<PrivateRoute element={<DigitalWallet />} requiredRole="user" />} />
      <Route path="/membership" element={<PrivateRoute element={<Membership />} requiredRole="user" />} />
      <Route path="/payment" element={<PrivateRoute element={<Payment />} requiredRole="user" />} />

      {/* Admin-only layout */}
      <Route element={<AdminLayout />}>
        <Route path="/admin/dashboard" element={<PrivateRoute element={<AdminDashboard />} requiredRole="admin" />} />
        <Route path="/admin/settings" element={<PrivateRoute element={<AdminSetting />} requiredRole="admin" />} />
        <Route path="/admin/users" element={<PrivateRoute element={<UserManagement />} requiredRole="admin" />} />
      </Route>

      {/* Instructor-only layout */}
      <Route element={<InstructorLayout />}>
        <Route path="/insdashboard" element={<PrivateRoute element={<InstructorDashboard />} requiredRole="instructor" />} />
        <Route path="/course-page/:id" element={<PrivateRoute element={<CoursePage />} requiredRole="instructor" />} />
      </Route>
    </Routes>
  );
};

export default App;
