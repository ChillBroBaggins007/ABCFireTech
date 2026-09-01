import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
})

export type UserRole = 'admin' | 'customer'

export interface Profile {
  id: string
  email: string
  full_name: string
  phone: string | null
  company: string | null
  role: UserRole
  created_at: string
}

export interface Product {
  id: string
  name: string
  category: string
  description: string
  price: number
  stock: number
  image_url: string | null
  created_at: string
}

export interface Order {
  id: string
  user_id: string
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled'
  total: number
  items: OrderItem[]
  created_at: string
}

export interface OrderItem {
  product_id: string
  product_name: string
  quantity: number
  unit_price: number
}

export interface ServiceRequest {
  id: string
  user_id: string
  service_type: 'installation' | 'refill' | 'inspection' | 'training'
  status: 'requested' | 'scheduled' | 'completed' | 'cancelled'
  preferred_date: string | null
  notes: string | null
  created_at: string
}

export interface Lead {
  id: string
  name: string
  email: string
  phone: string | null
  company: string | null
  source: string
  status: 'new' | 'contacted' | 'qualified' | 'won' | 'lost'
  notes: string | null
  created_at: string
}

export interface Contact {
  id: string
  name: string
  email: string
  phone: string | null
  company: string | null
  location: string | null
  notes: string | null
  created_at: string
}
