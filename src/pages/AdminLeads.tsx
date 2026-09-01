import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Lead } from '../lib/supabase'
import { Plus, X, Search, Users, Trash2, Mail, Phone } from 'lucide-react'

const statusColors: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700',
  contacted: 'bg-amber-100 text-amber-700',
  qualified: 'bg-brand-100 text-brand-700',
  won: 'bg-green-100 text-green-700',
  lost: 'bg-red-100 text-red-700',
}

const statusOptions = ['new', 'contacted', 'qualified', 'won', 'lost']

export default function AdminLeads() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showNew, setShowNew] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', source: 'website', status: 'new', notes: '' })

  useEffect(() => { load() }, [])

  async function load() {
    const { data } = await supabase.from('leads').select('*').order('created_at', { ascending: false })
    setLeads(data ?? [])
    setLoading(false)
  }

  async function addLead() {
    const { data, error } = await supabase
      .from('leads')
      .insert({ name: form.name, email: form.email, phone: form.phone || null, company: form.company || null, source: form.source, status: form.status, notes: form.notes || null })
      .select('*')
      .maybeSingle()
    if (!error && data) {
      setLeads([data as Lead, ...leads])
      setForm({ name: '', email: '', phone: '', company: '', source: 'website', status: 'new', notes: '' })
      setShowNew(false)
    }
  }

  async function updateStatus(id: string, status: string) {
    const { error } = await supabase.from('leads').update({ status }).eq('id', id)
    if (!error) setLeads(leads.map((l) => l.id === id ? { ...l, status: status as Lead['status'] } : l))
  }

  async function deleteLead(id: string) {
    const { error } = await supabase.from('leads').delete().eq('id', id)
    if (!error) setLeads(leads.filter((l) => l.id !== id))
  }

  const filtered = leads.filter((l) => {
    const matchesSearch = !search || l.name.toLowerCase().includes(search.toLowerCase()) || l.email.toLowerCase().includes(search.toLowerCase()) || (l.company ?? '').toLowerCase().includes(search.toLowerCase())
    const matchesStatus = filterStatus === 'all' || l.status === filterStatus
    return matchesSearch && matchesStatus
  })

  if (loading) return <div className="h-64 animate-pulse rounded-2xl bg-ink-100" />

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink-900">Leads (CRM)</h1>
          <p className="mt-1 text-ink-500">{leads.length} leads in your pipeline.</p>
        </div>
        <button onClick={() => setShowNew(true)} className="btn-primary"><Plus className="h-4 w-4" /> Add Lead</button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search leads..." className="input pl-11" />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="input w-auto">
          <option value="all">All Statuses</option>
          {statusOptions.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-ink-200 bg-ink-50 text-left text-xs font-semibold uppercase tracking-wide text-ink-500">
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Company</th>
                <th className="hidden px-5 py-3 md:table-cell">Source</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead) => (
                <tr key={lead.id} className="border-b border-ink-100 transition-colors hover:bg-ink-50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 font-bold text-brand-700">
                        {lead.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-ink-900">{lead.name}</p>
                        <p className="text-xs text-ink-500">{lead.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-ink-600">{lead.company ?? '—'}</td>
                  <td className="hidden px-5 py-3 text-sm text-ink-600 md:table-cell">{lead.source}</td>
                  <td className="px-5 py-3">
                    <select
                      value={lead.status}
                      onChange={(e) => updateStatus(lead.id, e.target.value)}
                      className={`cursor-pointer rounded-full border-0 px-2.5 py-1 text-xs font-semibold capitalize outline-none ${statusColors[lead.status]}`}
                    >
                      {statusOptions.map((s) => <option key={s} value={s} className="bg-white text-ink-900">{s}</option>)}
                    </select>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button onClick={() => deleteLead(lead.id)} className="rounded-lg p-2 text-ink-400 transition-colors hover:bg-red-50 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Users className="mb-3 h-10 w-10 text-ink-300" />
            <p className="text-sm text-ink-500">No leads found.</p>
          </div>
        )}
      </div>

      {/* New lead modal */}
      {showNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/50 p-4 backdrop-blur-sm" onClick={() => setShowNew(false)}>
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-ink-900">Add New Lead</h2>
              <button onClick={() => setShowNew(false)} className="rounded-lg p-2 text-ink-400 hover:bg-ink-100"><X className="h-5 w-5" /></button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><label className="label">Name *</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" /></div>
              <div><label className="label">Email *</label><input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input" /></div>
              <div><label className="label">Phone</label><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input" /></div>
              <div><label className="label">Company</label><input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="input" /></div>
              <div><label className="label">Source</label>
                <select value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} className="input">
                  <option value="website">Website</option><option value="referral">Referral</option><option value="phone">Phone</option><option value="trade_show">Trade Show</option>
                </select>
              </div>
              <div><label className="label">Status</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="input">
                  {statusOptions.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
                </select>
              </div>
            </div>
            <div className="mt-4"><label className="label">Notes</label><textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} className="input resize-none" /></div>
            <button onClick={addLead} disabled={!form.name || !form.email} className="btn-primary mt-6 w-full">Add Lead</button>
          </div>
        </div>
      )}
    </div>
  )
}
