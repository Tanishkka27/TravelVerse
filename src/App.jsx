import { useState, useEffect, useRef } from 'react'
import { Routes, Route } from 'react-router-dom'
import { fetchAllCountries } from './utils/api'
import CountryCard from './components/CountryCard'
import CountryModal from './components/CountryModal'
import CountryDetail from './pages/CountryDetail'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/country/:cca3" element={<CountryDetail />} />
    </Routes>
  )
}

function Home() {
  const [countries, setCountries]           = useState([])
  const [loading, setLoading]               = useState(true)
  const [error, setError]                   = useState(null)
  const [query, setQuery]                   = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [region, setRegion]                 = useState('All')
  const [sortBy, setSortBy]                 = useState('name-asc')
  const [dark, setDark]                     = useState(() => localStorage.getItem('theme') === 'dark')
  const [favorites, setFavorites]           = useState(() => JSON.parse(localStorage.getItem('favorites') || '[]'))
  const [selected, setSelected]             = useState(null)
  const [scrolled, setScrolled]             = useState(false)
  const heroRef = useRef(null)

  useEffect(() => {
    fetchAllCountries()
      .then(d => setCountries(d))
      .catch(e => setError(e))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 300)
    return () => clearTimeout(t)
  }, [query])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.1 }
    )
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [countries])

  const filtered = countries.filter(c =>
    c.name.common.toLowerCase().includes(debouncedQuery.toLowerCase())
  )
  const byRegion = filtered.filter(c => region === 'All' || c.region === region)
  const sorted = [...byRegion].sort((a, b) => {
    if (sortBy === 'name-asc')  return a.name.common.localeCompare(b.name.common)
    if (sortBy === 'name-desc') return b.name.common.localeCompare(a.name.common)
    if (sortBy === 'pop-asc')   return a.population - b.population
    if (sortBy === 'pop-desc')  return b.population - a.population
    return 0
  })

  function toggleFavorite(code) {
    setFavorites(prev => {
      const next = prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
      localStorage.setItem('favorites', JSON.stringify(next))
      return next
    })
  }

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fdf6ee] dark:bg-[#0a0a0a] gap-4">
      <div className="spinner" />
      <p className="text-xs tracking-[0.2em] uppercase text-[#7a5c45] dark:text-[#8a7a6a]">Loading the world</p>
    </div>
  )

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdf6ee] dark:bg-[#0a0a0a]">
      <p className="text-sm text-[#a0522d] dark:text-[#b8922a]">Could not reach the server. Check your connection.</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#fdf6ee] dark:bg-[#0a0a0a] transition-colors duration-500">
      <nav className={`glass-nav sticky top-0 z-40 px-6 py-4 flex items-center justify-between ${scrolled ? 'scrolled' : ''}`}>
        <span className="font-semibold text-lg tracking-tight text-[#2c1a0e] dark:text-[#f0e6d0]">TravelVerse</span>
        <div className="flex items-center gap-4">
          <span className="text-xs tracking-widest text-[#7a5c45] dark:text-[#8a7a6a] hidden sm:block">{sorted.length} countries</span>
          <button
            onClick={() => setDark(d => !d)}
            className="px-4 py-1.5 rounded-full text-xs font-medium tracking-wide border transition-all duration-300 border-[#c4793a] text-[#c4793a] hover:bg-[#c4793a] hover:text-white dark:border-[#b8922a] dark:text-[#b8922a] dark:hover:bg-[#b8922a] dark:hover:text-[#0a0a0a]"
          >
            {dark ? '◎ Sunrise' : '● Dusk'}
          </button>
        </div>
      </nav>

      <section ref={heroRef} className="text-center pt-20 pb-16 px-6">
        <p className="text-xs tracking-[0.3em] uppercase text-[#c4793a] dark:text-[#b8922a] mb-4">Every country. One place.</p>
        <h1 className="text-5xl sm:text-7xl font-light tracking-tight mb-6 text-[#2c1a0e] dark:text-[#f0e6d0]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Explore the World
        </h1>
        <p className="text-[#7a5c45] dark:text-[#8a7a6a] text-lg font-light max-w-md mx-auto">
          {countries.length} nations. Flags, capitals, languages, currencies and live weather.
        </p>
      </section>

      <section className="reveal max-w-2xl mx-auto px-6 pb-12">
        <div className="search-wrap rounded-2xl border border-[rgba(160,82,45,0.18)] dark:border-[rgba(184,146,42,0.18)] bg-white/70 dark:bg-[#161616] mb-4 overflow-hidden">
          <input
            type="text"
            placeholder="Search any country…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full px-5 py-4 bg-transparent text-[#2c1a0e] dark:text-[#f0e6d0] placeholder-[#c4a882] dark:placeholder-[#4a3a2a] text-sm outline-none"
          />
        </div>
        <div className="flex gap-3 flex-wrap">
          <select value={region} onChange={e => setRegion(e.target.value)}
            className="px-4 py-2.5 rounded-xl text-sm border border-[rgba(160,82,45,0.18)] dark:border-[rgba(184,146,42,0.18)] bg-white/70 dark:bg-[#161616] text-[#2c1a0e] dark:text-[#f0e6d0] outline-none">
            {['All','Africa','Americas','Asia','Europe','Oceania'].map(r => <option key={r}>{r}</option>)}
          </select>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}
            className="px-4 py-2.5 rounded-xl text-sm border border-[rgba(160,82,45,0.18)] dark:border-[rgba(184,146,42,0.18)] bg-white/70 dark:bg-[#161616] text-[#2c1a0e] dark:text-[#f0e6d0] outline-none">
            <option value="name-asc">Name A–Z</option>
            <option value="name-desc">Name Z–A</option>
            <option value="pop-asc">Population ↑</option>
            <option value="pop-desc">Population ↓</option>
          </select>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-24">
        {sorted.length === 0 ? (
          <p className="text-center text-[#7a5c45] dark:text-[#8a7a6a] py-20">No countries found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {sorted.map((c, i) => (
              <CountryCard
                key={c.cca3}
                country={c}
                index={i}
                isFavorite={favorites.includes(c.cca3)}
                onSelect={setSelected}
                onFavorite={toggleFavorite}
              />
            ))}
          </div>
        )}
      </section>

      {selected && <CountryModal country={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}