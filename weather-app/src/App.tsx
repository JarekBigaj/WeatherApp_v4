import {createContext, useContext, useState, useEffect} from 'react';
import styled from 'styled-components';

const API_GEOCODING = 'https://geocoding-api.open-meteo.com/v1/search?name=';
const API_URL_DEFAULT ='https://api.open-meteo.com/v1/forecast?latitude=52.23&longitude=21.01&current_weather=true';
interface Props {
  children?: React.ReactNode;
  className?: string;
  city?: string;
  dateTime?: string;
  weatherCode?:number;
  temperature? : number;
  windDirection? : number;
  windSpeed?: number;
};

type InputProps = {
  value?:any;
  className?:string;
  onChange?:any;
  onClick?:any;
}

type CurrentWeatherProps = {
  temperature : number;
  time : string;
  weathercode : number; 
  winddirection : number;
  windspeed : number;
}

const dummyElement:CurrentWeatherProps = {
  temperature:0,
  time:"",
  weathercode:0,
  winddirection:0,
  windspeed:0
}

const WeatherContext = createContext(dummyElement);

function App() {
  const [currentCity, setCurrentCity] = useState<any>([]);
  const [input, setInput] = useState<string>("");
  const [searchArray,setSearchArray]= useState<any|null>([]);
  const [weatherData, setWeatherData] = useState<CurrentWeatherProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(()=>{
    fetch(API_GEOCODING+input)
    .then(response => {
      return response.json();
    })
    .then(response => {
      const {results} = response;
      return results;
    })
    .then(results =>{
      const searchArray:[any] = results?results:[];
      setSearchArray(searchArray.map(value => [value?.name,value?.country,value?.longitude, value?.latitude]));
    })
  },[input]);

  useEffect(() => {
    const informationCurrentCityWeather = API_URL_DEFAULT;
    // const informationCurrentCityWeather = `https://api.open-meteo.com/v1/forecast?latitude=${}&longitude=${}&current_weather=true`

    fetch(informationCurrentCityWeather)
    .then(response => {
      if(!response.ok){
        throw new Error(`This is an HTTP error: The status is ${response.status}`);
      }
      return response.json()
    })
    .then(({current_weather}) => {
      setWeatherData(current_weather);
      setError(null);
    })
    .catch((err) => {
      setError(err.message)
      setWeatherData(null);
    })
    .finally(()=>{
      setLoading(false);
    });

  },[currentCity]);

console.log(currentCity);

  const {temperature,time,weathercode} = weatherData ? weatherData : 
  {
    temperature:0,
    time:"",
    weathercode:0
  }

  return (
    <WeatherAppWrapper>
      <CityWrapper>
        <CityNameField city={currentCity}/>
        <SearchFieldWrapper>
          <CitySearchField value={input} onChange={(event:any) => setInput(event.target.value)}/>
          <SearchCityResults value={searchArray} onClick={(event:any) =>setCurrentCity(event.target.value)}/>
        </SearchFieldWrapper>
      </CityWrapper>
      <WeahterInfoWrapper>
        <DateTime dateTime={time}/>
        <WeatherCode weatherCode={weathercode}/>
        <Temperature temperature={temperature}/>
        <WeatherContext.Provider value={weatherData?weatherData:dummyElement}>
          <WindCompas/>
        </WeatherContext.Provider>
      </WeahterInfoWrapper>
    </WeatherAppWrapper>
  );
}

const WeatherAppWrapper= styled(({className,children}:Props)=>{
  return <div className={className}>{children}</div>
})`
  position: relative;
  text-align:left;
  margin: 2rem auto;
  width: 60rem;
  border-radius: 5px;
  background-color: (206, 52%, 80%, 1);
  box-shadow: 3px 5px 3px 5px;
`;

const CityWrapper = styled(({children, className}:Props)=>{
  return <div className={className}>{children}</div>
})`
  position: relative;
  width:100%;
  margin: none;
  border-radius: 5px 5px 0px 0px;
  background-color: hsla(202, 100%, 29%, 1);
  box-shadow: 1px 1px 1px 1px;
  display: inline-grid;
  grid-template-columns: auto auto;
`;

const SearchFieldWrapper = styled(({className,children}:Props)=>{
  return <div className={className}>{children}</div>
})`
`;

const CityNameField = styled(({className,city}:Props) =>{
  return <h1 className={className}>{city}</h1>
})`
  text-align:left;
  margin:20px;
  font-size:4rem;
  color:hsla(55, 80%, 84%, 1);
`;

const CitySearchField = styled(({className,value,onChange}:InputProps)=>{
  return <input className={className} value={value} onChange={onChange} type="search"/>
})`
  margin:auto auto;
  width:80%;
  height:40%;
  font-size:1.5rem;
`;

const SearchCityResults = styled(({className,value,onClick}:InputProps)=>{
  return (
    <ul className={className}>
      {
        value.map((result:any)=>{
          const [city,country,longitude]:any[] = result;
          return <li key={longitude} value={city} onClick={() => onClick(result)} className='search-result'>{city} : {country}</li>
        })
      }
    </ul>
  )
})`
  display:flex;
  flex-direction:column;
  box-shadow:0px 0px 2px #ddd;
  width:80%;
  max-height:150px;
  overflow-y:scroll;
  cursor:pointer;
  background-color: #fff;

  .search-result{
    padding:10px;
  }
`;

const WeahterInfoWrapper = styled(({className,children}:Props) => {
  return <div className={className}>{children}</div>
})`
  background-color:hsla(0, 0%, 95%, 1);
`;

const DateTime = styled(({className, dateTime}:Props) => {
  const [date,time]:string[]|any = dateTime?.split("T");
  return <span className={className}>{date} {time}</span>
})`
`;

const WeatherCode = styled(({className,weatherCode}:Props) => {
  return <span className={className}> {weatherCode} </span>
})`
`;
const Temperature = styled(({className,temperature}:Props) => {
  return <span className={className}>{temperature?temperature +`°C`:""} </span>
})`
`;

const WindCompas = styled(({className}:Props) => {
  const windData = useContext(WeatherContext);
  const direction= windData.winddirection;
  const speed = windData.windspeed;
  return (
    <div className={className}>
      <WindDirection windDirection={direction}/>
      <WindSpeed windSpeed={speed}/>
    </div>
  )
})`
  width: 100%;
  display: inline-grid;
  grid-template-columns: auto auto;
`;

const WindDirection = styled(({className,windDirection}:Props) => {
  return (
    <div className={className}>
      <p className="sr-only">{windDirection}</p>
      <span className='windArrow'></span>
    </div>
  )
})`
.sr-only:not(:focus):not(:active) {
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  white-space: nowrap;
  width: 1px;
}
.windArrow{
  --size:1rem;
  height: calc(var(--size)*3);
  width: var(--size);
  background-color:  #ffff8b;
  clip-path: polygon(50% 0, 0% 100%, 100% 100%);
  transform: translateY(-50%)
  rotate(${props => props.windDirection+"deg" || "0deg"});
  transform-origin: bottom center;
  transition: transform 500ms ease;
}
  --size: 6rem;
  width: var(--size);
  height: var(--size);
  border-radius: 50%;
  background-color: rgba(59, 61, 231, 0.5);
  display: grid;
  place-items: center;
`;

const WindSpeed = styled(({className,windSpeed}:Props) => {
  return <span className={className}>{windSpeed ? windSpeed+` km/h` :""}</span>
})`
`;

export default App;
