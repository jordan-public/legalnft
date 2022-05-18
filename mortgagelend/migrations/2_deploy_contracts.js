// SPDX-License-Identifier: Apache-2.0 and MIT
var Pawn = artifacts.require("Pawn");

// accounts[0] = owner (of all contracts for testing purposes)
module.exports = async function(deployer, network, accounts) {
  await deployer.deploy(Pawn);
  
  console.log("Pawn: " + Pawn.address);
  console.log("Owner: "+accounts[0]);
  console.log("Demployment completed!");
};
