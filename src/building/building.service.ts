import { Injectable, BadRequestException } from '@nestjs/common';
import EthUtil from '../config/ethUtil'

@Injectable()
export class BuildingService {

    async listAll(): Promise<string> {

        try {
            const instance = await EthUtil.getFactoryContract();
            const buildingAddresses = await instance.getAllBuildings();  
            const buildings = await Promise.all(buildingAddresses.map(buildingAddress => EthUtil.getBuildingDataForBuildingByAddress(buildingAddress)));

            return JSON.stringify({
                buildingAddresses,
                buildings
            });

        } catch (error) {
            console.log(error)
            throw new BadRequestException({ description: 'Unable to list all buildings' });
        }
    }
}