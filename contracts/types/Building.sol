// SPDX-License-Identifier: MIT
pragma solidity 0.8.3;

import "./BuildingData.sol";

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

    function addBuildingData(BuildingData _buildingData) external {
        allBuildingData.push(address(_buildingData));
    }

    /// @notice Retrieves all the building data registered with this building
    /// @return _buildingData All the on chain addresses of the registered BuildingData contracts associated with this building
    function getAllBuildingData() external view returns (address[] memory _buildingData) {
       _buildingData = new address[](allBuildingData.length);
       uint count;
       for (uint i=0; i < allBuildingData.length; i++) {
            _buildingData[count] = allBuildingData[i];
            count++;
        }
    }  

    /// @notice Reads all of the building  fields
    /// @return UPRN
    function show() external view returns (bytes14) {
        return uprn;
    }
}