import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import { Flame, Shield, Wrench, GraduationCap, Phone, Mail, MapPin, CheckCircle2, ArrowRight, Star, Users, Award, Truck } from 'lucide-react'

const heroImg = 'https://images.pexels.com/photos/12939477/pexels-photo-12939477.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'
const trainingImg = 'https://images.pexels.com/photos/18340568/pexels-photo-18340568.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'
const productsImg = 'https://images.pexels.com/photos/12072478/pexels-photo-12072478.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'

const services = [
  { icon: Flame, title: 'Fire Extinguishers', desc: 'ABC dry powder, CO2, water, and foam extinguishers certified to local and international standards.' },
  { icon: Wrench, title: 'Servicing & Refills', desc: 'Professional maintenance, refills, and inspections to keep your equipment always ready.' },
  { icon: GraduationCap, title: 'Staff Training', desc: 'Hands-on fire safety training for your team — compliance made practical.' },
  { icon: Shield, title: 'Risk Assessment', desc: 'Expert guidance on choosing the right extinguisher for every fire type in your premises.' },
]

const stats = [
  { icon: Users, value: '500+', label: 'Clients Served' },
  { icon: Award, value: '15+', label: 'Years Experience' },
  { icon: Truck, value: '3', label: 'Branches Nationwide' },
  { icon: Shield, value: '100%', label: 'Compliance Rate' },
]

const testimonials = [
  { name: 'James Banda', role: 'Procurement Manager, Delta Beverages', text: 'ABC Firetech has been our trusted fire safety partner for years. Their response time and professionalism are unmatched in Zimbabwe.' },
  { name: 'Grace Moyo', role: 'Bursar, Eaglesvale School', text: 'From installation to training, the team handled everything seamlessly. Our staff now feel confident about fire safety.' },
  { name: 'Robert Phiri', role: 'Site Safety Officer, Zimbabwe Mining Corp', text: 'They understood our specialized mining site requirements immediately. Top-quality equipment and expert advice.' },
]

const branches = [
  { city: 'Harare', phone: '0783 862 277 / 0786 256 665', email: 'firetechhre@gmail.com' },
  { city: 'Bulawayo', phone: '09-66442 / 887532', email: 'firetechmgt@gmail.com' },
  { city: 'Mutare', phone: '0220 202 1101', email: 'firetechmutare@gmail.com' },
]

