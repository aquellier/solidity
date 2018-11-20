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
  lottery = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode })
    .send({ from: accounts[0], gas: '1000000'});
});

// Great question: what tests should we write?
// What behavior do we care about?
// In this contract I want to make that if anyone calls enter
// with the correct aount of money their address gets added to
// the players array
describe('Lottery Contract', () => {
  it('deploys a contract', () => {
    assert.ok(lottery.options.address)
  });

  it('allows one account to enter', async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      // conversion method inclued in web3
      value: web3.utils.toWei('0.02', 'ether')
    });

    const players = await lottery.methods.getPlayers().call({
      from: accounts[0]
    });

    assert.equal(accounts[0], players[0]);
    assert.equal(1, players.length);
  });

  it('allows multiple accounts to enter', async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      // conversion method inclued in web3
      value: web3.utils.toWei('0.02', 'ether')
    });

    await lottery.methods.enter().send({
      from: accounts[1],
      // conversion method inclued in web3
      value: web3.utils.toWei('0.02', 'ether')
    });

    await lottery.methods.enter().send({
      from: accounts[2],
      // conversion method inclued in web3
      value: web3.utils.toWei('0.02', 'ether')
    });

    const players = await lottery.methods.getPlayers().call({
      from: accounts[0]
    });

    assert.equal(accounts[0], players[0]);
    assert.equal(accounts[1], players[1]);
    assert.equal(accounts[2], players[2]);
    assert.equal(3, players.length);
  });

  it('requires a minimum amount of ether to enter', async () => {
    // We catch our error in the async function by using try and catch
    try {
      await lottery.methods.enter().send({
        from: accounts[0],
        value: 10
      });
      // if the asynchronous is executed and no error is thrown
      // execution will go to next line of code and assert false
      // and the test will fail no matter what. This way we can be
      // sure that everythings fine if the test passes.
      assert(false);
    } catch (err) {
      assert(err);
    }
  });
});
