import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Contact } from '../lib/supabase'
import { Plus, X, Search, Trash2, Mail, Phone, MapPin, Building } from 'lucide-react'

export default function AdminContacts() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showNew, setShowNew] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', location: '', notes: '' })

  useEffect(() => { load() }, [])

  async function load() {
    const { data } = await supabase.from('contacts').select('*').order('created_at', { ascending: false })
    setContacts(data ?? [])
    setLoading(false)
  }

  async function addContact() {
    const { data, error } = await supabase
      .from('contacts')
      .insert({
        name: form.name,
        email: form.email,
        phone: form.phone || null,
        company: form.company || null,
        location: form.location || null,
        notes: form.notes || null,
      })
      .select('*')
      .maybeSingle()
    if (!error && data) {
      setContacts([data as Contact, ...contacts])
      setForm({ name: '', email: '', phone: '', company: '', location: '', notes: '' })
      setShowNew(false)
    }
  }

  async function deleteContact(id: string) {
    const { error } = await supabase.from('contacts').delete().eq('id', id)
    if (!error) setContacts(contacts.filter((c) => c.id !== id))
  }

  const filtered = contacts.filter((c) =>
    !search ||
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    (c.company ?? '').toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <div className="h-64 animate-pulse rounded-2xl bg-ink-100" />

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink-900">Contacts</h1>
          <p className="mt-1 text-ink-500">{contacts.length} contacts in your directory.</p>
        </div>
        <button onClick={() => setShowNew(true)} className="btn-primary"><Plus className="h-4 w-4" /> Add Contact</button>
      </div>

      <div className="mb-6 relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search contacts..." className="input pl-11" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((contact) => (
          <div key={contact.id} className="card p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-100 font-bold text-brand-700">
                  {contact.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-ink-900">{contact.name}</p>
                  <p className="text-xs text-ink-500">{contact.company ?? '—'}</p>
                </div>
              </div>
              <button onClick={() => deleteContact(contact.id)} className="rounded-lg p-1.5 text-ink-400 transition-colors hover:bg-red-50 hover:text-red-600">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <p className="flex items-center gap-2 text-ink-600"><Mail className="h-4 w-4 text-ink-400" /> {contact.email}</p>
              {contact.phone && <p className="flex items-center gap-2 text-ink-600"><Phone className="h-4 w-4 text-ink-400" /> {contact.phone}</p>}
              {contact.location && <p className="flex items-center gap-2 text-ink-600"><MapPin className="h-4 w-4 text-ink-400" /> {contact.location}</p>}
            </div>
            {contact.notes && <p className="mt-3 border-t border-ink-100 pt-3 text-xs text-ink-500">{contact.notes}</p>}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="card flex flex-col items-center justify-center py-12 text-center">
          <Building className="mb-3 h-10 w-10 text-ink-300" />
          <p className="text-sm text-ink-500">No contacts found.</p>
        </div>
      )}

      {showNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/50 p-4 backdrop-blur-sm" onClick={() => setShowNew(false)}>
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-ink-900">Add New Contact</h2>
              <button onClick={() => setShowNew(false)} className="rounded-lg p-2 text-ink-400 hover:bg-ink-100"><X className="h-5 w-5" /></button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><label className="label">Name *</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" /></div>
              <div><label className="label">Email *</label><input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input" /></div>
              <div><label className="label">Phone</label><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input" /></div>
              <div><label className="label">Company</label><input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="input" /></div>
              <div><label className="label">Location</label><input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="input" /></div>
            </div>
            <div className="mt-4"><label className="label">Notes</label><textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} className="input resize-none" /></div>
            <button onClick={addContact} disabled={!form.name || !form.email} className="btn-primary mt-6 w-full">Add Contact</button>
          </div>
        </div>
      )}
    </div>
  )
}
