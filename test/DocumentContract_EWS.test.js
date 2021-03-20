const { expect } = require('chai');
const { accounts } = require('@openzeppelin/test-environment');

const {
  BN,           // Big Number support
  constants,    // Common constants, like the zero address and largest integers
  expectEvent,  // Assertions for emitted events
  expectRevert, // Assertions for transactions that should fail
} = require('@openzeppelin/test-helpers');

// Load compiled artifacts
const DocumentContractEWS = artifacts.require("DocumentContract_EWS");

// Start test block
contract('DocumentContractEWS', function () {

    const [sender, receiver] =  accounts;

    beforeEach(async function () {
        // Deploy a new Box contract for each test
        this.DocumentContractEWS = await DocumentContractEWS.new();
    });

    it('given a valid UPRN and doc hash then verifyDocumentHash returns true', async function () {
        const uprn = "S217007860011";
        const documentHash = "S217007860011S217007860011";
        const documentContractEWS = this.DocumentContractEWS;

        await documentContractEWS.add(
            web3.utils.asciiToHex(uprn), 
            web3.utils.asciiToHex(documentHash)
        );

        let response = await documentContractEWS.verifyDocumentHash(
            web3.utils.asciiToHex(uprn), 
            web3.utils.asciiToHex(documentHash)
        );        

        expect(response).to.equal(true);
    });

    it('given a valid UPRN and invalid doc hash then verifyDocumentHash returns false', async function () {
        const uprn = "S217007860011";
        const documentHash = "S217007860011S217007860011";
        const documentContractEWS = this.DocumentContractEWS;

        await documentContractEWS.add(
            web3.utils.asciiToHex(uprn), 
            web3.utils.asciiToHex(documentHash)
        );

        let response = await documentContractEWS.verifyDocumentHash(
            web3.utils.asciiToHex(uprn), 
            web3.utils.asciiToHex("INVALID document hash")
        );        

        expect(response).to.equal(false);
    });

    it('given a invalid UPRN and invalid doc hash then verifyDocumentHash returns false', async function () {
        const documentContractEWS = this.DocumentContractEWS;

        let response = await documentContractEWS.verifyDocumentHash(
            web3.utils.asciiToHex("INVALID UPRN"), 
            web3.utils.asciiToHex("INVALID document hash")
        );        

        expect(response).to.equal(false);
    });

// need to upgrade to OpenZeppelin Test Environment to work
    // it('given a valid UPRN and doc hash when adding to the contract then an event is raised', async function () {
    //     // Store a value
    //     const uprn = "S217007860011";
    //     const documentHash = "S217007860011S217007860011";
    //     const documentContractEWS = this.DocumentContractEWS;

    //     const response = await documentContractEWS.add(
    //         web3.utils.asciiToHex(uprn), 
    //         web3.utils.asciiToHex(documentHash)
    //     );

    //     // expected event: DocumentAdded_EWS(bytes32 uprn, bytes32 documentHash, address originator);

    //     expectEvent(response, 'DocumentAdded_EWS', {
    //         uprn: "0x5332313730303738363030313100000000000000000000000000000000000000",
    //         documentHash: "0x5332313730303738363030313153323137303037383630303131000000000000",
    //         originator: sender,
    //     });
    // });
});