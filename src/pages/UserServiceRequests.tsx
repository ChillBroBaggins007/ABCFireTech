import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth'
import type { ServiceRequest } from '../lib/supabase'
import { Wrench, Plus, X, Calendar, FileText } from 'lucide-react'

const statusColors: Record<string, string> = {
  requested: 'bg-amber-100 text-amber-700',
  scheduled: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

const serviceTypes = ['installation', 'refill', 'inspection', 'training'] as const

export default function UserServiceRequests() {
  const { profile } = useAuth()
  const [requests, setRequests] = useState<ServiceRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [showNew, setShowNew] = useState(false)
  const [form, setForm] = useState({ service_type: 'installation' as typeof serviceTypes[number], preferred_date: '', notes: '' })

  useEffect(() => {
    async function load() {
      if (!profile) return
      const { data } = await supabase
        .from('service_requests')
        .select('*')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false })
      setRequests(data ?? [])
      setLoading(false)
    }
    load()
  }, [profile])

  async function submitRequest() {
    if (!profile) return
    const { data, error } = await supabase
      .from('service_requests')
      .insert({
        user_id: profile.id,
        service_type: form.service_type,
        status: 'requested',
        preferred_date: form.preferred_date || null,
        notes: form.notes || null,
      })
      .select('*')
      .maybeSingle()
    if (!error && data) {
      setRequests([data as ServiceRequest, ...requests])
      setForm({ service_type: 'installation', preferred_date: '', notes: '' })
      setShowNew(false)
    }
  }

  if (loading) return <div className="h-64 animate-pulse rounded-2xl bg-ink-100" />

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink-900">Service Requests</h1>
          <p className="mt-1 text-ink-500">Request installations, refills, inspections, and training.</p>
        </div>
        <button onClick={() => setShowNew(true)} className="btn-primary">
          <Plus className="h-4 w-4" /> New Request
        </button>
      </div>

      {requests.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-ink-100 text-ink-400">
            <Wrench className="h-8 w-8" />
          </div>
          <p className="text-lg font-semibold text-ink-900">No service requests yet</p>
          <p className="mt-1 text-sm text-ink-500">Click "New Request" to schedule a service.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {requests.map((r) => (
            <div key={r.id} className="card p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 capitalize">
                    <Wrench className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold capitalize text-ink-900">{r.service_type}</p>
                    <p className="text-xs text-ink-500">{new Date(r.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className={`badge ${statusColors[r.status]}`}>{r.status}</span>
              </div>
              {r.preferred_date && (
                <div className="mt-3 flex items-center gap-2 text-sm text-ink-600">
                  <Calendar className="h-4 w-4 text-ink-400" /> Preferred: {new Date(r.preferred_date).toLocaleDateString()}
                </div>
              )}
              {r.notes && (
                <div className="mt-2 flex items-start gap-2 text-sm text-ink-600">
                  <FileText className="mt-0.5 h-4 w-4 flex-shrink-0 text-ink-400" /> {r.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* New request modal */}
      {showNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/50 p-4 backdrop-blur-sm" onClick={() => setShowNew(false)}>
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-ink-900">New Service Request</h2>
              <button onClick={() => setShowNew(false)} className="rounded-lg p-2 text-ink-400 hover:bg-ink-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="label">Service Type</label>
                <select
                  value={form.service_type}
                  onChange={(e) => setForm({ ...form, service_type: e.target.value as any })}
                  className="input"
                >
                  {serviceTypes.map((t) => <option key={t} value={t} className="capitalize">{t}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Preferred Date</label>
                <input type="date" value={form.preferred_date} onChange={(e) => setForm({ ...form, preferred_date: e.target.value })} className="input" />
              </div>
              <div>
                <label className="label">Notes</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Describe your requirements..."
                  rows={3}
                  className="input resize-none"
                />
              </div>
            </div>
            <button onClick={submitRequest} className="btn-primary mt-6 w-full">Submit Request</button>
          </div>
        </div>
      )}
    </div>
  )
}
