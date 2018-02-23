import React, { Component } from 'react';

class Form extends Component {
  constructor() {
    super();
    this.state = {
      weather: [],
      main: [],
      wind: [],
      sys: [],
      forecast: [],
      long: 0,
      lat: 0,
      unitLocation: '',
      unitWeather: [],
      temperature: {
        celcius: null,
        farenheit: null
      },
      unit: 'metric'
    }
  }

  componentWillMount() {
    navigator.geolocation.getCurrentPosition((pos) => {
      this.setState({
        long: pos.coords.longitude.toFixed(5),
        lat: pos.coords.latitude.toFixed(5)

        
      })
      this.getWeather();
    })
  }

  getWeather(){ 
  
  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${this.state.lat}&lon=${this.state.long}&units=metric&APPID=4686d7caa20155951ba2c981145ba19b`)
  .then(res => res.json())
  .then(res => {
    this.setState({
      unitLocation: res.name,
      unitWeather: res.main
    })
    console.log(res.name);
    console.log();
  })

  }
  onSubmit(e) {
    e.preventDefault();

    const cityname = e.nativeEvent.target.elements[0].value;

    // const degree = e.nativeEvent.target.elements[].value
    
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityname}&units=${this.state.unit}&APPID=4686d7caa20155951ba2c981145ba19b`)
      .then(res => res.json())
      .then(res => {
        this.setState({
          weather: res.weather,
          main: res.main,
          wind:res.wind,
          sys: res.sys
        })
      });
      
      fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityname}&units=metric&APPID=4686d7caa20155951ba2c981145ba19b`)
      .then(res => res.json())
      .then(res => {
        this.setState({
          forecast: res.list.filter(item => item.dt_txt.endsWith('12:00:00'))
        });
      })

  }



  handleChangeUnit(e) {
    this.setState({
      unit: e.target.value
    }, function() { 
      this.recalculateTemperature(this.state.unit);
    });
  }

  recalculateTemperature(unit) {
    console.log(unit);
    switch (unit) {
      case 'metric':
        
        // Vi kan inte utgå från att this.main.temp är celcius
        let celcius = !this.state.temperature.celcius 
          ? this.state.main.temp - 32 * 5/9 
          : this.state.temperature.celcius;

        this.setState({
          temperature: {
            celcius: celcius,
            farenheit: this.state.main.temp
          }
        })
        break;
      case 'imperial':
        // Om man söker på Oslo med Farenheit blir detta omkastat fel.
        // Kolla i this.state.temperature om celcius är null
        
        let farenheit = this.state.main.temp * 9/5 + 32;
        console.log(this.state.main.temp, farenheit)
        this.setState({
          temperature: {
            celcius: this.state.main.temp,
            farenheit: farenheit
          }
        })

        break;
      default:
        break;
    }
    {/* (Celsius grader * 9/5) + 32 = Farenheit */ }
    {/* (68°F - 32) × 5/9 = Celsius */}
  }

  render() {
    const { forecast } = this.state;
    

    const fiveDayForeCast = forecast.map((hour, index) => {
      const icon = `http://openweathermap.org/img/w/${hour.weather[0].icon}.png`
      return (
        <div className="container">
           <div className="row" key={index}>
              <div className="col-lg-12">
                <div>Date: {hour.dt_txt.substring(0, 10)}</div>
                <div>Time: {hour.dt_txt.substring(10, 16)}</div>
                 <div>Degrees:  {Math.round(hour.main.temp)}</div> 
                <img src={icon} /> 
              </div>
            </div>
        </div> 
      ) 
    });

  

    return (

      <div>
        <div className='card'>
          <div className="card-body">
            <h3 className='location'>Your Location</h3>
            <h5 className="card-text">{this.state.unitWeather.temp} Celsius</h5>
            <h5 className="card-text">Your position right now is: {this.state.unitLocation.toUpperCase()}</h5>
            <p className="card-text">{}</p>
          </div>
        </div>
        <form onSubmit={this.onSubmit.bind(this)}>
          <input type="text" placeholder="City name here..." name="city" /> <br/>   
          <button className="btn btn-default"type="submit">Get weather</button>
          <div className="form-group">
            <input name="group100" type="radio" id="radio100" value="metric" defaultChecked={true} onChange={this.handleChangeUnit.bind(this)} />
            <label htmlFor="radio100">Celcius</label>
            <input name="group100" type="radio" id="radio101" value="imperial" onChange={this.handleChangeUnit.bind(this)}/>
            <label htmlFor="radio101">Farenheit</label>
        </div>

        </form>
        { fiveDayForeCast }
        { this.state.weather.length > 0 ? 
          <div className="App-weather">  
            <p>Weather Today:</p>
            <img src={`http://openweathermap.org/img/w/${this.state.weather[0].icon}.png`} title="Title goes here" alt="A weather icon, describing the... weather" />
            <p>
              {this.state.weather[0].description}
              { !(this.state.temperature.celcius && this.state.temperature.farenheit) ? this.state.main.temp : ''}
              {
                  this.state.unit === 'metric' 
                  ? this.state.temperature.celcius 
                  : this.state.temperature.farenheit 
              } &deg; 
              {
                this.state.unit === 'metric' 
                ? 'Celsius' 
                : 'Farenheit' 
              }
            </p>

            <table className="table table-bordered">
          <tbody>
            
              
                <tr>
                  <th scope="row"> <img src="https://png.icons8.com/metro/50/000000/tornado.png"/> Wind:</th>
                  <td>{this.state.wind.speed} m/s</td>
                </tr>
                <tr>
                  <th scope="row"> <img src="https://png.icons8.com/metro/50/000000/atmospheric-pressure.png"/> Pressure:</th>
                  <td>{this.state.main.pressure}</td>
                </tr>
                <tr>
                  <th scope="row"> <img src="https://png.icons8.com/metro/50/000000/humidity.png"/> Humidity:</th>
                  <td>{this.state.main.humidity}</td>
                </tr>
                <tr>
                  <th scope="row"> <img src="https://png.icons8.com/metro/50/000000/sunrise.png"/> Sunrise:</th>
                  <td>{this.calculateTime(this.state.sys.sunrise)}</td>
                </tr>
                <tr>
                  <th scope="row"><img src="https://png.icons8.com/metro/50/000000/sunset.png"/> Sunset:</th>
                  <td>{this.calculateTime(this.state.sys.sunset)}</td>
                </tr>
         </tbody>
        </table>
          </div>
          : <p>No results yet</p>
          
        }
      </div>
    );
  }
  calculateTime(time){
    return new Date(time * 1e3).toISOString().slice(-13, -5)
  }
}

export default Form;
