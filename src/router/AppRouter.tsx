import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import PublicLayout from '../layouts/PublicLayout'
import AdminLayout from '../layouts/AdminLayout'
import CatalogPage from '../features/catalog/pages/CatalogPage'
import ProductDetailPage from '../features/catalog/pages/ProductDetailPage'
import NotFoundPage from '../features/catalog/pages/NotFoundPage'
import LoginPage from '../features/admin/pages/LoginPage'
import ProductsAdmin from '../features/admin/pages/ProductsAdmin'
import SalesAdmin from '../features/admin/pages/SalesAdmin'
import AdminDashboard from '../features/admin/pages/AdminDashboard'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  return isAuthenticated ? <>{children}</> : <Navigate to="/admin/login" />
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<CatalogPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        <Route path="/admin/login" element={<LoginPage />} />

        <Route
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<ProductsAdmin />} />
          <Route path="/admin/sales" element={<SalesAdmin />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
