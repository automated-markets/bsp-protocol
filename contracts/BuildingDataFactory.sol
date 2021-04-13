// Building Data Factory
// Responsible for:
//      - Creating new BuildingData contracts
//      - Link BuildingData to Buildings
//      - Track all Buildings
//      - Tracking all BuildingData contracts, stored in a few ways 
//        (by UPRN, by building data type - e.g. EWS1 survey)
// Model:
//      BuildingDataFactory ---[contains many]---> Building ---[contains many]---> BuildingData

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

contract BuildingData {
    address owner; // TODO: use OpenZeppelin IOwnable
    address factory;
    address originator; // who provided the data
    string docType; // e.g. EWS, EWS1, HHSRS, Planning Application, S106 Agreement etc
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

contract BuildingDataFactory {
    address owner; // TODO: use OpenZeppelin IOwnable

    // Data tracking
    address[] allBuildings; // track all Building contract instances
    address[] allBuildingData; // track all BuildingData contract instances
    // mapping(bytes32 => address) buildingDataByDocHash;
    mapping(bytes14 => address) buildingByUPRN; // map UPRN to the address of the associated Building contract instance.
    
    // List all BuildingData contracts grouped by DocType
    //mapping(docType => BuildingData) buildingDataByDocType;

    // List all BuildingData contracts grouped by UPRN
    //mapping(docType => BuildingData) buildingDataByDocType;


    // Constructor
    constructor(address admin) {
        owner = admin;
    }

    // Functions
    function isBuildingRegistered(bytes14 uprn) public view returns (bool) {
        return (buildingByUPRN[uprn] != address(0));
    }

    function buildingAddress(bytes14 uprn) public view returns (address) {
        return buildingByUPRN[uprn];
    }

    function findOrCreateBuilding(bytes14 uprn) public returns (address) {
        // check if a Building contract exists with the same UPRN
        if(!isBuildingRegistered(uprn)) {
            // no Building match, so create a new Building contract 
            // and register the building in the tracking lists
            Building building = new Building(owner);
            building.initialize(uprn);
            buildingByUPRN[uprn] = address(building);
            allBuildings.push(address(building));
        }

        return buildingByUPRN[uprn];        
    }

    // function notoriseBuildingData(bytes14 uprn, bytes32 documentHash, string docType) public returns (bool) {
    //     // check for existing Building contract instance for the UPRN
    //     address building = findOrCreateBuilding(uprn);
    // }

    function countOfBuildings() external view returns (uint) {
        return allBuildings.length;
    }

    function getAllBuildings() external view returns (address[] memory _buildings) {
       _buildings = new address[](allBuildings.length);
       uint count;
       for (uint i=0; i < allBuildings.length; i++) {
            _buildings[count] = allBuildings[i];
            count++;
        }
     }  
}
