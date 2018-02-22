import React, { Component } from 'react';
import { Header, Content, Footer, Form } from './component'; 
import './App.css';


class App extends Component {
  render() {
    return (
      <div className="App" >
        <Header />
        <Content>
          <Form />
        </Content>
        <Footer />
      </div>
    );
  }
}

export default App;
