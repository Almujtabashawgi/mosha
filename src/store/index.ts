import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, Category } from '../types';
import { defaultProducts, adminConfig } from '../data/content';

interface ProductStore {
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProductsByCategory: (category: Category) => Product[];
  getProductById: (id: string) => Product | undefined;
}

export const useProductStore = create<ProductStore>()(
  persist(
    (set, get) => ({
      products: defaultProducts.map((p, index) => ({
        ...p,
        createdAt: Date.now() - 86400000 * (index + 1)
      })),
      addProduct: (product) => set((state) => ({
        products: [
          ...state.products,
          {
            ...product,
            id: Date.now().toString(),
            createdAt: Date.now()
          }
        ]
      })),
      updateProduct: (id, updatedProduct) => set((state) => ({
        products: state.products.map((p) =>
          p.id === id ? { ...p, ...updatedProduct } : p
        )
      })),
      deleteProduct: (id) => set((state) => ({
        products: state.products.filter((p) => p.id !== id)
      })),
      getProductsByCategory: (category) => get().products.filter((p) => p.category === category),
      getProductById: (id) => get().products.find((p) => p.id === id)
    }),
    {
      name: 'mosha-products'
    }
  )
);

// Auth store
interface AuthStore {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      login: (username, password) => {
        if (username === adminConfig.username && password === adminConfig.password) {
          set({ isAuthenticated: true });
          return true;
        }
        return false;
      },
      logout: () => set({ isAuthenticated: false })
    }),
    {
      name: 'mosha-auth'
    }
  )
);
