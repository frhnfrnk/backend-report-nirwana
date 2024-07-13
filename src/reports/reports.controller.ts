import {
  Controller,
  Post,
  Get,
  Put,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/schemas/user.schema';
import { CreateReportDto } from './create-report.dto';
import { FollowUpDto } from './followup.dto';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @UseGuards(AuthGuard())
  @Roles(Role.PETUGAS)
  @Post()
  async createReport(@Body() createReportDto: CreateReportDto) {
    return this.reportsService.create(createReportDto);
  }

  @UseGuards(AuthGuard())
  @Roles(Role.PETUGAS)
  @Get()
  async findAllReports() {
    return this.reportsService.findAll();
  }

  @UseGuards(AuthGuard())
  @Put(':id/status')
  async updateReportStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    return this.reportsService.updateStatus(id, status);
  }

  @UseGuards(AuthGuard())
  @Roles(Role.PETUGAS)
  @Put('/follow-up/:id')
  async followUpReport(
    @Param('id') id: string,
    @Body('followUp') FollowUpDto: FollowUpDto,
  ) {
    return this.reportsService.followUp(id, FollowUpDto);
  }

  @UseGuards(AuthGuard())
  @Roles(Role.PETUGAS)
  @Put('/done/:id')
  async setDone(@Param('id') id: string) {
    return this.reportsService.setDone(id);
  }
}
