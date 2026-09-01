import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Order, Profile } from '../lib/supabase'
import { Search, ShoppingCart, Package } from 'lucide-react'

const statusColors: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-blue-100 text-blue-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

const statusOptions = ['pending', 'confirmed', 'delivered', 'cancelled']

export default function AdminOrders() {
  const [orders, setOrders] = useState<(Order & { profiles?: Profile })[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => { load() }, [])

  async function load() {
    const { data } = await supabase
      .from('orders')
      .select('*, profiles!orders_user_id_fkey(*)')
      .order('created_at', { ascending: false })
    setOrders((data ?? []) as any)
    setLoading(false)
  }

  async function updateStatus(id: string, status: string) {
    const { error } = await supabase.from('orders').update({ status }).eq('id', id)
    if (!error) setOrders(orders.map((o) => o.id === id ? { ...o, status: status as Order['status'] } : o))
  }

  const filtered = orders.filter((o) => {
    const customerName = o.profiles?.full_name ?? ''
    const matchesSearch = !search || customerName.toLowerCase().includes(search.toLowerCase()) || o.id.includes(search)
    const matchesStatus = filterStatus === 'all' || o.status === filterStatus
    return matchesSearch && matchesStatus
  })

  if (loading) return <div className="h-64 animate-pulse rounded-2xl bg-ink-100" />

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink-900">All Orders</h1>
        <p className="mt-1 text-ink-500">{orders.length} total orders across all customers.</p>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by customer or order ID..." className="input pl-11" />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="input w-auto">
          <option value="all">All Statuses</option>
          {statusOptions.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
        </select>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-ink-200 bg-ink-50 text-left text-xs font-semibold uppercase tracking-wide text-ink-500">
                <th className="px-5 py-3">Order ID</th>
                <th className="px-5 py-3">Customer</th>
                <th className="hidden px-5 py-3 md:table-cell">Items</th>
                <th className="px-5 py-3">Total</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr key={order.id} className="border-b border-ink-100 transition-colors hover:bg-ink-50">
                  <td className="px-5 py-3 font-mono text-xs text-ink-600">#{order.id.slice(0, 8)}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
                        {order.profiles?.full_name?.charAt(0) ?? '?'}
                      </div>
                      <span className="text-sm font-medium text-ink-900">{order.profiles?.full_name ?? 'Unknown'}</span>
                    </div>
                  </td>
                  <td className="hidden px-5 py-3 text-sm text-ink-600 md:table-cell">
                    {(order.items as any[]).map((item, i) => (
                      <span key={i} className="block text-xs">{item.product_name} ×{item.quantity}</span>
                    ))}
                  </td>
                  <td className="px-5 py-3 text-sm font-bold text-ink-900">${Number(order.total).toFixed(2)}</td>
                  <td className="px-5 py-3 text-sm text-ink-500">{new Date(order.created_at).toLocaleDateString()}</td>
                  <td className="px-5 py-3">
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      className={`cursor-pointer rounded-full border-0 px-2.5 py-1 text-xs font-semibold capitalize outline-none ${statusColors[order.status]}`}
                    >
                      {statusOptions.map((s) => <option key={s} value={s} className="bg-white text-ink-900">{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <ShoppingCart className="mb-3 h-10 w-10 text-ink-300" />
            <p className="text-sm text-ink-500">No orders found.</p>
          </div>
        )}
      </div>
    </div>
  )
}
