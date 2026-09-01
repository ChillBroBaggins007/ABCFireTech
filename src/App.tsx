import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './lib/auth'
import LandingPage from './pages/LandingPage'
import ProductsPage from './pages/ProductsPage'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'
import UserDashboard from './pages/UserDashboard'
import UserOrders from './pages/UserOrders'
import UserServiceRequests from './pages/UserServiceRequests'
import UserProfile from './pages/UserProfile'
import AdminDashboard from './pages/AdminDashboard'
import AdminLeads from './pages/AdminLeads'
import AdminContacts from './pages/AdminContacts'
import AdminOrders from './pages/AdminOrders'
import AdminProducts from './pages/AdminProducts'
import AdminLayout from './components/AdminLayout'
import UserLayout from './components/UserLayout'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  const { loading } = useAuth()
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/signup" element={<SignUpPage />} />

      <Route path="/dashboard" element={<ProtectedRoute role="customer"><UserLayout /></ProtectedRoute>}>
        <Route index element={<UserDashboard />} />
        <Route path="orders" element={<UserOrders />} />
        <Route path="services" element={<UserServiceRequests />} />
        <Route path="profile" element={<UserProfile />} />
      </Route>

      <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="leads" element={<AdminLeads />} />
        <Route path="contacts" element={<AdminContacts />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="products" element={<AdminProducts />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
