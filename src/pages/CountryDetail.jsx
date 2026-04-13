import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchCountryByCode, fetchWeather, fetchCountryImages } from '../utils/api'

export default function CountryDetail() {
  const { cca3 }    = useParams()
  const navigate    = useNavigate()
  const [country, setCountry]   = useState(null)
  const [weather, setWeather]   = useState(null)
  const [images, setImages]     = useState([])
  const [loading, setLoading]   = useState(true)
  const [scrolled, setScrolled] = useState(false)
  const [dark, setDark]         = useState(() => localStorage.getItem('theme') === 'dark')

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
    fetchCountryByCode(cca3)
      .then(async c => {
        setCountry(c)
        document.title = `${c.name.common} — TravelVerse`
        // fetch weather
        if (c.capital?.[0]) {
          fetchWeather(c.capital[0]).then(setWeather).catch(() => {})
        }
        // build image URLs
        const imgs = await fetchCountryImages(c.name.common)
        setImages(imgs)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [cca3])

  // Scroll reveal
  useEffect(() => {
    if (!country) return
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.08 }
    )
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [country])

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fdf6ee] dark:bg-[#0a0a0a] gap-4">
      <div className="spinner" />
      <p className="text-xs tracking-[0.2em] uppercase text-[#7a5c45] dark:text-[#8a7a6a]">Loading</p>
    </div>
  )

  if (!country) return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdf6ee] dark:bg-[#0a0a0a]">
      <p className="text-[#a0522d] dark:text-[#b8922a]">Country not found.</p>
    </div>
  )

  const languages  = country.languages  ? Object.values(country.languages)                   : []
  const currencies = country.currencies ? Object.values(country.currencies).map(c => c.name) : []
  const demonyms   = country.demonyms?.eng?.m ?? ''

  return (
    <div className="min-h-screen bg-[#fdf6ee] dark:bg-[#0a0a0a] transition-colors duration-500">

      {/* ── NAVBAR ── */}
      <nav className={`glass-nav sticky top-0 z-40 px-6 py-4 flex items-center justify-between ${scrolled ? 'scrolled' : ''}`}>
        <button
          onClick={() => window.close()}
          className="flex items-center gap-2 text-sm text-[#7a5c45] dark:text-[#8a7a6a] hover:text-[#c4793a] dark:hover:text-[#b8922a] transition-colors"
        >
          ← TravelVerse
        </button>
        <span className="font-semibold text-sm tracking-tight text-[#2c1a0e] dark:text-[#f0e6d0]">
          {country.name.common}
        </span>
        <button
          onClick={() => setDark(d => !d)}
          className="px-4 py-1.5 rounded-full text-xs font-medium tracking-wide border transition-all duration-300 border-[#c4793a] text-[#c4793a] hover:bg-[#c4793a] hover:text-white dark:border-[#b8922a] dark:text-[#b8922a] dark:hover:bg-[#b8922a] dark:hover:text-[#0a0a0a]"
        >
          {dark ? '◎ Sunrise' : '● Dusk'}
        </button>
      </nav>

      {/* ── HERO — full-width flag banner ── */}
      <section className="relative h-[55vh] overflow-hidden">
        <img
          src={country.flags.svg}
          alt={`Flag of ${country.name.common}`}
          className="w-full h-full object-cover"
          style={{ filter: 'brightness(0.75)' }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/70" />

        {/* Country name overlay */}
        <div className="absolute bottom-0 left-0 right-0 px-8 pb-10">
          <p className="text-xs tracking-[0.3em] uppercase text-white/70 mb-2">{country.continents?.[0]}</p>
          <h1
            className="text-5xl sm:text-7xl font-light text-white drop-shadow-lg"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {country.name.common}
          </h1>
          {country.name.official !== country.name.common && (
            <p className="text-white/60 text-sm mt-2">{country.name.official}</p>
          )}
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 py-12 space-y-16">

        {/* ── KEY STATS GRID ── */}
        <section className="reveal">
          <p className="text-xs tracking-[0.3em] uppercase text-[#c4793a] dark:text-[#b8922a] mb-6">Overview</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { label: 'Capital',    value: country.capital?.[0] ?? '—' },
              { label: 'Population', value: country.population.toLocaleString() },
              { label: 'Area',       value: country.area ? `${country.area.toLocaleString()} km²` : '—' },
              { label: 'Region',     value: country.region },
              { label: 'Subregion', value: country.subregion ?? '—' },
              { label: 'Timezone',   value: country.timezones?.[0] ?? '—' },
              { label: 'Demonym',    value: demonyms || '—' },
              { label: 'Borders',    value: country.borders?.length ? `${country.borders.length} countries` : 'Island / None' },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="rounded-2xl p-4 border border-[rgba(160,82,45,0.12)] dark:border-[rgba(184,146,42,0.1)] bg-white/60 dark:bg-[#161616]"
              >
                <p className="text-[10px] uppercase tracking-[0.15em] text-[#c4793a] dark:text-[#b8922a] mb-1.5">{label}</p>
                <p className="text-sm font-medium text-[#2c1a0e] dark:text-[#f0e6d0]">{value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── WEATHER ── */}
        <section className="reveal">
          <p className="text-xs tracking-[0.3em] uppercase text-[#c4793a] dark:text-[#b8922a] mb-6">
            Live Weather · {country.capital?.[0]}
          </p>
          <div className="weather-card rounded-3xl p-8">
            {!weather ? (
              <p className="text-sm text-[#7a5c45] dark:text-[#8a7a6a]">Weather data unavailable for this capital.</p>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                <div>
                  <p
                    className="text-7xl font-light text-[#2c1a0e] dark:text-[#f0e6d0] leading-none"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    {Math.round(weather.main.temp)}°C
                  </p>
                  <p className="text-lg text-[#7a5c45] dark:text-[#8a7a6a] capitalize mt-2">
                    {weather.weather[0].description}
                  </p>
                  <p className="text-sm text-[#c4a882] dark:text-[#4a3a2a] mt-1">
                    in {country.capital?.[0]}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Feels like',  value: `${Math.round(weather.main.feels_like)}°C` },
                    { label: 'Humidity',    value: `${weather.main.humidity}%` },
                    { label: 'Wind',        value: `${Math.round(weather.wind.speed)} m/s` },
                    { label: 'Visibility',  value: weather.visibility ? `${(weather.visibility / 1000).toFixed(1)} km` : '—' },
                  ].map(({ label, value }) => (
                    <div key={label} className="text-center">
                      <p className="text-xl font-light text-[#2c1a0e] dark:text-[#f0e6d0]">{value}</p>
                      <p className="text-xs text-[#7a5c45] dark:text-[#8a7a6a] mt-0.5">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ── LANGUAGES & CURRENCIES ── */}
        <section className="reveal grid sm:grid-cols-2 gap-8">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-[#c4793a] dark:text-[#b8922a] mb-4">Languages</p>
            <div className="flex flex-wrap gap-2">
              {languages.map(lang => (
                <span key={lang}
                  className="pill text-sm px-4 py-2 rounded-full bg-[#e8a87c]/20 text-[#a0522d] dark:bg-[#4a1010]/50 dark:text-[#e8a87c] border border-[rgba(160,82,45,0.2)] dark:border-[rgba(232,168,124,0.2)]">
                  {lang}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-[#c4793a] dark:text-[#b8922a] mb-4">Currencies</p>
            <div className="flex flex-wrap gap-2">
              {currencies.map(cur => (
                <span key={cur}
                  className="pill text-sm px-4 py-2 rounded-full bg-[#0d2b1f]/10 text-[#0d6b45] dark:bg-[#0d2b1f]/80 dark:text-[#4ade80] border border-[rgba(13,107,69,0.2)] dark:border-[rgba(74,222,128,0.2)]">
                  {cur}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── BORDERING COUNTRIES ── */}
        {country.borders?.length > 0 && (
          <section className="reveal">
            <p className="text-xs tracking-[0.3em] uppercase text-[#c4793a] dark:text-[#b8922a] mb-4">Bordering Countries</p>
            <div className="flex flex-wrap gap-2">
              {country.borders.map(code => (
                <button
                  key={code}
                  onClick={() => window.open(`/country/${code}`, '_blank')}
                  className="px-4 py-2 rounded-xl text-sm border border-[rgba(160,82,45,0.2)] dark:border-[rgba(184,146,42,0.2)] text-[#7a5c45] dark:text-[#8a7a6a] hover:border-[#c4793a] dark:hover:border-[#b8922a] hover:text-[#c4793a] dark:hover:text-[#b8922a] transition-colors bg-white/50 dark:bg-[#161616]"
                >
                  {code}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* ── PHOTO GALLERY ── */}
        <section className="reveal">
          <p className="text-xs tracking-[0.3em] uppercase text-[#c4793a] dark:text-[#b8922a] mb-6">
            Photographs · {country.name.common}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {images.map((src, i) => (
              <div
                key={i}
                className="relative overflow-hidden rounded-2xl aspect-square bg-[#f5dfc8] dark:bg-[#1a1a1a]"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <img
                  src={src}
                  alt={`${country.name.common} photo ${i + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                  loading="lazy"
                  onError={e => { e.target.parentNode.style.display = 'none' }}
                />
              </div>
            ))}
          </div>
          <p className="text-xs text-[#c4a882] dark:text-[#4a3a2a] mt-3">Photos via Unsplash</p>
        </section>

      </div>

      {/* ── FOOTER ── */}
      <footer className="border-t border-[rgba(160,82,45,0.1)] dark:border-[rgba(184,146,42,0.1)] py-10 px-6 text-center">
        <p className="text-xs text-[#c4a882] dark:text-[#4a3a2a] tracking-widest uppercase">
          TravelVerse · Data from RestCountries & OpenWeatherMap
        </p>
      </footer>
    </div>
  )
}