const main = async function main(callback) {
    try {
        // Our code will go here
        const DocumentContractEWS = artifacts.require("DocumentContract_EWS");
        const documentContractEWS = await DocumentContractEWS.deployed();

        // add a new EWS survey for a UPRN to the EWS document contract
        const uprn = "S217007860011";
        const documentHash = "S217007860011S217007860011";
        
        console.log("Adding EWS survey response to UPRN: ", uprn)
        await documentContractEWS.add(
            web3.utils.asciiToHex(uprn), 
            web3.utils.asciiToHex(documentHash)
        );

        callback(0);
    } catch (error) {
        console.error(error);
        callback(1);
    }
}

module.exports = main;