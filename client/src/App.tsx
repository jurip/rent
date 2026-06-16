import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Skeleton from '@/components/ui/Skeleton';

// Lazy-loaded pages
const HomePage = lazy(() => import('@/pages/HomePage'));
const ListingsPage = lazy(() => import('@/pages/ListingsPage'));
const PropertyDetailPage = lazy(() => import('@/pages/PropertyDetailPage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('@/pages/ResetPasswordPage'));
const VerifyEmailPage = lazy(() => import('@/pages/VerifyEmailPage'));
const RenterDashboardPage = lazy(() => import('@/pages/RenterDashboardPage'));
const LandlordDashboardPage = lazy(() => import('@/pages/LandlordDashboardPage'));
const FavoritesPage = lazy(() => import('@/pages/FavoritesPage'));
const BookingRequestsPage = lazy(() => import('@/pages/BookingRequestsPage'));
const MyBookingsPage = lazy(() => import('@/pages/MyBookingsPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const ComparePage = lazy(() => import('@/pages/ComparePage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

function PageLoader() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Skeleton className="h-8 w-48 mb-4" />
      <Skeleton className="h-4 w-96 mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i}>
            <Skeleton className="h-48 w-full mb-3" />
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-brand-600 focus:text-white focus:rounded-xl focus:outline-none">
        Skip to content
      </a>
      <Header />
      <main id="main-content" className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/listings" element={<ListingsPage />} />
            <Route path="/properties/:id" element={<PropertyDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />

            {/* Protected: Renter routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute role="renter"><RenterDashboardPage /></ProtectedRoute>
            } />
            <Route path="/favorites" element={
              <ProtectedRoute role="renter"><FavoritesPage /></ProtectedRoute>
            } />
            <Route path="/favorites/compare" element={
              <ProtectedRoute role="renter"><ComparePage /></ProtectedRoute>
            } />
            <Route path="/my-bookings" element={
              <ProtectedRoute role="renter"><MyBookingsPage /></ProtectedRoute>
            } />

            {/* Protected: Landlord routes */}
            <Route path="/landlord/dashboard" element={
              <ProtectedRoute role="landlord"><LandlordDashboardPage /></ProtectedRoute>
            } />
            <Route path="/landlord/bookings" element={
              <ProtectedRoute role="landlord"><BookingRequestsPage /></ProtectedRoute>
            } />

            {/* Protected: Any authenticated user */}
            <Route path="/profile" element={
              <ProtectedRoute><ProfilePage /></ProtectedRoute>
            } />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
