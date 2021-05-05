import { Controller, Get, Query, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { BuildingService } from './building.service';

@Controller('/building')
export class BuildingController {
    
    constructor(private readonly buildingService: BuildingService) { }

    @Get()
    async all() {
        return await this.buildingService.listAll();
    }

    @Get(':uprn')
    async findOne(@Param() params) {
        return await this.buildingService.get(params.uprn)
    }
}