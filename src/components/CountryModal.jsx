export default function CountryCard({ country, index, isFavorite, onSelect, onFavorite }) {
  const delay = `${Math.min(index * 35, 600)}ms`

  return (
    <article
      className="country-card card-enter rounded-2xl overflow-hidden cursor-pointer
        border border-[rgba(160,82,45,0.12)] dark:border-[rgba(184,146,42,0.1)]
        bg-[rgba(255,248,240,0.9)] dark:bg-[#161616]"
      style={{ animationDelay: delay }}
      onClick={() => onSelect(country)}
    >

      <div className="relative overflow-hidden h-40 bg-[#f5dfc8] dark:bg-[#1a1a1a]">
        <img
          src={country.flags.svg}
          alt={`Flag of ${country.name.common}`}
          className="flag-img w-full h-full object-cover"
          loading="lazy"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <h2 className="font-semibold text-sm text-[#2c1a0e] dark:text-[#f0e6d0] leading-snug pr-2">
            {country.name.common}
          </h2>
          <button
            className="fav-btn text-base flex-shrink-0 text-[#c4793a] dark:text-[#b8922a]"
            onClick={e => { e.stopPropagation(); onFavorite(country.cca3) }}
            aria-label="Toggle favorite"
          >
            {isFavorite ? '★' : '☆'}
          </button>
        </div>

        <div className="space-y-1.5">
          <p className="text-xs text-[#7a5c45] dark:text-[#8a7a6a]">
            <span className="text-[#c4a882] dark:text-[#4a3a2a] mr-1.5">Capital</span>
            {country.capital?.[0] ?? '—'}
          </p>
          <p className="text-xs text-[#7a5c45] dark:text-[#8a7a6a]">
            <span className="text-[#c4a882] dark:text-[#4a3a2a] mr-1.5">Pop.</span>
            {country.population.toLocaleString()}
          </p>
          <p className="text-xs text-[#7a5c45] dark:text-[#8a7a6a]">
            <span className="text-[#c4a882] dark:text-[#4a3a2a] mr-1.5">Region</span>
            {country.region}
          </p>
        </div>
      </div>
    </article>
  )
}