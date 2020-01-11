import React from 'react';
import Diceroll from './Diceroll.js';
import './App.css';

function App() {
  return (
    <div className="App">
      <nav class="navbar navbar-dark bg-dark">
        <a class="navbar-brand" href=".">
          <img src="/image/icon.svg" width="30" height="30" class="d-inline-block align-top" alt="" />
          Diceroll
        </a>
      </nav>

      <Diceroll />
    </div>
  );
}

export default App;
