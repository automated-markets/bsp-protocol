import { BuildingDataDto } from './building-data-dto';

export class BuildingDto {
    uprn: string;
    buildingAddr: string;
    buildingData: Array<BuildingDataDto>;

    empty(uprn: string): BuildingDto {
        const res = new BuildingDto();
        res.uprn = uprn;
        res.buildingAddr = "0x0000000000000000000000000000000000000000";
        res.buildingData = [];

        return res;
    }
}