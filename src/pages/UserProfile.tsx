import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth'
import { User, Mail, Phone, Building, Save, CheckCircle2 } from 'lucide-react'

export default function UserProfile() {
  const { profile, session } = useAuth()
  const [fullName, setFullName] = useState(profile?.full_name ?? '')
  const [phone, setPhone] = useState(profile?.phone ?? '')
  const [company, setCompany] = useState(profile?.company ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSave() {
    if (!profile) return
    setSaving(true)
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName, phone, company })
      .eq('id', profile.id)
    setSaving(false)
    if (!error) {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
  }

  if (!profile) return null

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink-900">Profile Settings</h1>
        <p className="mt-1 text-ink-500">Manage your account details.</p>
      </div>

      <div className="card p-6">
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-100 font-display text-3xl font-bold text-brand-700">
            {profile.full_name?.charAt(0) ?? 'U'}
          </div>
          <div>
            <p className="font-display text-xl font-bold text-ink-900">{profile.full_name}</p>
            <p className="text-sm text-ink-500">{profile.email}</p>
            <span className="badge mt-2 bg-brand-50 text-brand-700 capitalize">{profile.role}</span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="label">Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
              <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="input pl-11" />
            </div>
          </div>
          <div>
            <label className="label">Email (read-only)</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
              <input value={profile.email} disabled className="input pl-11 bg-ink-50 text-ink-500" />
            </div>
          </div>
          <div>
            <label className="label">Phone</label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
              <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+263 ..." className="input pl-11" />
            </div>
          </div>
          <div>
            <label className="label">Company</label>
            <div className="relative">
              <Building className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
              <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Your company name" className="input pl-11" />
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button onClick={handleSave} disabled={saving} className="btn-primary">
            {saving ? 'Saving...' : 'Save Changes'} <Save className="h-4 w-4" />
          </button>
          {saved && (
            <span className="flex items-center gap-1.5 text-sm font-medium text-green-600">
              <CheckCircle2 className="h-4 w-4" /> Saved successfully
            </span>
          )}
        </div>
      </div>

      <div className="card mt-6 p-6">
        <h2 className="font-display text-lg font-bold text-ink-900">Account Info</h2>
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between border-b border-ink-100 py-2">
            <span className="text-ink-500">Member since</span>
            <span className="font-medium text-ink-900">{new Date(profile.created_at).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between border-b border-ink-100 py-2">
            <span className="text-ink-500">Account type</span>
            <span className="font-medium capitalize text-ink-900">{profile.role}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-ink-500">User ID</span>
            <span className="font-mono text-xs text-ink-400">{profile.id.slice(0, 12)}...</span>
          </div>
        </div>
      </div>
    </div>
  )
}
