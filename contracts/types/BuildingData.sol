// SPDX-License-Identifier: MIT
pragma solidity 0.8.3;

contract BuildingData {
    address owner; // TODO: use OpenZeppelin IOwnable
    address factory;
    address originator; // who provided the data
    string docType; // e.g. EWS, EWS1, HHSRS, Planning Application, S106 Agreement, Section 235 notices etc...
    bytes32 docHash;
    bytes14 uprn;

    constructor(address admin) {
        factory = msg.sender;
        owner = admin;
    }

    // called once by the factory at time of deployment
    function initialize(bytes14 _uprn) external {
        require(msg.sender == factory, 'BSP: FORBIDDEN'); // sufficient check
        uprn = _uprn;
    }
}
