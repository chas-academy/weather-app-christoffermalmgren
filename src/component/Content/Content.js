import React, { Component } from "react";
import "./Content.css";
import "../Form/Form.js";

class Content extends Component {
  render() {
    return (
      <main className="App-content">
        {this.props.children}
        
      </main>
    );
  }
}

export default Content;
