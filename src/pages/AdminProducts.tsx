import { useEffect, useState, useMemo } from 'react'
import { supabase } from '../lib/supabase'
import type { Product } from '../lib/supabase'
import { Plus, X, Search, Trash2, Package, Pencil } from 'lucide-react'

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [form, setForm] = useState({ name: '', category: '', description: '', price: '', stock: '', image_url: '' })

  useEffect(() => { load() }, [])

  async function load() {
    const { data } = await supabase.from('products').select('*').order('name')
    setProducts(data ?? [])
    setLoading(false)
  }

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category))
    return ['All', ...Array.from(set).sort()]
  }, [products])

  function openNew() {
    setEditing(null)
    setForm({ name: '', category: '', description: '', price: '', stock: '', image_url: '' })
    setShowForm(true)
  }

  function openEdit(p: Product) {
    setEditing(p)
    setForm({
      name: p.name,
      category: p.category,
      description: p.description ?? '',
      price: String(p.price),
      stock: String(p.stock),
      image_url: p.image_url ?? '',
    })
    setShowForm(true)
  }

  async function saveProduct() {
    const payload = {
      name: form.name,
      category: form.category,
      description: form.description || null,
      price: parseFloat(form.price) || 0,
      stock: parseInt(form.stock) || 0,
      image_url: form.image_url || null,
    }
    if (editing) {
      const { error } = await supabase.from('products').update(payload).eq('id', editing.id)
      if (!error) setProducts(products.map((p) => p.id === editing.id ? { ...p, ...payload } as Product : p))
    } else {
      const { data, error } = await supabase.from('products').insert(payload).select('*').maybeSingle()
      if (!error && data) setProducts([...products, data as Product].sort((a, b) => a.name.localeCompare(b.name)))
    }
    setShowForm(false)
  }

  async function deleteProduct(id: string) {
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (!error) setProducts(products.filter((p) => p.id !== id))
  }

  const filtered = products.filter((p) => {
    const matchesSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory
    return matchesSearch && matchesCategory
  })

  if (loading) return <div className="h-64 animate-pulse rounded-2xl bg-ink-100" />

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink-900">Products</h1>
          <p className="mt-1 text-ink-500">{products.length} products in your catalog.</p>
        </div>
        <button onClick={openNew} className="btn-primary"><Plus className="h-4 w-4" /> Add Product</button>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." className="input pl-11" />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                activeCategory === cat
                  ? 'bg-brand-600 text-white'
                  : 'bg-ink-100 text-ink-600 hover:bg-ink-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((p) => (
          <div key={p.id} className="card group overflow-hidden p-0 transition-all hover:shadow-lg hover:-translate-y-0.5">
            <div className="relative aspect-square overflow-hidden bg-ink-50">
              {p.image_url ? (
                <img
                  src={p.image_url}
                  alt={p.name}
                  loading="lazy"
                  className="h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-ink-300">
                  <Package className="h-12 w-12" />
                </div>
              )}
              <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <button onClick={() => openEdit(p)} className="rounded-lg bg-white/90 p-1.5 text-ink-500 shadow-sm transition-colors hover:bg-white hover:text-ink-700">
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button onClick={() => deleteProduct(p.id)} className="rounded-lg bg-white/90 p-1.5 text-ink-500 shadow-sm transition-colors hover:bg-white hover:text-red-600">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <span className="badge bg-brand-50 text-brand-700">{p.category}</span>
              <h3 className="mt-2 text-sm font-semibold leading-snug text-ink-900 line-clamp-2">{p.name}</h3>
              {p.description && <p className="mt-1 text-xs text-ink-500 line-clamp-2">{p.description}</p>}
              <div className="mt-3 flex items-center justify-between border-t border-ink-100 pt-3">
                <span className="font-display text-base font-bold text-ink-900">{Number(p.price) > 0 ? `$${Number(p.price).toFixed(2)}` : 'Price on request'}</span>
                <span className={`badge ${p.stock > 10 ? 'bg-green-100 text-green-700' : p.stock > 0 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                  {p.stock} in stock
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="card flex flex-col items-center justify-center py-12 text-center">
          <Package className="mb-3 h-10 w-10 text-ink-300" />
          <p className="text-sm text-ink-500">No products found.</p>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/50 p-4 backdrop-blur-sm" onClick={() => setShowForm(false)}>
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-ink-900">{editing ? 'Edit Product' : 'Add Product'}</h2>
              <button onClick={() => setShowForm(false)} className="rounded-lg p-2 text-ink-400 hover:bg-ink-100"><X className="h-5 w-5" /></button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2"><label className="label">Name *</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" /></div>
              <div><label className="label">Category *</label><input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input" /></div>
              <div><label className="label">Price ($)</label><input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input" /></div>
              <div><label className="label">Stock *</label><input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="input" /></div>
              <div className="sm:col-span-2"><label className="label">Image URL</label><input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." className="input" /></div>
              <div className="sm:col-span-2"><label className="label">Description</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="input resize-none" /></div>
            </div>
            <button onClick={saveProduct} disabled={!form.name || !form.category} className="btn-primary mt-6 w-full">
              {editing ? 'Save Changes' : 'Add Product'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
