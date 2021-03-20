const DocumentContract_EWS = artifacts.require("DocumentContract_EWS");

module.exports = async function (deployer) {
  await deployer.deploy(DocumentContract_EWS);
};