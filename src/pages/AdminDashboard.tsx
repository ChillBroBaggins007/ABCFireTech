import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Users, ShoppingCart, Package, Wrench, TrendingUp, DollarSign, ArrowRight, Contact } from 'lucide-react'
import { supabase } from '../lib/supabase'
import type { Order, ServiceRequest, Lead, Product, Profile } from '../lib/supabase'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ leads: 0, orders: 0, products: 0, services: 0, revenue: 0, customers: 0 })
  const [recentLeads, setRecentLeads] = useState<Lead[]>([])
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [leadStatusCounts, setLeadStatusCounts] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [leadsRes, ordersRes, productsRes, servicesRes, profilesRes] = await Promise.all([
        supabase.from('leads').select('*').order('created_at', { ascending: false }),
        supabase.from('orders').select('*').order('created_at', { ascending: false }),
        supabase.from('products').select('*'),
        supabase.from('service_requests').select('*'),
        supabase.from('profiles').select('*').eq('role', 'customer'),
      ])
      const leads = leadsRes.data ?? []
      const orders = ordersRes.data ?? []
      const products = productsRes.data ?? []
      const services = servicesRes.data ?? []
      const customers = profilesRes.data ?? []

      setStats({
        leads: leads.length,
        orders: orders.length,
        products: products.length,
        services: services.length,
        revenue: orders.reduce((sum, o) => sum + Number(o.total), 0),
        customers: customers.length,
      })
      setRecentLeads(leads.slice(0, 5))
      setRecentOrders(orders.slice(0, 5))

      const counts: Record<string, number> = {}
      leads.forEach((l) => { counts[l.status] = (counts[l.status] ?? 0) + 1 })
      setLeadStatusCounts(counts)
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <div className="h-64 animate-pulse rounded-2xl bg-ink-100" />

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink-900">Admin Overview</h1>
        <p className="mt-1 text-ink-500">Business performance and CRM at a glance.</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard icon={DollarSign} label="Revenue" value={`$${stats.revenue.toFixed(2)}`} color="green" />
        <StatCard icon={Users} label="Leads" value={stats.leads} color="brand" />
        <StatCard icon={ShoppingCart} label="Orders" value={stats.orders} color="blue" />
        <StatCard icon={Contact} label="Customers" value={stats.customers} color="amber" />
        <StatCard icon={Package} label="Products" value={stats.products} color="ink" />
        <StatCard icon={Wrench} label="Services" value={stats.services} color="brand" />
      </div>

      {/* Lead pipeline */}
      <div className="mt-8 card p-6">
        <h2 className="mb-4 font-display text-lg font-bold text-ink-900">Lead Pipeline</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          {['new', 'contacted', 'qualified', 'won', 'lost'].map((status) => (
            <div key={status} className="rounded-xl border border-ink-100 p-4 text-center">
              <p className="font-display text-2xl font-extrabold text-ink-900">{leadStatusCounts[status] ?? 0}</p>
              <p className="mt-1 text-xs capitalize text-ink-500">{status}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Recent leads */}
        <div className="card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-ink-900">Recent Leads</h2>
            <Link to="/admin/leads" className="text-sm font-semibold text-brand-600 hover:text-brand-700">View all</Link>
          </div>
          <div className="space-y-2">
            {recentLeads.map((lead) => (
              <div key={lead.id} className="flex items-center justify-between rounded-xl border border-ink-100 p-3">
                <div>
                  <p className="text-sm font-semibold text-ink-900">{lead.name}</p>
                  <p className="text-xs text-ink-500">{lead.company}</p>
                </div>
                <span className={`badge ${leadStatusBadge(lead.status)}`}>{lead.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent orders */}
        <div className="card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-ink-900">Recent Orders</h2>
            <Link to="/admin/orders" className="text-sm font-semibold text-brand-600 hover:text-brand-700">View all</Link>
          </div>
          <div className="space-y-2">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between rounded-xl border border-ink-100 p-3">
                <div>
                  <p className="text-sm font-semibold text-ink-900">Order #{order.id.slice(0, 8)}</p>
                  <p className="text-xs text-ink-500">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-ink-900">${Number(order.total).toFixed(2)}</span>
                  <span className={`badge ${orderStatusBadge(order.status)}`}>{order.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <QuickLink to="/admin/leads" icon={Users} label="Manage Leads" />
        <QuickLink to="/admin/contacts" icon={Contact} label="Contacts" />
        <QuickLink to="/admin/products" icon={Package} label="Products" />
        <QuickLink to="/admin/orders" icon={ShoppingCart} label="Orders" />
      </div>
    </div>
  )
}

function leadStatusBadge(status: string) {
  const colors: Record<string, string> = {
    new: 'bg-blue-100 text-blue-700',
    contacted: 'bg-amber-100 text-amber-700',
    qualified: 'bg-brand-100 text-brand-700',
    won: 'bg-green-100 text-green-700',
    lost: 'bg-red-100 text-red-700',
  }
  return colors[status] ?? 'bg-ink-100 text-ink-700'
}

function orderStatusBadge(status: string) {
  const colors: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700',
    confirmed: 'bg-blue-100 text-blue-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  }
  return colors[status] ?? 'bg-ink-100 text-ink-700'
}

function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: any; color: string }) {
  const colors: Record<string, string> = {
    brand: 'bg-brand-50 text-brand-600',
    blue: 'bg-blue-50 text-blue-600',
    amber: 'bg-amber-50 text-amber-600',
    green: 'bg-green-50 text-green-600',
    ink: 'bg-ink-100 text-ink-600',
  }
  return (
    <div className="stat-card">
      <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${colors[color]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="font-display text-xl font-extrabold text-ink-900">{value}</p>
      <p className="mt-0.5 text-xs text-ink-500">{label}</p>
    </div>
  )
}

function QuickLink({ to, icon: Icon, label }: { to: string; icon: any; label: string }) {
  return (
    <Link to={to} className="card group flex items-center gap-4 p-5 transition-all hover:shadow-md hover:-translate-y-0.5">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
        <Icon className="h-5 w-5" />
      </div>
      <span className="flex-1 text-sm font-semibold text-ink-900">{label}</span>
      <ArrowRight className="h-4 w-4 text-ink-400 transition-transform group-hover:translate-x-1" />
    </Link>
  )
}
