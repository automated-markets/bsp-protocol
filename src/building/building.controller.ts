import { Controller, Get, Query, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { BuildingService } from './building.service';

@Controller('/building')
export class BuildingController {
    
    constructor(private readonly buildingService: BuildingService) { }

    @Get('/all')
    async all() {
        return await this.buildingService.listAll();
    }
}