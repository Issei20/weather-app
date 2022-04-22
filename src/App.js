import './style.scss';
import React, { useState,} from "react";
import loading from "./images/loading.svg"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCloudBolt, faCloud, faSun, faCloudSun, faCloudRain, faSnowflake, faSmog, faSortUp, faSortDown, faAngleUp, faAngleDown  } from '@fortawesome/free-solid-svg-icons'

const fewCloudsIcon = <FontAwesomeIcon className="weathIcon" icon={faCloudSun} />
const cloudsIcon = <FontAwesomeIcon className="weathIcon" icon={faCloud} />
const snowIcon = <FontAwesomeIcon className="weathIcon" icon={faSnowflake} />
const rainIcon = <FontAwesomeIcon className="weathIcon" icon={faCloudRain} />
const mistIcon = <FontAwesomeIcon className="weathIcon" icon={faSmog} />
const thunderIcon = <FontAwesomeIcon className="weathIcon" icon={faCloudBolt} />
const sunIcon = <FontAwesomeIcon className="weathIcon" icon={faSun} />
const angleUp = <FontAwesomeIcon className="angleIcon angleIconUp" icon={faAngleUp} />
const angleDown = <FontAwesomeIcon className="angleIcon angleIconDown" icon={faAngleDown}/>

function App() {
   const [isActive, setIsActive] = useState(false)
   const [searchValue, setSearchValue] = useState('')
   const [weather, setWeather] = useState({})
   const [loadingLoop, setLoadingLoop] = useState(false);
   const [isErr, setIsErr] = useState(false)
   
   function toggleClass() {
        setIsActive(!isActive)      
    }

    // Fetch openweather api and assign the result to weather state
 async function processData() {
   setIsErr(false)
   setLoadingLoop(true)
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${searchValue}&appid=1d1d06b0328958cd6e4ba9dc187233d9`)
    .then(res => { // check result
      if (res.ok) {
        console.log(res.status);
        return res.json();
      } else {
        if (res.status === 404) {
          setLoadingLoop(false)
          setWeather({});
          setIsErr(true)
        }
        setIsErr(true)
        setWeather({});
        setLoadingLoop(false)
        throw new Error("You have an error");
      }
    })
    .then(result => { // Assign result to weather state 
      setWeather(result);
      setSearchValue('') 
      setLoadingLoop(false)
    })
    .catch((error) => console.log(error));


    }

  async function processDataKey(e) {
    if(e.key === "Enter") { 
      processData()
     }
    }

    //  Check if Celsius or Farhenheit (toggle button) and display weather data
    function renderData() {
      if(!isActive) {
        return (
          <div className="result-container">
          <div className="weatherLocation">{weather.name}, {weather.sys.country}</div>
          {renderImg()}
          <div className="weatherTemp">{ Math.round((((weather.main.temp -273.15)*1.8)+32 + Number.EPSILON) * 100) / 100 + "°F "}</div>
          <div className="weatherDescr">{weather.weather[0].description}</div>
          <div className="min-max-container">
          <div className="weatherTempMin"> <div>Min</div> { Math.round((((weather.main.temp_min -273.15)*1.8)+32 + Number.EPSILON) * 100) / 100 + "°F "}<div>{angleDown}</div></div>
          <div className="weatherTempMax"> <div>Max</div> { Math.round((((weather.main.temp_max -273.15)*1.8)+32 + Number.EPSILON) * 100) / 100 + "°F "}<div>{angleUp}</div></div>
          </div>
        </div>
        )
      } else if (isActive) {
      return (
        <div className="result-container">
        <div className="weatherLocation">{weather.name}, {weather.sys.country}</div>
        {renderImg()}
        <div className="weatherTemp">{Math.round((weather.main.temp - 273.15 + Number.EPSILON) * 100) / 100 + "°C "}</div>
        <div className="weatherDescr">{weather.weather[0].description}</div>
        <div className="min-max-container">
        <div className="weatherTempMin"> <div>Min</div> {Math.round((weather.main.temp_min - 273.15 + Number.EPSILON) * 100) / 100 + "°C "}<div>{angleDown}</div></div>
        <div className="weatherTempMax"> <div>Max</div> {Math.round((weather.main.temp_max - 273.15 + Number.EPSILON) * 100) / 100 + "°C "}<div>{angleUp}</div></div>
        </div>
      </div>
      )
      }
    }

    // Check what image to display, regarding the current weather description
      function renderImg() {
        if(weather.weather[0].description.includes("few clouds")) {
          return (<div>{fewCloudsIcon}</div>)
      } else if(weather.weather[0].description.includes("clouds")) {
          return (<div>{cloudsIcon}</div>)
      } else if(weather.weather[0].description.includes("mist")) {
          return (<div>{mistIcon}</div>)
      } else if(weather.weather[0].description.includes("snow")) {
          return (<div>{snowIcon}</div>)
      } else if(weather.weather[0].description.includes("clear sky")) {
          return (<div>{sunIcon}</div>)
      } else if(weather.weather[0].description.includes("rain")) {   
          return (<div>{rainIcon}</div>)
      } else if(weather.weather[0].description.includes("thunderstorm")) {
          return (<div>{thunderIcon}</div>)
      }
    }  

  return (
    <div className="container-app">
      <div className="inputContainer">
        <label for="userInput">Search location</label>
        <input className="userInput" spellcheck="false" type="text" value={searchValue} onChange={e => setSearchValue(e.target.value)} onKeyPress={processDataKey}/>
        <button type="submit" className="searchBtn"  onClick={processData}>Search</button>
        <div className="containerToggle">
            <p>Farhenheit</p>
            <div className="container">
                <div className={isActive ? "toggled-btn" : "toggle-btn"} onClick={() => toggleClass()}>
                    <div className="inner-circle"></div>
                </div>
             </div>
            <p>Celsius</p>
           </div>
           {loadingLoop ? <img className="loader" src={loading} alt=""></img> : null}
          </div>
          {(typeof weather?.main != "undefined") ? (
            <div>
          {renderData()}
          </div>
            ) : ('')}
         
         {isErr ?  <p className="msgErr">Please try again with a correct location</p> : null }
    </div>
  );

}

export default App;
