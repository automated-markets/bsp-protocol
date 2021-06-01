import { Injectable, BadRequestException } from '@nestjs/common';
import EthereumUtil from '../ethereum/ethereumUtil';
import { BuildingDataDto, BuildingDto } from 'src/dto';

const addressToOrganisation = {
    "0xfd3a3cd0a05062c9ec110b609f79cd02ee458061": "Peabody Trust",
    "0x55a401d54532c7a56cd0c1497a190e767a756a18": "Southwark Council",
    "0xde9cad5fe929b2bc702494e6f7219b520ae1350e": "Jack Holdings"
}

@Injectable()
export class UiService {
    async findBuildingByUprn(uprn: string): Promise<any> {
        try {
            const building = await EthereumUtil.getBuildingByUprn(uprn);
            const result = { 
                uprn: building.uprn,
                buildingData: {},
                isEws: building.buildingData.some(i => i.documentType.toUpperCase() === "EWS"),
                ewsContent: {},
                isHhsrs: building.buildingData.some(i => i.documentType.toUpperCase() === "HHSRS"),
                hhsrsContent: {},
                isS106: building.buildingData.some(i => i.documentType.toUpperCase() === "S106"),
                s106Content: {},
                isEws1: building.buildingData.some(i => i.documentType.toUpperCase() === "EWS1"),
                ews1Content: {}
            };

            // calculate the ticks and cross for the building UI
            const tick = { icon: "&#10003", colour: "green" };
            const cross = { icon: "&#10006", colour: "red" };

            result.ewsContent = (result.isEws) ? tick : cross;
            result.hhsrsContent = (result.isHhsrs) ? tick : cross;
            result.s106Content = (result.isS106) ? tick : cross;
            result.ews1Content = (result.isEws1) ? tick : cross;

            // convert originator address to a name
            const uiBuildingData = building.buildingData.map(item => {
                const res = new BuildingDataDto();
                res.documentHash = item.documentHash;
                res.documentType = item.documentType;
                res.timestamp = item.timestamp;
                res.dataOriginator = addressToOrganisation[item.dataOriginator.toLowerCase()];
                res.uri = item.uri;

                return res;
            });
            result.buildingData = uiBuildingData;
            console.log(result);
            return result;

        } catch (error) {
            console.log(error)
            throw new BadRequestException({ description: 'Unable to list all buildings' });
        }
    }
}