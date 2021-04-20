const BuildingDataFactory = artifacts.require("BuildingDataFactory");

// the address of the owner of the BuildingDataFactory contract
const contractOwner = "0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1"

module.exports = async function (deployer) {
  await deployer.deploy(BuildingDataFactory, contractOwner);
};