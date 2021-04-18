// SPDX-License-Identifier: MIT
pragma solidity 0.8.3;

contract BuildingData {
    address owner; // TODO: use OpenZeppelin IOwnable
    address factory;
    address originator; // who provided the data
    string docType; // e.g. EWS, EWS1, HHSRS, Planning Application, S106 Agreement, Section 235 notices etc...
    string docHash;
    address buildingContract;

    constructor(address admin) {
        factory = msg.sender;
        owner = admin;
    }

    // called once by the factory at time of deployment
    function initialize(address _building, string calldata _docHash, string calldata _docType) external {
        require(msg.sender == factory, 'BSP: FORBIDDEN'); // sufficient check
        buildingContract = _building;
        docType = _docType;
        docHash = _docHash;
    }
}
