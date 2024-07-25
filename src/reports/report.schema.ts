import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from 'src/auth/schemas/user.schema';

export type ReportDocument = Report & Document;

export enum ReportStatus {
  Pending = 'Pending',
  InProgress = 'In Progress',
  Resolved = 'Resolved',
  Rejected = 'Rejected',
  Closed = 'Closed',
}

@Schema()
export class Report {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  desa: string;

  @Prop({ required: true })
  image: string[];

  @Prop({ required: false })
  imageDone: string[];

  @Prop({
    category: {
      type: String,
      enum: ['Sampah', 'Infrastruktur'],
      required: true,
    },
  })
  category: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  latitude: number;

  @Prop({ required: true })
  longitude: number;

  @Prop({ default: ReportStatus.Pending, enum: ReportStatus })
  status: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  pelapor: string;

  @Prop({
    required: false,
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  petugas: string;
}

export const ReportSchema = SchemaFactory.createForClass(Report);
