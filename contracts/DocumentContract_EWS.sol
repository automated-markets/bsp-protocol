// contracts/DocumentContract_EWS.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

contract DocumentContract_EWS {

    struct BuildingData_EWS {
        bytes32 documentHash; // weight is accumulated by delegation
        bytes32 uprn;  // if true, that person already voted
        address originator; // person delegated to
    }

    // store a mapping if UPRNs to EWS documents
    mapping(bytes32 => BuildingData_EWS) public ewsSurveys;

    // Emitted when the an EWS document is added to the contract
    event DocumentAdded_EWS(bytes32 uprn, bytes32 documentHash, address originator);

    // Stores a new EWS document for a building
    function add(bytes32 uprn, bytes32 documentHash) public {        
        // add the document to the interna doc storage
        BuildingData_EWS storage ewsSurvey = ewsSurveys[uprn];
        ewsSurvey.documentHash = documentHash;
        ewsSurvey.originator = msg.sender;
        ewsSurvey.uprn = uprn;
        
        // tell all interested parties that a new EWS document has been added for a given building
        emit DocumentAdded_EWS(uprn, ewsSurvey.documentHash, ewsSurvey.originator);
    }

    // Verifies a document hash is a known EWS survey for a given building
    function verifyDocumentHash(bytes32 uprn, bytes32 documentHash) public view returns (bool) {
        BuildingData_EWS storage ewsSurvey = ewsSurveys[uprn];
        return ewsSurvey.documentHash == documentHash;
    }
}
