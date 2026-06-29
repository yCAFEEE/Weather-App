import { useState, useEffect } from 'react';
import './Home.css';

export default function Home(){
  const [city, setCity] = useState('');
  const [units, setUnits] = useState('metric');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async(e) => {
    if(e) e.preventDefault();

    try{
      const response = await fetch("http://127.0.0.1:8000/", {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({ city, units }),
      });
      const data = await response.json();

      if(response.ok){
        setWeather(data.weather);
        setError(null);
      }else{
        setWeather(null);
        setError(data.error);
      }
    } catch(err){
      console.log("Error: ", err);
      setError("Server connection failed");
      setWeather(null)
    }
  };

  useEffect(() => {
    if(weather){ 
      handleSubmit();
    }
  }, [units]);
  
  let localTime;
  if(weather){
    localTime = new Date((weather.dt + weather.timezone) * 1000);
    var localHours = String(localTime.getUTCHours()).padStart(2, '0');
    var localMinutes = String(localTime.getUTCMinutes()).padStart(2, '0');
  }

  const tempSymbol = units === "metric" ? "C°" : "F°";
  return (
    <>
      <header>
        <h1>WeatherApp</h1>
        <form onSubmit={handleSubmit} id='search-form'>
          <input
            id='city-name'
            type='text' 
            placeholder='City name...'
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button type='submit'>Get weather</button>
        </form>
      </header>
      
      <main>
        
        {weather && (
          <div className='weather-container'>
            <div className="units-toggle">
              <button type="button" className={units === 'metric' ? 'active' : ''} onClick={() => setUnits('metric')}>°C</button>
              <button type="button" className={units === 'imperial' ? 'active' : ''}  onClick={() => setUnits('imperial')}>°F</button>
            </div>
            <h1>{weather.city}</h1>
            <div className='temp-container'>
              <img src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`} alt="Weather icon" />
              <h1>{weather.temperature} {tempSymbol}</h1>
            </div>
            <div className='desc-container'>
              <h2>{weather.description}</h2>
            </div>
            <h2>Local time: {localHours + ":" + localMinutes}</h2>
            <div className='weather-overview-container'>
              <p>Humidity: {weather.humidity}%</p>
              <p>Feel: {weather.feelsLike} {tempSymbol}</p>
              <p>Min. temperature: {weather.tempMin} {tempSymbol}</p>
              <p>Max temperature: {weather.tempMax} {tempSymbol}</p>
              <p>Pressure: {weather.pressure} hPa</p>
              {weather.visibility && <p>Visibility: {units === "metric" ? `${weather.visibility / 1000} km` : `${((weather.visibility / 1000) / 1.609).toFixed(2)} mi`}</p>}
              <p>Wind speed: {units === "metric" ? `${(weather.windSpeed * 3.6).toFixed(2)} km/h` : `${weather.windSpeed} mph`}</p>
            </div>
          </div>
        )}

        {error && (
          <h2>{error}</h2>
        )}
      </main>
    </>
  )
}