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
      temperature: {
        celcius: null,
        farenheit: null
      },
      unit: 'metric'
    }
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
        }, function() {
          console.log('Hopefully we have some weather', this.state.weather, this.state.wind, this.state.main, this.state.sys);
        })
      });
      
      fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityname}&units=metric&APPID=4686d7caa20155951ba2c981145ba19b`)
      .then(res => res.json())
      .then(res => {
        this.setState({
          forecast: res.list.filter(item => item.dt_txt.endsWith('12:00:00')|| item.dt_txt.endsWith('00:00:00'))
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
        debugger;
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
        debugger;
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
    console.log(forecast)

    const fiveDayForeCast = forecast.map((hour, index) => {
      const icon = `http://openweathermap.org/img/w/${hour.weather[0].icon}.png`
      return (
        <div className="forecast" key={index}>
          <span>{hour.dt_txt.substring(0, 16)}</span> <span>{hour.main.temp}</span>
          <img src={icon} />
        </div>
      ) 
    });

    return (

      <div>
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
                  <th scope="row">Wind:</th>
                  <td>{this.state.wind.speed} m/s</td>
                </tr>
                <tr>
                  <th scope="row">Pressure:</th>
                  <td>{this.state.main.pressure}</td>
                </tr>
                <tr>
                  <th scope="row">Humidity:</th>
                  <td>{this.state.main.humidity}</td>
                </tr>
                <tr>
                  <th scope="row">Sunrise:</th>
                  <td>{this.calculateTime(this.state.sys.sunrise)}</td>
                </tr>
                <tr>
                  <th scope="row">Sunset:</th>
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
