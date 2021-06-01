// SPDX-License-Identifier: MIT
pragma solidity 0.8.3;

// Import Ownable from the OpenZeppelin Contracts library
import "./types/Building.sol";
import "./types/BuildingData.sol";

/// @title Building Data Factory
/// @notice Responsible for tracking buildings and all types of data associated with each building
/// @dev 
///     Controls the creation of child contracts (Building and BuildingData)
///     Tracks all addresses of the contracts created by this factory contract
///     Data model is: BuildingDataFactory ---[contains many]---> Building ---[contains many]---> BuildingData
/// @author Sam Gamble
contract BuildingDataFactory {
    address owner; // TODO: use OpenZeppelin IOwnable

    // Data tracking
    address[] allBuildings; // track all Building contract instances
    address[] allBuildingData; // track all BuildingData contract instances
    mapping(bytes14 => address) buildingByUPRN; // map UPRN to the address of the associated Building contract instance.
    mapping(string => address) buildingDataByDocHash; // map document hash to the BuildingData a contract address
    
    // Events
    event SurveyRegistered(address buildingContractAddress, string documentHash, string docType, string timestamp, address originator);

    // Constructor
    constructor(address admin) {
        owner = admin;
    }

    /// @notice Determines if a building is registered in this factory contract
    /// @param uprn The UPRN to check
    /// @return bool indicating whether the given UPRN is already registered on chain
    function isBuildingRegistered(bytes14 uprn) public view returns (bool) {
        return (buildingByUPRN[uprn] != address(0));
    }

    /// @notice Finds the address of the Building contract instance that corresponds with the given UPRN
    /// @param uprn The UPRN to find the corresponding Building contract for
    /// @return The address of the Building contract associated with the given UPRN
    function buildingAddress(bytes14 uprn) public view returns (address) {
        return buildingByUPRN[uprn];
    }

    /// @notice Finds the address of the BuildingDate contract instance that corresponds with the given document hash
    /// @param documentHash The SHA256 hash of the document to find
    /// @return The address of the BuildingDate contract
    function buildingDataAddressByHash(string calldata documentHash) public view returns (address) {
        return buildingDataByDocHash[documentHash];   
    }

    /// @notice Looks up the Building contract for a given UPRN. If the UPRN is not currently registered, a new Building contract is registered for the UPRN.
    /// @param uprn The UPRN of the building to find
    /// @return The address of the Building contract associated with the given UPRN
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

    /// @notice Counts all the registered buildings
    /// @return The number of buildings registered
    function countOfBuildings() external view returns (uint) {
        return allBuildings.length;
    }

    /// @notice Finds all of the buildings registered with this factory
    /// @return _buildings All the on chain addresses of the registered building contracts
    function getAllBuildings() external view returns (address[] memory _buildings) {
       _buildings = new address[](allBuildings.length);
       uint count;
       for (uint i=0; i < allBuildings.length; i++) {
            _buildings[count] = allBuildings[i];
            count++;
        }
    }  

    /// @notice Finds all of the building data registered with this factory
    /// @return _buildingData All the on chain addresses of the registered building data contracts
    function getAllBuildingData() external view returns (address[] memory _buildingData) {
       _buildingData = new address[](allBuildingData.length);
       uint count;
       for (uint i=0; i < allBuildingData.length; i++) {
            _buildingData[count] = allBuildingData[i];
            count++;
        }
    }  

    /// @notice Tracks a element of building data against a building
    /// @return The address of the BuildingData contract created
    function trackBuildingData(bytes14 uprn, string calldata documentHash, string calldata docType, string calldata timestamp) public returns (address){
        // find or create the building 
        address buildingContractAddress = findOrCreateBuilding(uprn);        
        Building building = Building(buildingContractAddress);
        address originator = msg.sender;

        if ( buildingDataByDocHash[documentHash] != address(0) ) {
            // doc hash already registered, return address of corresponding building data contract instance
            return buildingDataByDocHash[documentHash];
        } else {
            // doc hash never registered before, so create a new BuildingData contract
            BuildingData buildingData = new BuildingData(owner);
            buildingData.initialize(buildingContractAddress, documentHash, docType, timestamp, originator);

            // register the BuildingData in the Building contracxt
            building.addBuildingData(buildingData); // track by building

            address buildDataContractAddress = address(buildingData);
            allBuildingData.push(buildDataContractAddress); // track all BuildingData contracts ever created
            buildingDataByDocHash[documentHash] = buildDataContractAddress;

            emit SurveyRegistered(buildingContractAddress, documentHash, docType, timestamp, originator);

            return buildDataContractAddress;
        }
    }

}
