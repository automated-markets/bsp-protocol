import * as dotenv from 'dotenv';
import * as contract from 'truffle-contract';
import * as buildingDataFactoryArtifact from '../../build/contracts/BuildingDataFactory.json';
import * as buildingArtifact from '../../build/contracts/Building.json';
import * as buildingDataArtifact from '../../build/contracts/BuildingData.json';
const Web3 = require('web3')
const HDWalletProvider = require('@truffle/hdwallet-provider');
import { BuildingDto, BuildingDataDto } from '../dto';

// Load environment variables from .env file
dotenv.config();

const networkUrl = process.env.ETH_HOST;
const factoryAddress = process.env.ETH_FACTORY_ADDRESS;
const chainId = process.env.ETH_CHAIN_ID;

class KnownAccount {

    web3: any;

    constructor(_mnemonic: string){    
        this.web3 = new Web3(new HDWalletProvider({
            mnemonic: _mnemonic,
            providerOrUrl: networkUrl,
            addressIndex: 0,
            chainId: chainId
          }));
    }

    getAddress(): string {
        return this.web3.currentProvider.addresses[0];
    }
}

class EthUtil {
    factoryAddress: string;
    provider: string;
    web3: any;
    factoryContract: any;
    factoryContractInstance!: any;
    buildingContract: any;
    buildingDataContract: any;
    knownAccounts: Map<string, KnownAccount>;

    constructor(networkUrl: string, factoryContractAddress: string) {
        this.factoryAddress = factoryContractAddress;
        this.provider = networkUrl;

        this.knownAccounts = new Map<string, KnownAccount>([
            ["PEABODY_TRUST", new KnownAccount(process.env.ETH_KNOWN_ADDRESS_PEABODY_TRUST)],
            ["SOUTHWARK_COUNCIL", new KnownAccount(process.env.ETH_KNOWN_ADDRESS_SOUTHWARK_COUNCIL)],
            ["MHCLG", new KnownAccount(process.env.ETH_KNOWN_ADDRESS_MHCLG)]
        ]);
        
        console.log('--- Accounts ----------------------------------------------------------');
        console.log(`MHCLG:                 ${this.knownAccounts.get("MHCLG").getAddress()}`);
        console.log(`SOUTHWARK COUNCIL:     ${this.knownAccounts.get("SOUTHWARK_COUNCIL").getAddress()}`);
        console.log(`PEABODY TRUST:         ${this.knownAccounts.get("PEABODY_TRUST").getAddress()}`);
        console.log('-----------------------------------------------------------------------')
        console.log('');
        
        // set the default signing account to be Southwark Council
        this.web3 = this.knownAccounts.get("SOUTHWARK_COUNCIL").web3;
        
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

    toUtf8(s: string): string {
        return this.web3.utils.hexToUtf8(s);
    }

    async getFactoryContract() : Promise<any> {
        if(this.factoryContractInstance === undefined) {
            this.factoryContractInstance = await this.factoryContract.at(this.factoryAddress);
        }
        return this.factoryContractInstance;
    }

    async getBuildingAtAddress(address: string): Promise<any> { 
        return await this.buildingContract.at(address);
    }

    async showBuildingData(address: string): Promise<BuildingDataDto> {
        const instance = await this.buildingDataContract.at(address);
        const buildingDataItem = await instance.show();

        // unpack solidity response into a typed DTO
        const buildingData = new BuildingDataDto();
        buildingData.documentHash = this.toUtf8(buildingDataItem["0"]);
        buildingData.documentType = buildingDataItem["1"];
        buildingData.dataOriginator = buildingDataItem["2"];
        buildingData.uri = `${process.env.PINATA_GATEWAY_BASE_URL}/${this.toUtf8(buildingDataItem["0"])}`;

        return buildingData;
    }

    async getBuildingByUprn(uprn: string): Promise<BuildingDto> {
        const instance = await this.getFactoryContract();
        const buildingAddress = await instance.buildingAddress(this.toHex(uprn));
        return this.getBuildingByAddress(buildingAddress);
    }

    async getBuildingByAddress(address: string): Promise<BuildingDto> { 
        const buildingContract = await this.buildingContract.at(address);
        const uprnHex = await buildingContract.show();
        const uprn = this.toUtf8(uprnHex);
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

        this.factoryContract.setProvider(this.knownAccounts.get("PEABODY_TRUST").web3.currentProvider);

        // map building ID to a known account
        const fromAddress = this.knownAccounts.get("PEABODY_TRUST").web3.currentProvider.addresses[0];
        
        console.log("trackBuildingData")
        console.log("\tUPRN: " + uprn)
        const res = await instance.trackBuildingData(
            this.toHex(uprn),
            this.toHex(documentHash),
            documentType,
            { from: fromAddress }
        );
        if(res.receipt.name === 'Error') 
            throw new Error(res.receipt.stack)

        console.log("buildingDataAddressByHash")
        const trackedBuildingDataAddress = await instance.buildingDataAddressByHash(this.toHex(documentHash));
        console.log(`\taddress: ${trackedBuildingDataAddress}`);
        let response = await this.showBuildingData(trackedBuildingDataAddress);

        this.factoryContract.setProvider(this.knownAccounts.get("SOUTHWARK_COUNCIL").web3.currentProvider);
        return response;
    }

}
  
export default new EthUtil(networkUrl, factoryAddress);