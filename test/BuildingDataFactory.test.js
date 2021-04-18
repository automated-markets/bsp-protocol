const { expect } = require('chai');
const { accounts } = require('@openzeppelin/test-environment');

const {
  BN,           // Big Number support
  constants,    // Common constants, like the zero address and largest integers
  expectEvent,  // Assertions for emitted events
  expectRevert, // Assertions for transactions that should fail
} = require('@openzeppelin/test-helpers');

// Load compiled artifacts
const BuildingDataFactory = artifacts.require("BuildingDataFactory");

// Start test block
contract('BuildingDataFactory', function () {

    const [sender, receiver] =  accounts;

    beforeEach(async function () {
        // Deploy a new contract for each test
        this.BuildingDataFactory = await BuildingDataFactory.new(sender);
    });

    it('check a new building is created and registered', async function () {
        const uprn = "S217007860011";
        const buildingDataFactory = this.BuildingDataFactory;

        // check there are no buildings registered
        let countOfBuildings = await buildingDataFactory.countOfBuildings();
        expect(countOfBuildings).to.be.bignumber.equal(new BN("0"));
        
        // register a new building
        let newBuildingAddress = await buildingDataFactory.findOrCreateBuilding(
            web3.utils.asciiToHex(uprn)
        );

        // check the register buildings count goes up to 1
        countOfBuildings = await buildingDataFactory.countOfBuildings();
        expect(countOfBuildings).to.be.bignumber.equal(new BN("1"));
    });

    it('check a registered building cannot be overwritten', async function () {
        const uprn = "S217007860011";
        const buildingDataFactory = this.BuildingDataFactory;

        // check there are no buildings registered
        let countOfBuildings = await buildingDataFactory.countOfBuildings();
        expect(countOfBuildings).to.be.bignumber.equal(new BN("0"));
        
        // register a new building
        await buildingDataFactory.findOrCreateBuilding(web3.utils.asciiToHex(uprn));

        // get the address of the build we registered
        let buildingAddress = await buildingDataFactory.buildingAddress(web3.utils.asciiToHex(uprn)); 

        countOfBuildings = await buildingDataFactory.countOfBuildings();
        expect(countOfBuildings).to.be.bignumber.equal(new BN("1"));

        // try and re-register the same UPRN
        await buildingDataFactory.findOrCreateBuilding(web3.utils.asciiToHex(uprn));
        // get the address of the build we registered
        let buildingAddressReReg = await buildingDataFactory.buildingAddress(web3.utils.asciiToHex(uprn)); 

        // check the contract address has not changed
        expect(buildingAddress).to.equal(buildingAddressReReg);

        // check there is still only 1 building registered
        countOfBuildings = await buildingDataFactory.countOfBuildings();
        expect(countOfBuildings).to.be.bignumber.equal(new BN("1"));

    });

    it('check all addresses of Buildiong contracts can be retrieved', async function () {
        const buildingDataFactory = this.BuildingDataFactory;
        const uprnBuilding1 = "S217007860011";
        const uprnBuilding2 = "S217007860012";
        const uprnBuilding3 = "S217007860013";

        // register 3 new buildings
        await buildingDataFactory.findOrCreateBuilding(web3.utils.asciiToHex(uprnBuilding1));                
        await buildingDataFactory.findOrCreateBuilding(web3.utils.asciiToHex(uprnBuilding2));        
        await buildingDataFactory.findOrCreateBuilding(web3.utils.asciiToHex(uprnBuilding3)); 

        // check building 3 exists
        let building3Exists = await buildingDataFactory.isBuildingRegistered(web3.utils.asciiToHex(uprnBuilding3)); 
        expect(building3Exists).to.equal(true);
        
        // check there are 3 addresses of Building contracts registered
        let allBuildingAddresses = await buildingDataFactory.getAllBuildings();
        expect(allBuildingAddresses.length).to.equal(3);

        // check the 3 addresses are the addresses of the building we registered
        let addressBuilding1 = await buildingDataFactory.buildingAddress(web3.utils.asciiToHex(uprnBuilding1)); 
        let addressBuilding2 = await buildingDataFactory.buildingAddress(web3.utils.asciiToHex(uprnBuilding2)); 
        let addressBuilding3 = await buildingDataFactory.buildingAddress(web3.utils.asciiToHex(uprnBuilding3)); 

        expect(allBuildingAddresses).contains(addressBuilding1);
        expect(allBuildingAddresses).contains(addressBuilding2);
        expect(allBuildingAddresses).contains(addressBuilding3);
    });

    it('check Building contracts can be counted', async function () {
        const buildingDataFactory = this.BuildingDataFactory;
        const uprns = ["S217007860011", 
                       "S217007860012", 
                       "S217007860013", 
                       "S217007860014", 
                       "S217007860015", 
                       "S217007860016"];
         
        // register the buildings in the factory contract
        await Promise.all(uprns.map(async uprn => {
            await buildingDataFactory.findOrCreateBuilding(web3.utils.asciiToHex(uprn));                
        }));

        // check the building count is 6
        const countOfBuildings = await buildingDataFactory.countOfBuildings();
        expect(countOfBuildings).to.be.bignumber.equal(new BN("6"));
    });
});