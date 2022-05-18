// SPDX-License-Identifier: Apache-2.0 and MIT
const Migrations = artifacts.require("Migrations");

module.exports = function (deployer) {
  deployer.deploy(Migrations);
};
