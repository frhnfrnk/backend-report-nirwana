import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from 'src/auth/schemas/user.schema';

export type ReportDocument = Report & Document;

@Schema()
export class Report {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  desa: string;

  @Prop({ required: true })
  image: string;

  @Prop({
    category: {
      type: String,
      enum: ['Sampah', 'Infrastruktur'],
      required: true,
    },
  })
  @Prop({
    coordinates: {
      type: [Number],
      required: true,
    },
    address: {
      type: String,
      required: false,
    },
  })
  location: {
    coordinates: number[];
    address: string;
  };

  @Prop({ default: 'Pending' })
  status: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  @Prop({ required: true, type: User })
  pelapor: User;

  @Prop({ required: false, type: User })
  petugas: User;
}

export const ReportSchema = SchemaFactory.createForClass(Report);
