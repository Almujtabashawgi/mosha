# Mosha for Trading & Investment Co. Ltd.

## Project Overview

A modern, responsive corporate website for Mosha for Trading & Investment Co. Ltd., a leading import-export company specializing in Heavy Machinery, Medical Supplies, and General Goods.

## Project Status

- **Project Type**: React + TypeScript + Vite + Tailwind CSS
- **Build Status**: ✅ Production build successful
- **Entry Point**: `src/main.tsx`

## Features Implemented

### Pages
- **Home Page**: Hero section with dynamic design, business sectors showcase, latest products
- **About Us**: Company vision, mission, values, and operational strength
- **Products/Sectors**: Filterable product catalog with three categories
- **Contact Us**: Interactive contact form with company information
- **Admin Dashboard**: Product management system with CRUD operations
- **Admin Login**: Secure login page for admin access

### Technical Features
- **Bilingual Support**: Full English and Arabic (RTL) support
- **Responsive Design**: Mobile-first, works on all devices
- **Product Management**: Add, edit, delete products with localStorage persistence
- **State Management**: Zustand for product and auth state
- **Routing**: React Router DOM for SPA navigation

### Design
- Modern corporate design with professional blue color palette
- Smooth animations and transitions
- Glassmorphism effects
- Custom scrollbar

## Admin Credentials

- **Username**: admin
- **Password**: mosha2024

## Deployment

The project is built and ready for deployment to any static hosting service (Vercel, Netlify, etc.) or cPanel-based Linux servers.

### Build Output
- `dist/index.html` - Main HTML file
- `dist/assets/` - CSS and JavaScript bundles

### For cPanel/Linux Server Deployment:
1. Build the project: `pnpm run build`
2. Upload the `dist` folder contents to your public_html directory
3. Configure .htaccess for SPA routing if needed

## Project Structure

```
src/
├── i18n/              # Internationalization (English & Arabic)
├── components/        # Reusable components (Header, Footer)
├── pages/            # Page components
│   ├── HomePage.tsx
│   ├── AboutPage.tsx
│   ├── ProductsPage.tsx
│   ├── ContactPage.tsx
│   └── admin/        # Admin pages
├── store/            # Zustand state management
├── types/            # TypeScript type definitions
├── layouts/           # Layout components
└── App.tsx           # Main application with routing
```

## Technology Stack

- React 18
- TypeScript
- Vite 7
- Tailwind CSS 3
- Zustand (State Management)
- React Router DOM 6
- i18next (Internationalization)
- Lucide React (Icons)

## Language

This project uses English as the primary language for user-facing content, with full Arabic (RTL) translation support.
