# TravelVerse
> Explore the World, One Country at a Time

## About
TravelVerse is a web application that lets you explore every country in the
world. Get key info, current weather, flags, currencies, languages, and more
— all in one beautifully designed interface.

## Features
- Search countries by name (with debouncing)
- Filter by region (Africa, Asia, Europe, Americas, Oceania)
- Sort alphabetically or by population
- View live weather for any country capital
- Dark mode / Light mode toggle
- Favorites saved in Local Storage
- Detailed country modal with flag, currencies, languages & more
- Fully responsive on mobile, tablet and desktop

## APIs Used
- RestCountries API - https://restcountries.com (no key required)
- OpenWeatherMap API - https://openweathermap.org/api (free key)

## Tech Stack
- React (Vite)
- Tailwind CSS
- JavaScript (ES6+)

## Deployment
Deployed on Vercel: https://travelverse-app.vercel.app/

## Setup & Run

1. Clone the repo
   git clone https://github.com/your-username/travelverse.git
   cd travelverse

2. Install dependencies
   npm install

3. Add your OpenWeatherMap API key — create a .env file:
   VITE_WEATHER_API_KEY=your_key_here

4. Start dev server
   npm run dev

## Milestones
- M1: Project setup + README        ✅
- M2: API integration + responsiveness ✅
- M3: Search, filter, sort, dark mode  ✅
- M4: Final polish + deployment        ✅