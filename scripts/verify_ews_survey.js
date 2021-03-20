const main = async function main(callback) {
    try {
        // Our code will go here
        const DocumentContractEWS = artifacts.require("DocumentContract_EWS");
        const documentContractEWS = await DocumentContractEWS.deployed();

        // add a new EWS survey for a UPRN to the EWS document contract
        const uprn = "S217007860011";
        const documentHash = "S217007860011S217007860011";
        
        // verify the document hash is stored in the EWS contract
        console.log("Verifying EWS survey is stored for");
        console.log("  UPRN: ", uprn)
        console.log("  Document hash: ", web3.utils.asciiToHex(documentHash))

        let response = await documentContractEWS.verifyDocumentHash(
            web3.utils.asciiToHex(uprn), 
            web3.utils.asciiToHex(documentHash)
        );        
        console.log('  document verification response:', response);

        console.log("\nVerifying EWS survey is not stored for");
        console.log("  UPRN: ", uprn)
        console.log("  Document hash: ", web3.utils.asciiToHex("NOT a stored hash"))

        response = await documentContractEWS.verifyDocumentHash(
            web3.utils.asciiToHex(uprn), 
            web3.utils.asciiToHex("NOT a stored hash")
        );
        console.log('  document verification response:', response);

        callback(0);
    } catch (error) {
        console.error(error);
        callback(1);
    }
}

module.exports = main;