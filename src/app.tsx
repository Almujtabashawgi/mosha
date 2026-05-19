import SectorDetails from "./pages/SectorDetails";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProductsPage from './pages/ProductsPage';
import ContactPage from './pages/ContactPage';
import AdminPage from './pages/admin/AdminPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';

function App() {
  return (
    <BrowserRouter>
  <Routes>
    <Route path="/" element={<MainLayout />}>
      <Route index element={<HomePage />} />
      <Route path="about" element={<AboutPage />} />
      <Route path="products" element={<ProductsPage />} />
      <Route path="contact" element={<ContactPage />} />

      {/* 🔥 أضف دا هنا */}
      <Route path="sector/:id" element={<SectorDetails />} />
    </Route>

    <Route path="/admin" element={<AdminPage />} />
    <Route path="/admin/login" element={<AdminLoginPage />} />
  </Routes>
</BrowserRouter>
  );
}

export default App;
