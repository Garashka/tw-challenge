import React from 'react';
import logo from './logo.svg';
import './App.css';

class App extends React.Component {
  componentDidMount() {
    // In production, a more robust aynsc method should probably used. This will do for now.
    fetch('https://reqres.in/api/users')
      .then(response => response.json())
      .then(data => {
        // Store the resquested data in Redux
        const tableData = data.data;
        this.setState({ tableData })
      })
      .then(() => console.log(this.state.tableData));

  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>
      </div>
    );
  }
}
export default App;
