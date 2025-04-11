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

// Subscriptions
import CreditDebit from './subscription/CreditDebit';
import DigitalWallet from './subscription/DigitalWallet';
import Membership from './subscription/Membership';
import Payment from './subscription/Payment';

// Admin & Instructor
import AdminDashboard from './pages/admin/adminDashboard';
import InstructorDashboard from './pages/instructor/insDashboard';

// Import AuthProvider, PrivateRoute, and PublicRoute
import { AuthProvider } from './auth/components/authContext';
import PrivateRoute from './auth/components/PrivateRoute';
import PublicRoute from './auth/components/PublicRoute';
import RoleRoute from './auth/components/RoleRoute';

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        {/* Redirect root path to landing */}
        <Route path="/" element={<Navigate to="/landing" replace />} />

        {/* Public routes: Prevent logged-in users from accessing these pages */}
        <Route path="/signin" element={<PublicRoute element={<SignIn />} />} />
        <Route path="/signup" element={<PublicRoute element={<SignUp />} />} />
        <Route path="/forgot-password" element={<PublicRoute element={<ForgotPassword />} />} />
        <Route path="/landing" element={<PublicRoute element={<Landing />} />} />
        <Route path="/signout" element={<Landing />} />

        {/* General user layout */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
          <Route path="/course/:id" element={<PrivateRoute element={<Course />} />} />
          <Route path="/certification" element={<PrivateRoute element={<Certification />} />} />
          <Route path="/account" element={<PrivateRoute element={<Account />} />} />
          <Route path="/support" element={<PrivateRoute element={<Support />} />} />
        </Route>

        {/* Subscription routes */}
        <Route path="/creditdebit" element={<CreditDebit />} />
        <Route path="/digitalwallet" element={<DigitalWallet />} />
        <Route path="/membership" element={<Membership />} />
        <Route path="/payment" element={<Payment />} />

        {/* Admin-only layout */}
        <Route element={<AdminLayout />}>
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute>
                <RoleRoute allowedRoles={['admin']}>
                  <AdminLayout />
                </RoleRoute>
              </PrivateRoute>
            }
          />
        </Route>


        {/* Instructor-only layout */}
        <Route element={<InstructorLayout />}>
          <Route path="/insdashboard" element={<PrivateRoute element={<InstructorDashboard />} />} />
        </Route>

      </Routes>
    </AuthProvider>
  );
};

export default App;
