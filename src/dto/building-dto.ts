import { BuildingDataDto } from './building-data-dto';

export class BuildingDto {
    uprn: string;
    buildingAddr: string;
    buildingData: Array<BuildingDataDto>;
}