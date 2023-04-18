import React, { HtmlHTMLAttributes } from 'react';
import styled from 'styled-components';

interface Props {
  children?: React.ReactNode;
  className?: string;
};

function App() {
  return (
    <WeatherAppWrapper>
      <CityWrapper>
        <CityNameField/>
        <CitySearchField/>
      </CityWrapper>
      <WeahterInfoWrapper>
        <DateTime/>
        <WeatherCode/>
        <Temperature/>
        <Wind/>
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
  height: auto;
  border-radius: 5px;
  background-color: (206, 52%, 80%, 1);
  box-shadow: 3px 5px 3px 5px;
`;

const CityWrapper = styled(({children, className}:Props)=>{
  return <div className={className}>{children}</div>
})`
  position: relative;
  text-align:left;
  margin: none;
  width: auto;
  height: auto;
  padding: 10px;
  border-radius: 5px 5px 0px 0px;
  background-color: hsla(202, 100%, 29%, 1);
  box-shadow: 1px 1px 1px 1px;
`;

const CityNameField = styled(({className}:Props) =>{
  return <h1 className={className}>Warszawa</h1>
})`
`;

const CitySearchField = styled(({className}:Props)=>{
  return <input className={className} type="text"/>
})`
`;

const WeahterInfoWrapper = styled(({className,children}:Props) => {
  return <div className={className}>{children}</div>
})`
`;

const DateTime = styled(({className}:Props) => {
  return <span className={className}>Data i czas</span>
})`
`;

const WeatherCode = styled(({className}:Props) => {
  return <span className={className}>weatherCode</span>
})`
`;
const Temperature = styled(({className}:Props) => {
  return <span className={className}>temp</span>
})`
`;
const Wind = styled(({className}:Props) => {
  return <div className={className}>Wind</div>
})`
`;

export default App;
