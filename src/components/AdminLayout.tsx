import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Flame, LayoutDashboard, Users, Contact, ShoppingCart, Package, LogOut, Menu, X, Shield } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../lib/auth'

const navItems = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/leads', label: 'Leads (CRM)', icon: Users },
  { to: '/admin/contacts', label: 'Contacts', icon: Contact },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { to: '/admin/products', label: 'Products', icon: Package },
]

export default function AdminLayout() {
  const { profile, signOut } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-ink-50">
      {/* Sidebar — desktop */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col bg-ink-900 lg:flex">
        <div className="flex h-16 items-center gap-2.5 border-b border-ink-800 px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600">
            <Flame className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="font-display text-lg font-bold text-white">ABC Firetech</span>
            <p className="text-xs text-ink-400">Admin Console</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive ? 'bg-brand-600 text-white' : 'text-ink-400 hover:bg-ink-800 hover:text-white'
                }`
              }
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-ink-800 p-4">
          <div className="mb-3 flex items-center gap-3 px-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 font-bold text-white">
              {profile?.full_name?.charAt(0) ?? 'A'}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">{profile?.full_name}</p>
              <p className="flex items-center gap-1 truncate text-xs text-ink-400">
                <Shield className="h-3 w-3" /> Administrator
              </p>
            </div>
          </div>
          <button onClick={handleSignOut} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-400 transition-colors hover:bg-red-900/20 hover:text-red-400">
            <LogOut className="h-5 w-5" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="flex h-16 items-center justify-between bg-ink-900 px-4 lg:hidden">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600">
            <Flame className="h-4 w-4 text-white" />
          </div>
          <span className="font-display text-base font-bold text-white">Admin Console</span>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="rounded-lg p-2 text-ink-400 hover:bg-ink-800">
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="border-b border-ink-800 bg-ink-900 p-4 lg:hidden">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${
                    isActive ? 'bg-brand-600 text-white' : 'text-ink-400 hover:bg-ink-800'
                  }`
                }
              >
                <item.icon className="h-5 w-5" /> {item.label}
              </NavLink>
            ))}
            <button onClick={handleSignOut} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-400 hover:bg-red-900/20">
              <LogOut className="h-5 w-5" /> Sign Out
            </button>
          </nav>
        </div>
      )}

      {/* Main content */}
      <main className="lg:pl-64">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
