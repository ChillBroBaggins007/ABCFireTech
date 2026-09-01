import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Flame, Search, Package, ArrowRight, Menu, X } from 'lucide-react'
import { supabase } from '../lib/supabase'
import type { Product } from '../lib/supabase'

const sidebarCategories = [
  {
    title: 'Fire Safety',
    sections: [
      {
        heading: 'Fire Detection & Alarm Systems',
        items: [
          'Conventional Fire Alarm Systems',
          'Addressable Fire Alarm Systems',
          'Wireless Fire Alarm Systems',
          'Aspirating Smoke Detection',
          'Linear Heat Detection Cables',
          'Leak Detection System',
          'Fire Alarm Cable',
          'Detector Testers',
          'Fire Telephone System and Emergency Voice Control Panel',
          'Gas Extinguishing System',
        ],
      },
      {
        heading: 'Explosion-Proof Fire Safety & Hazardous Area Equipment',
        items: [],
      },
      {
        heading: 'Fire Suppression Systems',
        items: [
          'Clean Agent Suppression Systems',
          'Water Monitors & Deluge Systems',
          'Aerosol Fire Extinguishing Systems',
        ],
      },
      {
        heading: 'Water-Based Fire Fighting Systems',
        items: [],
      },
    ],
  },
]

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('products').select('*').order('name')
      setProducts(data ?? [])
      setLoading(false)
    }
    load()
  }, [])

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category))
    return ['All', ...Array.from(set).sort()]
  }, [products])

  const filtered = products.filter((p) => {
    const matchesSearch = !search || p.name.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-ink-50">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-ink-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 shadow-lg shadow-brand-600/30">
              <Flame className="h-6 w-6 text-white" />
            </div>
            <span className="font-display text-xl font-extrabold tracking-tight text-ink-900">ABC Firetech</span>
          </Link>
          <div className="hidden items-center gap-8 md:flex">
            <Link to="/" className="text-sm font-medium text-ink-600 transition-colors hover:text-brand-600">Home</Link>
            <Link to="/products" className="text-sm font-medium text-brand-600">Products</Link>
            <Link to="/signin" className="text-sm font-medium text-ink-600 transition-colors hover:text-brand-600">Sign In</Link>
            <Link to="/signin" className="btn-primary">Client Portal</Link>
          </div>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="rounded-lg p-2 text-ink-600 hover:bg-ink-100 lg:hidden">
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <div className="mx-auto flex max-w-7xl gap-8 px-6 py-8">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'block' : 'hidden'} w-64 flex-shrink-0 lg:block`}>
          <div className="sticky top-24 space-y-6">
            {sidebarCategories.map((cat) => (
              <div key={cat.title}>
                <h2 className="mb-3 font-display text-lg font-bold text-ink-900">{cat.title}</h2>
                {cat.sections.map((section) => (
                  <div key={section.heading} className="mb-4">
                    <h3 className="mb-2 text-sm font-semibold text-ink-700">{section.heading}</h3>
                    {section.items.length > 0 && (
                      <ul className="space-y-1">
                        {section.items.map((item) => (
                          <li key={item}>
                            <button
                              onClick={() => setActiveCategory(item)}
                              className={`text-left text-xs leading-relaxed transition-colors ${
                                activeCategory === item ? 'text-brand-600 font-semibold' : 'text-ink-500 hover:text-brand-600'
                              }`}
                            >
                              {item}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1">
          <div className="mb-6">
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink-900">Products</h1>
            <p className="mt-1 text-ink-500">{filtered.length} products available.</p>
          </div>

          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative max-w-md flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="input pl-11"
              />
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

          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse rounded-2xl bg-white p-4 shadow-sm">
                  <div className="aspect-square rounded-xl bg-ink-100" />
                  <div className="mt-3 h-4 w-3/4 rounded bg-ink-100" />
                  <div className="mt-2 h-3 w-1/2 rounded bg-ink-100" />
                </div>
              ))}
            </div>
          ) : (
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
                  </div>
                  <div className="p-4">
                    <span className="badge bg-brand-50 text-brand-700">{p.category}</span>
                    <h3 className="mt-2 text-sm font-semibold leading-snug text-ink-900 line-clamp-2">{p.name}</h3>
                    {p.description && <p className="mt-1 text-xs text-ink-500 line-clamp-2">{p.description}</p>}
                    <div className="mt-3 border-t border-ink-100 pt-3">
                      <span className="font-display text-base font-bold text-ink-900">
                        {Number(p.price) > 0 ? `$${Number(p.price).toFixed(2)}` : 'Price on request'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="card flex flex-col items-center justify-center py-12 text-center">
              <Package className="mb-3 h-10 w-10 text-ink-300" />
              <p className="text-sm text-ink-500">No products found.</p>
            </div>
          )}

          {/* CTA */}
          <div className="mt-12 rounded-3xl gradient-brand p-8 text-center md:p-12">
            <h2 className="font-display text-2xl font-extrabold tracking-tight text-white text-balance md:text-3xl">
              Need help choosing the right fire safety equipment?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-white/80">
              Our experts are ready to help you select the best products for your needs.
            </p>
            <Link to="/signin" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-brand-700 shadow-lg transition-all hover:bg-brand-50 active:scale-[0.98]">
              Contact Us <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-ink-950 py-8">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600">
                <Flame className="h-5 w-5 text-white" />
              </div>
              <span className="font-display text-lg font-bold text-white">ABC Firetech</span>
            </div>
            <p className="text-sm text-ink-500">© 2026 ABC Firetech. Fire safety & protection solutions.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
