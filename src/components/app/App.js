import React from 'react';
import logo from '../../images/logo.svg';
import DirectoryTable from '../user-directory/DirectoryTable';
import './App.css';

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>
        <div className="user-info-table">
          <DirectoryTable />
        </div>
      </div>
    );
  }
}
export default App;
