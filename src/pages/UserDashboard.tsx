import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Package, Wrench, Clock, CheckCircle2, TrendingUp, ArrowRight } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth'
import type { Order, ServiceRequest } from '../lib/supabase'

const statusColors: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-blue-100 text-blue-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  requested: 'bg-amber-100 text-amber-700',
  scheduled: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
}

export default function UserDashboard() {
  const { profile } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [services, setServices] = useState<ServiceRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      if (!profile) return
      const [ordersRes, servicesRes] = await Promise.all([
        supabase.from('orders').select('*').eq('user_id', profile.id).order('created_at', { ascending: false }),
        supabase.from('service_requests').select('*').eq('user_id', profile.id).order('created_at', { ascending: false }),
      ])
      setOrders(ordersRes.data ?? [])
      setServices(servicesRes.data ?? [])
      setLoading(false)
    }
    load()
  }, [profile])

  const activeOrders = orders.filter((o) => o.status === 'pending' || o.status === 'confirmed')
  const activeServices = services.filter((s) => s.status === 'requested' || s.status === 'scheduled')
  const totalSpent = orders.reduce((sum, o) => sum + Number(o.total), 0)

  if (loading) return <DashboardSkeleton />

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink-900">
          Welcome back, {profile?.full_name?.split(' ')[0]}!
        </h1>
        <p className="mt-1 text-ink-500">Here's an overview of your fire safety account.</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Package} label="Total Orders" value={orders.length} color="brand" />
        <StatCard icon={Clock} label="Active Orders" value={activeOrders.length} color="blue" />
        <StatCard icon={Wrench} label="Service Requests" value={services.length} color="amber" />
        <StatCard icon={TrendingUp} label="Total Spent" value={`$${totalSpent.toFixed(2)}`} color="green" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Recent orders */}
        <div className="card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-ink-900">Recent Orders</h2>
            <Link to="/dashboard/orders" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
              View all
            </Link>
          </div>
          {orders.length === 0 ? (
            <EmptyState text="No orders yet" />
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 4).map((order) => (
                <div key={order.id} className="flex items-center justify-between rounded-xl border border-ink-100 p-3">
                  <div>
                    <p className="text-sm font-semibold text-ink-900">
                      {(order.items as any[]).length} item(s)
                    </p>
                    <p className="text-xs text-ink-500">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-ink-900">${Number(order.total).toFixed(2)}</span>
                    <span className={`badge ${statusColors[order.status]}`}>{order.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Service requests */}
        <div className="card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-ink-900">Service Requests</h2>
            <Link to="/dashboard/services" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
              View all
            </Link>
          </div>
          {services.length === 0 ? (
            <EmptyState text="No service requests yet" />
          ) : (
            <div className="space-y-3">
              {services.slice(0, 4).map((s) => (
                <div key={s.id} className="flex items-center justify-between rounded-xl border border-ink-100 p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                      <Wrench className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold capitalize text-ink-900">{s.service_type}</p>
                      <p className="text-xs text-ink-500">{new Date(s.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className={`badge ${statusColors[s.status]}`}>{s.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link to="/dashboard/orders" className="card group flex items-center gap-4 p-5 transition-all hover:shadow-md hover:-translate-y-0.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <Package className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-ink-900">View Orders</p>
            <p className="text-xs text-ink-500">Track your purchases</p>
          </div>
          <ArrowRight className="h-4 w-4 text-ink-400 transition-transform group-hover:translate-x-1" />
        </Link>
        <Link to="/dashboard/services" className="card group flex items-center gap-4 p-5 transition-all hover:shadow-md hover:-translate-y-0.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <Wrench className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-ink-900">Request Service</p>
            <p className="text-xs text-ink-500">Installation, refill, training</p>
          </div>
          <ArrowRight className="h-4 w-4 text-ink-400 transition-transform group-hover:translate-x-1" />
        </Link>
        <Link to="/dashboard/profile" className="card group flex items-center gap-4 p-5 transition-all hover:shadow-md hover:-translate-y-0.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-ink-900">Update Profile</p>
            <p className="text-xs text-ink-500">Manage your details</p>
          </div>
          <ArrowRight className="h-4 w-4 text-ink-400 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: any; color: string }) {
  const colors: Record<string, string> = {
    brand: 'bg-brand-50 text-brand-600',
    blue: 'bg-blue-50 text-blue-600',
    amber: 'bg-amber-50 text-amber-600',
    green: 'bg-green-50 text-green-600',
  }
  return (
    <div className="stat-card">
      <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${colors[color]}`}>
        <Icon className="h-6 w-6" />
      </div>
      <p className="font-display text-2xl font-extrabold text-ink-900">{value}</p>
      <p className="mt-1 text-sm text-ink-500">{label}</p>
    </div>
  )
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-ink-100 text-ink-400">
        <Package className="h-6 w-6" />
      </div>
      <p className="text-sm text-ink-500">{text}</p>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="mb-8 h-8 w-64 rounded-lg bg-ink-200" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => <div key={i} className="h-32 rounded-2xl bg-ink-100" />)}
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {[...Array(2)].map((_, i) => <div key={i} className="h-64 rounded-2xl bg-ink-100" />)}
      </div>
    </div>
  )
}
