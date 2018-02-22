import React, { Component } from 'react';

import './Header.css';

class Header extends Component {
    render() {
        return (
            <header className="App-header"> 
                <i className="fas fa-sun fa-6x"></i>
                <h1 className="App-title">CatsAndDogs</h1>
            </header>
        )
    }
}

export default Header;