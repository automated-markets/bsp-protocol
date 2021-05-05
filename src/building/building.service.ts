import { Injectable, BadRequestException } from '@nestjs/common';
import EthUtil from '../config/ethUtil';
import { BuildingDto } from '../dto/building-dto';

@Injectable()
export class BuildingService {

    async listAll(): Promise<Array<BuildingDto>> {

        try {
            const instance = await EthUtil.getFactoryContract();
            const buildingAddresses = await instance.getAllBuildings();
            let promises: Array<Promise<BuildingDto>> = buildingAddresses.map((buildingAddress: string) => EthUtil.getBuildingDataForBuildingByAddress(buildingAddress));
            const buildings = await Promise.all(promises);
            return buildings;

        } catch (error) {
            console.log(error)
            throw new BadRequestException({ description: 'Unable to list all buildings' });
        }
    }
}