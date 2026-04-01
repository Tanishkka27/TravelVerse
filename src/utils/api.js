const BASE_URL = "https://restcountries.com/v3.1/all?fields=name,flags";
const WEATHER_KEY = import.meta.env.VITE_WEATHER_API_KEY;

export async function fetchAllCountries() {
    const res = await fetch(`${BASE_URL}/all`);
    if (!res.ok) throw new Error("Failed to fetch countries");
    return res.json();
}

export async function fetchWeather(city) {
    const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_KEY}&units=metric`
    );
    if (!res.ok) throw new Error("Weather not found");
    return res.json();
}