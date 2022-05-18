// SPDX-License-Identifier: Apache-2.0 and MIT
var Agreement = artifacts.require("Agreement");

// accounts[0] = owner (of all contracts for testing purposes)
module.exports = async function(deployer, network, accounts) {
  await deployer.deploy(Agreement);
  
  console.log("Agreement: " + Agreement.address);
  console.log("Owner: "+accounts[0]);
  console.log("Demployment completed!");
};
