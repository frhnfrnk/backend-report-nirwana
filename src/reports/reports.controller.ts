import {
  Controller,
  Post,
  Get,
  Put,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { Role } from 'src/auth/schemas/user.schema';
import { CreateReportDto } from './create-report.dto';
import { FollowUpDto } from './followup.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { UpdateReportDto } from './update-report.dto';
import { Roles } from '../auth/roles.decorator';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @UseGuards(AuthGuard)
  @Roles(Role.USER)
  @Post()
  async createReport(@Body() createReportDto: CreateReportDto, @Req() req) {
    return this.reportsService.create(createReportDto, req.user);
  }

  @UseGuards(AuthGuard)
  @Roles(Role.PETUGAS)
  @Get()
  async findAllReports() {
    return this.reportsService.findAll();
  }

  @UseGuards(AuthGuard)
  @Roles(Role.USER)
  @Get('/history')
  async findUserReports(@Req() req) {
    return this.reportsService.findUserReports(req.user);
  }

  @UseGuards(AuthGuard)
  @Put(':id/status')
  async updateReportStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    return this.reportsService.updateStatus(id, status);
  }

  @UseGuards(AuthGuard)
  @Roles(Role.PETUGAS)
  @Put('/follow-up/:id')
  async followUpReport(
    @Param('id') id: string,
    @Body('followUp') FollowUpDto: FollowUpDto,
  ) {
    return this.reportsService.followUp(id, FollowUpDto);
  }

  @UseGuards(AuthGuard)
  @Roles(Role.PETUGAS)
  @Put('/done/:id')
  async setDone(@Param('id') id: string, @Body() updateDto: UpdateReportDto) {
    return this.reportsService.setDone(id, updateDto);
  }
}
