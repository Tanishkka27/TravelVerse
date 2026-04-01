import { useState } from 'react'
import { fetchAllCountries } from './utils/api';

function App() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    .then(data => setCountries(data))
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading Countries...</div>
  if (error) return <div>Error: {error.message}</div>

  // return (
  //   <>
  //   <h1 style={{color: "goldenrod", textAlign:"center"}}>TravelVerse</h1>
  //   </>
  // )
}

export default App
