import { Injectable, BadRequestException } from '@nestjs/common';
import EthereumUtil from '../ethereum/ethereumUtil';
import { BuildingDto } from '../dto/building-dto';

@Injectable()
export class BuildingService {

    async listAll(): Promise<Array<BuildingDto>> {
        try {
            const instance = await EthereumUtil.getFactoryContract();
            const buildingAddresses = await instance.getAllBuildings();
            let promises: Array<Promise<BuildingDto>> = buildingAddresses.map((buildingAddress: string) => EthereumUtil.getBuildingByAddress(buildingAddress));
            const buildings = await Promise.all(promises);
            return buildings;

        } catch (error) {
            console.log(error)
            throw new BadRequestException({ description: 'Unable to list all buildings' });
        }
    }

    async get(uprn: string): Promise<BuildingDto> {
        try {
            const building = await EthereumUtil.getBuildingByUprn(uprn);
            return building;

        } catch (error) {
            console.log(error)
            throw new BadRequestException({ description: 'Unable to list all buildings' });
        }
    }
}