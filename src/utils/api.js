const BASE_URL    = 'https://restcountries.com/v3.1'
const WEATHER_KEY = import.meta.env.VITE_WEATHER_API_KEY

// Only 10 fields allowed on free tier
export async function fetchAllCountries() {
  const res = await fetch(
    `${BASE_URL}/all?fields=name,flags,capital,population,region,cca3,languages,currencies,borders,area`,
    { signal: AbortSignal.timeout(10000) }
  )
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function fetchCountryByCode(cca3) {
  // Detail page fetches a single country — no fields limit applies here
  const res = await fetch(`${BASE_URL}/alpha/${cca3}`, {
    signal: AbortSignal.timeout(10000)
  })
  if (!res.ok) throw new Error('Country not found')
  const data = await res.json()
  return Array.isArray(data) ? data[0] : data
}

export async function fetchWeather(city) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_KEY}&units=metric`,
    { signal: AbortSignal.timeout(8000) }
  )
  if (!res.ok) throw new Error('Weather not found')
  return res.json()
}

export async function fetchCountryImages(countryName) {
  const queries = [countryName, `${countryName} landscape`, `${countryName} city`, `${countryName} culture`]
  return queries.map(q => `https://source.unsplash.com/800x600/?${encodeURIComponent(q)}`)
}