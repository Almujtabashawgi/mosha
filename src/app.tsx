import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import PageLoader from './components/PageLoader';

// Load secondary pages on demand so the home page opens faster
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const OffersPage = lazy(() => import('./pages/OffersPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const SectorDetails = lazy(() => import('./pages/SectorDetails'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const AdminPage = lazy(() => import('./pages/admin/AdminPage'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="offers" element={<OffersPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="sector/:id" element={<SectorDetails />} />
            <Route path="privacy" element={<PrivacyPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/login" element={<Navigate to="/admin" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
