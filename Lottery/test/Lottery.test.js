const assert = require('assert');
// Local test network created when we run tests
const ganache = require('ganache-cli');
const Web3 = require('web3');
// The provider is a replaceable little block that we stick into the web3 library
// It is what allows us to connect to any given network
// As soon as we deploy our contract to a test network, we'll replace
// ganache with whatever provider is appropriate
const web3 = new Web3(ganache.provider());

// Next we can require in our interface which is the API
// of our contract and the byte code which is the
// raw compiled contract from our compile file.
// We are requiring an object that has the interface and the object property
const { interface, bytecode } = require('../compile');

let lottery;
let account;

beforeEach(async () => {
  // Accessing ethereum module to get accounts
  accounts = await web3.eth.getAccounts();
  // We also need to deploy an instance of our lottery contract
  lottery = await web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode })
  .send({ from: account[0], gas: '1000000'});
});
