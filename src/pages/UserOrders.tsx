import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth as useAuthCtx } from '../lib/auth'
import type { Order, Product } from '../lib/supabase'
import { Package, Plus, X, ShoppingCart } from 'lucide-react'

const statusColors: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-blue-100 text-blue-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

export default function UserOrders() {
  const { profile } = useAuthCtx()
  const [orders, setOrders] = useState<Order[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showNew, setShowNew] = useState(false)
  const [cart, setCart] = useState<Record<string, number>>({})

  useEffect(() => {
    async function load() {
      if (!profile) return
      const [ordersRes, productsRes] = await Promise.all([
        supabase.from('orders').select('*').eq('user_id', profile.id).order('created_at', { ascending: false }),
        supabase.from('products').select('*').order('name'),
      ])
      setOrders(ordersRes.data ?? [])
      setProducts(productsRes.data ?? [])
      setLoading(false)
    }
    load()
  }, [profile])

  async function placeOrder() {
    if (!profile || !cart) return
    const items = Object.entries(cart).map(([productId, qty]) => {
      const product = products.find((p) => p.id === productId)!
      return { product_id: productId, product_name: product.name, quantity: qty, unit_price: Number(product.price) }
    })
    const total = items.reduce((sum, i) => sum + i.unit_price * i.quantity, 0)
    const { data, error } = await supabase
      .from('orders')
      .insert({ user_id: profile.id, status: 'pending', total, items })
      .select('*')
      .maybeSingle()
    if (!error && data) {
      setOrders([data as Order, ...orders])
      setCart({})
      setShowNew(false)
    }
  }

  if (loading) return <div className="h-64 animate-pulse rounded-2xl bg-ink-100" />

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink-900">My Orders</h1>
          <p className="mt-1 text-ink-500">Track and manage your product orders.</p>
        </div>
        <button onClick={() => setShowNew(true)} className="btn-primary">
          <Plus className="h-4 w-4" /> New Order
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-ink-100 text-ink-400">
            <ShoppingCart className="h-8 w-8" />
          </div>
          <p className="text-lg font-semibold text-ink-900">No orders yet</p>
          <p className="mt-1 text-sm text-ink-500">Click "New Order" to place your first order.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="card p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                    <Package className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-ink-900">Order #{order.id.slice(0, 8)}</p>
                    <p className="text-xs text-ink-500">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-display text-lg font-bold text-ink-900">${Number(order.total).toFixed(2)}</span>
                  <span className={`badge ${statusColors[order.status]}`}>{order.status}</span>
                </div>
              </div>
              <div className="mt-4 border-t border-ink-100 pt-3">
                <div className="space-y-1.5">
                  {(order.items as any[]).map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="text-ink-600">{item.product_name}</span>
                      <span className="text-ink-500">×{item.quantity} @ ${Number(item.unit_price).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New order modal */}
      {showNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/50 p-4 backdrop-blur-sm" onClick={() => setShowNew(false)}>
          <div className="max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-ink-900">Place New Order</h2>
              <button onClick={() => setShowNew(false)} className="rounded-lg p-2 text-ink-400 hover:bg-ink-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-2">
              {products.map((p) => (
                <div key={p.id} className="flex items-center justify-between rounded-xl border border-ink-100 p-3">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-ink-900">{p.name}</p>
                    <p className="text-xs text-ink-500">{p.category} · ${Number(p.price).toFixed(2)} · {p.stock} in stock</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCart((c) => ({ ...c, [p.id]: Math.max(0, (c[p.id] ?? 0) - 1) }))}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-ink-200 text-ink-600 hover:bg-ink-100"
                    >−</button>
                    <span className="w-8 text-center text-sm font-semibold">{cart[p.id] ?? 0}</span>
                    <button
                      onClick={() => setCart((c) => ({ ...c, [p.id]: (c[p.id] ?? 0) + 1 }))}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-ink-200 text-ink-600 hover:bg-ink-100"
                    >+</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center justify-between border-t border-ink-100 pt-4">
              <div>
                <p className="text-sm text-ink-500">Total</p>
                <p className="font-display text-2xl font-bold text-ink-900">
                  ${Object.entries(cart).reduce((sum, [id, qty]) => {
                    const p = products.find((x) => x.id === id)
                    return sum + (p ? Number(p.price) * qty : 0)
                  }, 0).toFixed(2)}
                </p>
              </div>
              <button onClick={placeOrder} disabled={Object.keys(cart).length === 0} className="btn-primary">
                Place Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
