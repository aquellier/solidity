import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import web3 from './web3';
import lottery from './lottery';

// Flow
// 1. Our App is going to be load up
// 2. The app content is rendered to the screen
// 3. That will cause the render method to immediately be called
// which puts the jsx on the screen
// 4. During this initial render, this.state.manager has a value of ''
// 5. After that the componentDidMount will run
// 6. We will make a call to the network to retrieve the current state
// of the lottery contract, i.e the manager address
// 7. We set that state to our component
// 8. This causes it to automatically rerender
// 9. The render method is called again with the new value of this.state.manager

class App extends Component {

  // we are replacing the constructor method with the following
  // because the only reason we were calling it at the beginning
  // was to initate this state
  // Underneath the hood,
  // Variables declared here are automatically put inside the constructor
  state = {
    manager: '',
    players: [],
    // See farther why balance is initialized as a string (line 43)
    balance: ''
  };

  // This component is a great pattern for fetching information off of our contract
  async componentDidMount() {
    // whenever we make use of Metadask provider we do not have to specify
    // from account it's coming in the call function because it has a default
    // account already set up, the first one we are signed into inside MM
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    // Check solidity tests
    // Balance is actually not a number
    // It is an object that is wrapped in the library Big number js of web3
    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({ manager, players, balance });
  }
  render() {
    console.log(web3.version);
    return (
      <div>
        <h2>Lottery Contract</h2>
        <p>This contract is managed by {this.state.manager}</p>
        <p>There are currently {this.state.players.length} people entered,
           competing to win {web3.utils.fromWei(this.state.balance, 'ether')} ether!
        </p>
      </div>
    );
  }
}

export default App;
