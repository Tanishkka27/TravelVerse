const BASE_URL = 'https://restcountries.com/v3.1';
const WEATHER_KEY = import.meta.env.VITE_WEATHER_API_KEY;

export async function fetchAllCountries() {
  // Try primary URL first, then fallback
  const urls = [
    `${BASE_URL}/all?fields=name,flags,capital,population,region,subregion,languages,currencies,borders,cca3`,
    `https://restcountries.com/v3.1/all`
  ];

  for (const url of urls) {
    try {
      const res = await fetch(url);
      if (res.ok) return res.json();
    } catch (e) {
      continue;
    }
  }
  throw new Error('Failed to fetch countries');
}

export async function fetchWeather(city) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_KEY}&units=metric`
  );
  if (!res.ok) throw new Error('Weather not found');
  return res.json();
}