export default function LandingPage() {
  useEffect(() => {
    const nav = document.getElementById('navbar')
    if (!nav) return
    const onScroll = () => {
      if (window.scrollY > 30) {
        nav.style.background = 'rgba(15,23,42,0.85)'
        nav.style.backdropFilter = 'blur(12px)'
        nav.style.borderBottomColor = 'rgba(255,255,255,0.08)'
      } else {
        nav.style.background = 'transparent'
        nav.style.backdropFilter = 'none'
        nav.style.borderBottomColor = 'transparent'
      }
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="min-h-screen bg-ink-50">
      {/* Nav */}
      <nav className="fixed top-0 z-50 w-full border-b border-transparent transition-all" id="navbar">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 shadow-lg shadow-brand-600/30">
              <Flame className="h-6 w-6 text-white" />
            </div>
            <span className="font-display text-xl font-extrabold tracking-tight text-white">ABC Firetech</span>
          </Link>
          <div className="hidden items-center gap-8 md:flex">
            <a href="#services" className="text-sm font-medium text-white/80 transition-colors hover:text-white">Services</a>
            <Link to="/products" className="text-sm font-medium text-white/80 transition-colors hover:text-white">Products</Link>
            <a href="#testimonials" className="text-sm font-medium text-white/80 transition-colors hover:text-white">Clients</a>
            <a href="#contact" className="text-sm font-medium text-white/80 transition-colors hover:text-white">Contact</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/signin" className="btn-ghost text-white/90 hover:bg-white/10">Sign In</Link>
            <Link to="/signin" className="btn-primary">Client Portal</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative gradient-hero overflow-hidden pt-32 pb-24">
        <div className="absolute inset-0 opacity-20">
          <img src={heroImg} alt="" className="h-full w-full object-cover" />
        </div>
        <div className="absolute -right-24 top-20 h-96 w-96 rounded-full bg-brand-600/20 blur-3xl" />
        <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-brand-500/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="max-w-3xl animate-slide-up">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white/90 backdrop-blur">
              <span className="flex h-2 w-2 rounded-full bg-brand-400" />
              Trusted fire safety partner across Zimbabwe
            </div>
            <h1 className="font-display text-5xl font-extrabold leading-[1.1] tracking-tight text-white text-balance md:text-6xl lg:text-7xl">
              Is Your Fire Safety <span className="text-brand-400">Compliant?</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70">
              We supply top-quality fire extinguishers and safety equipment that meet local and international standards. Ensure your property and staff are protected with reliable solutions from trusted brands.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a href="#contact" className="btn-primary text-base">
                Get In Touch Today <ArrowRight className="h-4 w-4" />
              </a>
              <a href="#services" className="btn-outline border-white/20 text-white hover:bg-white/10">
                Explore Services
              </a>
            </div>
            <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-white/60">
              <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-brand-400" /> Certified Equipment</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-brand-400" /> Expert Installation</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-brand-400" /> Nationwide Service</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-ink-200 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-6 py-12 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <s.icon className="h-6 w-6" />
              </div>
              <span className="font-display text-3xl font-extrabold text-ink-900">{s.value}</span>
              <span className="mt-1 text-sm text-ink-500">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <span className="badge bg-brand-50 text-brand-700">Our Services</span>
            <h2 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-ink-900 text-balance">
              Complete Fire Safety Solutions
            </h2>
            <p className="mt-4 text-lg text-ink-500">
              From supply to servicing to training — everything you need to stay compliant and protected.
            </p>
          </div>
          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {services.map((s, i) => (
              <div key={s.title} className="card group p-6 transition-all hover:shadow-lg hover:-translate-y-1" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                  <s.icon className="h-7 w-7" />
                </div>
                <h3 className="font-display text-lg font-bold text-ink-900">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products showcase */}
      <section id="products" className="bg-ink-900 py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2">
          <div>
            <span className="badge bg-brand-600/20 text-brand-400">Our Products</span>
            <h2 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-white text-balance">
              Built for Every Environment
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-ink-400">
              Whether it's a commercial, industrial, or residential setting, our ABC extinguishers are designed for quick response and efficiency. Tested for performance and approved for safety.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                'ABC dry powder for Class A, B & C fires',
                'CO2 extinguishers for electrical fires',
                'Water and foam for specific fire types',
                'Fire blankets, hoses, detectors, and signage',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-ink-200">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-brand-400" />
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
            <Link to="/products" className="btn-primary mt-8">
              Browse Catalog <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="relative">
            <div className="overflow-hidden rounded-3xl shadow-2xl">
              <img src={productsImg} alt="Fire extinguishers" className="h-full w-full object-cover" />
            </div>
            <div className="absolute -bottom-6 -left-6 hidden rounded-2xl bg-white p-5 shadow-xl md:block">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <Shield className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-display text-lg font-bold text-ink-900">Certified Safe</p>
                  <p className="text-xs text-ink-500">All products meet international standards</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Training CTA */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="relative overflow-hidden rounded-3xl gradient-brand p-10 md:p-16">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
            <div className="relative grid items-center gap-10 lg:grid-cols-2">
              <div>
                <h2 className="font-display text-4xl font-extrabold tracking-tight text-white text-balance">
                  Installed Extinguishers But Still Unsure?
                </h2>
                <p className="mt-4 text-lg leading-relaxed text-white/80">
                  We offer servicing, refills, inspections, and staff training to ensure your fire extinguishers are always ready. Stay compliant and confident.
                </p>
                <a href="#contact" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-brand-700 shadow-lg transition-all hover:bg-brand-50 active:scale-[0.98]">
                  Schedule a Service <ArrowRight className="h-4 w-4" />
                </a>
              </div>
              <div className="overflow-hidden rounded-2xl shadow-xl">
                <img src={trainingImg} alt="Fire safety training" className="h-full w-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <span className="badge bg-brand-50 text-brand-700">Client Stories</span>
            <h2 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-ink-900 text-balance">
              Trusted by Businesses Across Zimbabwe
            </h2>
          </div>
          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.name} className="card p-6">
                <div className="mb-4 flex gap-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-brand-500 text-brand-500" />)}
                </div>
                <p className="text-sm leading-relaxed text-ink-600">"{t.text}"</p>
                <div className="mt-5 flex items-center gap-3 border-t border-ink-100 pt-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 font-bold text-brand-700">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink-900">{t.name}</p>
                    <p className="text-xs text-ink-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <span className="badge bg-brand-50 text-brand-700">Get In Touch</span>
            <h2 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-ink-900 text-balance">
              Contact Us Today
            </h2>
            <p className="mt-4 text-lg text-ink-500">
              Reach our team in Harare, Bulawayo, or Mutare. We're ready to help with all your fire safety needs.
            </p>
          </div>
          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {branches.map((b) => (
              <div key={b.city} className="card p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <MapPin className="h-6 w-6" />
                </div>
                <h3 className="font-display text-xl font-bold text-ink-900">{b.city}</h3>
                <div className="mt-4 space-y-2 text-sm text-ink-600">
                  <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-ink-400" /> {b.phone}</p>
                  <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-ink-400" /> {b.email}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-ink-950 py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600">
                <Flame className="h-5 w-5 text-white" />
              </div>
              <span className="font-display text-lg font-bold text-white">ABC Firetech</span>
            </div>
            <p className="text-sm text-ink-500">© 2026 ABC Firetech. Fire safety & protection solutions across Zimbabwe.</p>
            <div className="flex items-center gap-4 text-sm text-ink-500">
              <Link to="/signin" className="transition-colors hover:text-white">Client Portal</Link>
              <Link to="/signup" className="transition-colors hover:text-white">Sign Up</Link>
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}
