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
    balance: '',
    value: '',
    message: ''
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

  // Arrow function, this way the value of this will automatically be our component
  // Otherwise we would have to use bind(this)
  onSubmit = async event => {
    // Whenever onSubmit get called, it will be with an event object
    // representing the form submission
    // We want to make sure the form does not submit itself in the classic HTML way
    // That is why we use preventDefault
    event.preventDefault();
    // Code to send a transaction to this function, asynchronous
    // When we send transactions we have to specify the account
    const accounts = await web3.eth.getAccounts();
    // This process will take 15 30 seconds so we should give feedback to our user
    this.setState({ message: 'Waiting on transaction success...'});
    // Let us assume that the first is the one sending the money
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether')
    });
    this.setState({message: 'You have been entered'});
    console.log(this.state.balance > web3.utils.toWei('0.5', 'ether'));
    if (this.state.balance > web3.utils.toWei('0.5', 'ether')) {
      await lottery.methods.pickWinner().send({
        from: accounts[0]
      });
    this.setState({ message: 'A winner has been picked!' });
    }
  };

  render() {
    console.log(web3.version);
    // We convert value in Wei to value in Ether
    return (
      <div>
        <h2>Lottery Contract</h2>
        <p>This contract is managed by {this.state.manager}</p>
        <p>There are currently {this.state.players.length} people entered,
           competing to win {web3.utils.fromWei(this.state.balance, 'ether')} ether!
        </p>

        <hr />

        <form onSubmit={this.onSubmit}>
          <h4>Want to try your luck?</h4>
          <div>
            <label htmlFor="">Amount of ether to enter:</label>
            <input
              value={this.state.value}
              onChange={event => this.setState({ value: event.target.value})}
            />
          </div>
          <button>Enter</button>
        </form>

        <hr/>

        <h1>{this.state.message}</h1>
      </div>
    );
  }
}

export default App;
