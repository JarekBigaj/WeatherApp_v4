import {createContext, useContext, useState, useEffect} from 'react';
import styled from 'styled-components';
import weatherCode from './weather-code.json';

const API_GEOCODING = 'https://geocoding-api.open-meteo.com/v1/search?name=';
const API_URL_DEFAULT ='https://api.open-meteo.com/v1/forecast?latitude=52.23&longitude=21.01&current_weather=true';
const {weather_code_list}=weatherCode;
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
  result?:any;
  onClick?:any;
}

type CurrentWeatherProps = {
  temperature : number;
  time : string;
  weathercode : number; 
  winddirection : number;
  windspeed : number;
}

type CurrentCityProps = {
  name?:string;
  longitude?:any;
  latitude?:any;
}

const dummyElement:CurrentWeatherProps = {
  temperature:0,
  time:"",
  weathercode:0,
  winddirection:0,
  windspeed:0
}

const defaultCity:CurrentCityProps = {
  name:"Warsaw",
  longitude:21.01,
  latitude:52.23
} 

const WeatherContext = createContext(dummyElement);

function App() {
  const [currentCity, setCurrentCity] = useState<CurrentCityProps>(defaultCity);
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
    // const informationCurrentCityWeather = API_URL_DEFAULT;
    const informationCurrentCityWeather = `https://api.open-meteo.com/v1/forecast?latitude=${currentCity.latitude}&longitude=${currentCity.longitude}&current_weather=true`

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
    
    setInput("");
    setSearchArray([]);
  },[currentCity]);


  const {temperature,time,weathercode} = weatherData ? weatherData : 
  {
    temperature:0,
    time:"",
    weathercode:0
  }

  return (
    <WeatherAppWrapper>
      <CityWrapper>
        <CityNameField city={currentCity?.name}/>
        <SearchFieldWrapper>
          <CitySearchField value={input} onChange={(event:any) => setInput(event.target.value)}/>
          <SearchCityResults >
            {
              searchArray.map((result:any)=>{
                const [city,country,longitude,latitude]:any[] = result;
                return <SearchItem result={result} onClick={() => setCurrentCity({
                  name:city,
                  longitude:longitude,
                  latitude:latitude
                })}/>
              })
            } 
          </SearchCityResults>
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
  grid-template-columns: 60% 40%;
`;

const SearchFieldWrapper = styled(({className,children}:Props)=>{
  return <div className={className}>{children}</div>
})`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  
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
  width: 100%;
  padding: 10px 20px;
  font-size: 18px;
  border: 2px solid #ccc;
  outline: none;
  transition: all 0.3s ease-in-out;
  border-radius:0px 5px 0px 0px;
  :focus {
    border-color: #3273dc;
    box-shadow: 0px 0px 5px #3273dc;
  }
`;

const SearchCityResults = styled(({className,children}:Props)=>{
  return (
    <ul className={className}>
      {children}
    </ul>
  )
})`
  position:absolute;
  top:50px;
  list-style-type: none;
  padding: 0;
  margin: 0;
  max-height: 150px;
  width:100%;
  background-color: #fff;
  overflow:hidden;
  overflow-y:auto;
  border-color: #3273dc;
  box-shadow: 0px 0px 5px #3273dc;
  z-index:99;
  ::-webkit-scrollbar{
    display:none;
  }
`;

const SearchItem = styled(({className,onClick,result}:InputProps)=>{
  const [city,country,longitude]:any[] = result;
  return <li 
    key={longitude} 
    value={city} 
    onClick={onClick} 
    className={className}>
    {city} : {country}
  </li>
})`
  padding: 10px;
  font-size: 18px;
  cursor: pointer;
  :hover {
    background-color: #ccc;
  }
`;

const WeahterInfoWrapper = styled(({className,children}:Props) => {
  return <div className={className}>{children}</div>
})`
  position:relative;
  background-color:hsla(0, 0%, 95%, 1);
  height:240px;
`;

const DateTime = styled(({className, dateTime}:Props) => {
  const [date,time]:string[]|any = dateTime?.split("T");
  return <span className={className}>{date} {time}</span>
})`
  margin:20px;
  font-size:20px;
`;

const WeatherCode = styled(({className,weatherCode}:Props) => {
  const [informationAboutCurrentWeather] = Object.entries(weather_code_list).filter(([key,value])=>{
    return key==weatherCode?.toString()
  })
  console.log(informationAboutCurrentWeather)
  const [code,infoWeather]=informationAboutCurrentWeather;
  return <span className={className}> {infoWeather} </span>
})`
  position:absolute;
  bottom:20px;
  width:auto;
  left:45%;
`;
const Temperature = styled(({className,temperature}:Props) => {
  return <span className={className}>{temperature?temperature +`°C`:""} </span>
})`
  position:absolute;
  top:30%;
  left:40%;
  font-size:60px;
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
  width: auto;
  position:absolute;
  top:60px;
  right:150px;
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
  position:absolute;
  bottom:30px;
  left:120px;
  font-size:24px;
  width:100px;
`;

export default App;
