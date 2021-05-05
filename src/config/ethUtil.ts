import { config } from './endpoint.config'
import * as contract from 'truffle-contract';
import * as buildingDataFactoryArtifact from '../../build/contracts/BuildingDataFactory.json';
import * as buildingArtifact from '../../build/contracts/Building.json';
import * as buildingDataArtifact from '../../build/contracts/BuildingData.json';
const Web3 = require('web3')
import { BuildingDto, BuildingDataDto } from '../dto';

const networkUrl = 'http://127.0.0.1:8545';
const factoryAddress = "0xcfeb869f69431e42cdb54a4f4f105c19c080a601";

/*
Map of organisation to wallet address
----------
0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1 (100 ETH)
0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0 (100 ETH)
0x22d491Bde2303f2f43325b2108D26f1eAbA1e32b (100 ETH)
0xE11BA2b4D45Eaed5996Cd0823791E0C93114882d (100 ETH)
0xd03ea8624C8C5987235048901fB614fDcA89b117 (100 ETH)
0x95cED938F7991cd0dFcb48F0a06a40FA1aF46EBC (100 ETH)
0x3E5e9111Ae8eB78Fe1CC3bb8915d5D461F3Ef9A9 (100 ETH)
0x28a8746e75304c0780E011BEd21C72cD78cd535E (100 ETH)
0xACa94ef8bD5ffEE41947b4585a84BdA5a3d3DA6E (100 ETH)
0x1dF62f291b2E969fB0849d99D9Ce41e2F137006e (100 ETH)

*/

class EthUtil {
    factoryAddress: string;
    provider: string;
    web3: any;
    factoryContract: any;
    factoryContractInstance!: any;
    buildingContract: any;
    buildingDataContract: any;

    constructor(networkUrl: string, factoryContractAddress: string) {
        this.factoryAddress = factoryContractAddress;
        this.provider = networkUrl;
        this.web3 = new Web3(new Web3.providers.HttpProvider(networkUrl));
        
        // set up contracts...
        const buildingDataFactory = contract(buildingDataFactoryArtifact);
        const building = contract(buildingArtifact);
        const buildingData = contract(buildingDataArtifact);

        buildingDataFactory.setProvider(this.web3.currentProvider);
        buildingData.setProvider(this.web3.currentProvider);
        building.setProvider(this.web3.currentProvider);

        this.factoryContract = buildingDataFactory;
        this.buildingContract = building;
        this.buildingDataContract = buildingData;
    }
  
    toHex(s: string) : string {
        return this.web3.utils.asciiToHex(s);
    }

    toAscii(s: string): string {
        return this.web3.utils.hexToAscii(s);
    }

    async getFactoryContract() : Promise<any> {
        if(this.factoryContractInstance === undefined) {
            this.factoryContractInstance = await this.factoryContract.at(this.factoryAddress);
        }
        return this.factoryContractInstance;
    }
    
    buildingIdToAddress(buildingId: string) : string {
        return "0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1";
    }

    async getBuildingAtAddress(address: string): Promise<any> { 
        return await this.buildingContract.at(address);
    }

    async showBuildingData(address: string): Promise<BuildingDataDto> {
        const instance = await this.buildingDataContract.at(address);
        const buildingDataItem = await instance.show();

        // unpack solidity response into a typed DTO
        const buildingData = new BuildingDataDto();
        buildingData.documentHash = buildingDataItem["0"];
        buildingData.documentType = buildingDataItem["1"];
        buildingData.dataOriginator = buildingDataItem["2"];

        return buildingData;
    }

    async getBuildingDataForBuildingByAddress(address: string): Promise<BuildingDto> { 
        const buildingContract = await this.buildingContract.at(address);
        const uprnHex = await buildingContract.show();
        const uprn = this.toAscii(uprnHex);
        const buildingDataAddresses =  await buildingContract.getAllBuildingData();
        const promises: Array<Promise<BuildingDataDto>> = buildingDataAddresses.map(buildingDataAddress => this.showBuildingData(buildingDataAddress) )
        const buildingData = await Promise.all(promises);
        
        const building = new BuildingDto()
        building.buildingAddr = address;
        building.buildingData = buildingData;
        building.uprn = uprn;

        return building;
    }

    async getBuildingDataAtAddress(address: string): Promise<any> { 
        return await this.buildingDataContract.at(address);
    }

    async trackBuildingData(buildingId: string, uprn: string, documentHash: string, documentType: string) : Promise<BuildingDataDto> {
        const instance = await this.getFactoryContract();
        const fromAddress = this.buildingIdToAddress(buildingId)
        
        const res = await instance.trackBuildingData(
            this.toHex(uprn),
            this.toHex(documentHash),
            documentType,
            { from: fromAddress }
        );
        
        const trackedBuildingDataAddress = await instance.buildingDataAddressByHash(this.toHex(documentHash));

        return await this.showBuildingData(trackedBuildingDataAddress);
    }

}
  
export default new EthUtil(networkUrl, factoryAddress);