import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Report, ReportDocument } from './report.schema';
import { CreateReportDto } from './create-report.dto';
import { FollowUpDto } from './followup.dto';
import axios from 'axios';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Report.name) private reportModel: Model<ReportDocument>,
  ) {}

  private readonly locationIQApiKey = process.env.LOCATIONIQ_API_KEY;

  async create(createReportDto: CreateReportDto): Promise<Report> {
    const { coordinates } = createReportDto.location;
    const latitude = coordinates[0];
    const longitude = coordinates[1];

    // Reverse Geocoding menggunakan LocationIQ
    const locationData = await this.reverseGeocode(latitude, longitude);

    // Update address di createReportDto
    createReportDto.location.address = locationData.display_name;

    const createdReport = new this.reportModel(createReportDto);
    return createdReport.save();
  }

  async reverseGeocode(lat: number, lon: number): Promise<any> {
    const url = `https://us1.locationiq.com/v1/reverse.php?key=${this.locationIQApiKey}&lat=${lat}&lon=${lon}&format=json`;

    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw new Error('Error fetching location data');
    }
  }

  async findAll(): Promise<Report[]> {
    return this.reportModel.find().exec();
  }

  async updateStatus(reportId: string, status: string): Promise<Report> {
    return this.reportModel
      .findByIdAndUpdate(reportId, { status }, { new: true })
      .exec();
  }

  async followUp(id: string, followUpDto: FollowUpDto): Promise<Report> {
    return this.reportModel
      .findByIdAndUpdate(
        id,
        { petugas: followUpDto.petugas, status: 'Dalam proses' },
        { new: true },
      )
      .exec();
  }

  async setDone(id: string): Promise<Report> {
    return this.reportModel
      .findByIdAndUpdate(id, { status: 'Selesai' }, { new: true })
      .exec();
  }

  async findById(id: string): Promise<Report> {
    return this.reportModel.findById(id).exec();
  }

  async findByCategory(category: string): Promise<Report[]> {
    const reports = await this.reportModel.find({ category }).exec();
    if (!reports || reports.length === 0) {
      throw new NotFoundException(`No reports found for category: ${category}`);
    }
    return reports;
  }

  async findByDesa(desa: string): Promise<Report[]> {
    const reports = await this.reportModel.find({ desa }).exec();
    if (!reports || reports.length === 0) {
      throw new NotFoundException(`No reports found in desa: ${desa}`);
    }
    return reports;
  }
}
