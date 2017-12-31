var Commitment = artifacts.require("./Commitment.sol");

module.exports = function(deployer) {
  deployer.deploy(Commitment);
};
