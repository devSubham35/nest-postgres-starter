import { MonitorService } from './monitor.service';
import { CreateMonitorDto } from './dto/create-monitor.dto';
import { UpdateMonitorDto } from './dto/update-monitor.dto';
import { UserId } from 'src/common/decorator/common.decorator';
import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { QueryMonitorDto } from './dto/query-monitor.dto';

@Controller('monitor')
export class MonitorController {
  constructor(private readonly monitorService: MonitorService) { }

  @Post()
  async create(@UserId() UserId: string, @Body() createMonitorDto: CreateMonitorDto) {
    const result = await this.monitorService.create(UserId, createMonitorDto);
    return {
      data: result,
      message: "Url added successfully"
    }
  }

  @Get()
  async findAll(
    @UserId() UserId: string, 
    @Query() query: QueryMonitorDto
  ) {
    const results = await this.monitorService.findAll(UserId, query);
    return {
      data: results,
      message: "Fetched successfully"
    }
  }

  @Get(':id')
  async findOne(@UserId() UserId: string, @Param('id') id: string) {
    const result = await this.monitorService.findOne(UserId, id);
    return {
      data: result,
      message: "Fetched successfully"
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @UserId() userId: string,
    @Body() updateMonitorDto: UpdateMonitorDto
  ) {
    const result = await this.monitorService.update(userId, id, updateMonitorDto);
    return {
      data: result,
      message: "Updated successfully"
    }
  }

  @Delete(':id')
  async remove(@UserId() userId: string, @Param('id') id: string) {
    await this.monitorService.remove(userId, id);
    return {
      message: "Deleted successfully"
    }
  }
}
