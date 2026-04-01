function CountryCard ({ country }){
    return (
        <div className="bg-white rounded-xl shadow p-4 cursor-pointer hover:scale-105 transhition">
            <img src={country.flags.svg} alt={country.name.common} className="w-full h-36 object-cover rounded"/>
            <h2 className="font-bold text-lg mt-2">country.name.common</h2>
            <p>Capital: {country.capital?.[0]}</p>
            <p>Population: {country.population.toLocalString()}</p>
            <p>Region: {country.region}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">{countries.map(c=><CountryCard key={c.cca3} country={c}/>)}</div>
        </div>
    );
}