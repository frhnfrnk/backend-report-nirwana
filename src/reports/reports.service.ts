import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Report, ReportDocument } from './report.schema';
import { CreateReportDto } from './create-report.dto';
import { FollowUpDto } from './followup.dto';
import axios from 'axios';
import { User } from 'src/auth/schemas/user.schema';
import { UpdateReportDto } from './update-report.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Report.name) private reportModel: Model<ReportDocument>,
  ) {}

  private readonly locationIQApiKey = process.env.LOCATIONIQ_API_KEY;

  async create(createReportDto: CreateReportDto, user: User): Promise<Report> {
    // Reverse Geocoding menggunakan LocationIQ
    const locationData = await this.reverseGeocode(
      createReportDto.latitude,
      createReportDto.longitude,
    );

    const report = {
      ...createReportDto,
      pelapor: user._id,
      address: locationData.display_name,
      desa: locationData.address.village,
      petugas: null,
    };

    const createdReport = new this.reportModel(report);
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
    const data = await this.reportModel.find().populate('pelapor').exec();
    return data;
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

  async setDone(id: string, updateDto: UpdateReportDto): Promise<Report> {
    const image = updateDto.imageDone;
    return this.reportModel.findByIdAndUpdate(
      id,
      { status: 'Resolved', imageDone: image },
      { new: true },
    );
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

  async findUserReports(user: any): Promise<Report[]> {
    return this.reportModel.find({ pelapor: user._id }).exec();
  }
}
