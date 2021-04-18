// SPDX-License-Identifier: MIT
pragma solidity 0.8.3;

contract Building {
    address owner; // TODO: use OpenZeppelin IOwnable
    address factory;
    bytes14 uprn;
    address[] allBuildingData;

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