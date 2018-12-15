import Web3 from 'web3';

// window is a reference to the global window
// The current provider is the provider that is given to web3
// We do this because metamask uses web3 0.2
// We want the v1.0 to get the right provider so we have to specify it
// This shit is SUPER IMPORTANT to know
const web3 = new Web3(window.web3.currentProvider);

export default web3;
